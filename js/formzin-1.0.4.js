/* ========================================================================
 * Formzin: formzin.js v1.0.4
 * http://brunobrasilweb.github.io/Formzin.js
 * ========================================================================
 * Copyright (c) 2013-2014 @brunobrasilweb.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * thtp://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */
var Formzin = new function () {
    this.iniciar = function () {
        jQuery(document).ready(function () {
            var formatos = [
                {".cpf": "000.000.000-00"}
                , {".cnpj": "00.000.000/0000-00"}
                , {".cep": "00000-000"}
                , {".telefone": "(00) 0000-00000"}
                , {".cartao_credito": "0000 0000 0000 0000"}
                , {".inteiro": "inteiro"}
                , {".mascara": "mascara"}
                , {".caixa_alta": "caixa_alta"}
                , {".data": "data"}
                , {".placa_carro": "SSS 0000"}
                , {".codigo_rastreio": "SS000000000SS"}
                , {".cc_titular": "caixa_alta"}
                , {".cc_numero": "0000 0000 0000 0000"}
                , {".cc_vencimento": "00/00"}
                , {".cc_cod_seguranca": "inteiro"}
            ];

            jQuery.each(formatos, function () {
                jQuery.each(this, function (index, value) {
                    Formzin.iniciarFormato(jQuery(index), value);
                });
            });

            Formzin.fMoeda();
            Formzin.vCampo();

            Formzin.validar(jQuery('.validar-email'), Formzin.validarEmail, 'Por favor preenchar um e-mail v&aacute;lido.');
            Formzin.validar(jQuery('.validar-url'), Formzin.validarUrl, 'Por favor preenchar uma url v&aacute;lida.');
            Formzin.validar(jQuery('.validar-cpf'), Formzin.validarCpf, 'Por favor preenchar o CPF corretamente.');
            Formzin.validar(jQuery('.validar-cnpj'), Formzin.validarCnpj, 'Por favor preenchar o CNPJ corretamente.');
            Formzin.validar(jQuery('.validar-data'), Formzin.validarData, 'Por favor preenchar a data corretamente.');
            Formzin.validar(jQuery('.validar-cartao-credito'), Formzin.validarCartaoCredito, 'Por favor preenchar o cart&atilde;o cr&eacute;dito corretamente.');

            Formzin.mBuscarEndereco();
            Formzin.mPagamentoCartaoCredito();
            Formzin.mSelecao();

            Formzin.focus();
        });
    };

    this.focus = function () {
        jQuery(".focus").focus();
    };

    this.iniciarFormato = function (e, f) {
        jQuery(e).each(function () {
            Formzin.formatar(jQuery(this), f);
        });
    };

    this._formatar = function (e, t) {
        var o = e;

        if (!e.length) {
            return;
        }

        if (t === "inteiro") {
            e = e.val().replace(/\D/g, "");
        } else if (t === "mascara") {
            e = this.formatarCampo(o, o.attr("data-formato"));
        } else if (t === "caixa_alta") {
            e = e.val().toUpperCase();
        } else if (t === "data") {
            var n = o.attr("data-separador");
            if (!n)
                n = "/";
            e = this.formatarCampo(o, "00" + n + "00" + n + "0000");
        } else {
            e = this.formatarCampo(o, t);
        }

        o.val(e);
    };

    this.formatar = function (e, t) {
        this._formatar(e, t);

        if (t === "caixa_alta")
            jQuery(".caixa_alta").attr("style", "text-transform: uppercase;");

        // FORMATAR
        e.bind("keyup", function (a, b) {
            return function () {
                this._formatar(a, b);
            }.bind(this);
        }.bind(this)(e, t));

        // VERIFICAR O CAMPO ESTA DIFERENTE DO FORMATO PARA LIMPAR
        e.bind("blur", function (a, b) {
            return function () {
                var val = a.val();

                if (a.hasClass("telefone")) {
                    if (val.length !== 14 && val.length !== 15)
                        a.val('');
                } else if (a.hasClass("data")) {
                    if (val.length !== 10)
                        a.val('');
                } else if (a.hasClass("inteiro") || a.hasClass("caixa_alta")) {
                    return;
                }
            }.bind(this);
        }.bind(this)(e, t));

    };

    this.fMoeda = function () {
        var moeda = jQuery(".moeda");
        moeda.bind('keydown keyup', function () {
            var obj = jQuery(this);

            var prefix = (obj.attr('data-prefixo')) ? obj.attr('data-prefixo') : "";
            var centsSeparator = (obj.attr('data-decimal')) ? obj.attr('data-decimal') : ",";
            var thousandsSeparator = (obj.attr('data-milhar')) ? obj.attr('data-milhar') : ".";
            var limit = false;
            var centsLimit = (obj.attr('data-limite_decimal')) ? parseInt(obj.attr('data-limite_decimal')) : 2;
            var formatted = '';
            var thousandsFormatted = '';
            var str = obj.val();

            var isNumber = /[0-9]/;

            for (var i = 0; i < (str.length); i++) {
                char = str.substr(i, 1);
                if (formatted.length == 0 && char == 0)
                    char = false;
                if (char && char.match(isNumber)) {
                    if (limit) {
                        if (formatted.length < limit)
                            formatted = formatted + char;
                    } else {
                        formatted = formatted + char;
                    }
                }
            }

            while (formatted.length < (centsLimit + 1))
                formatted = '0' + formatted;
            var centsVal = formatted.substr(formatted.length - centsLimit, centsLimit);
            var integerVal = formatted.substr(0, formatted.length - centsLimit);

            formatted = integerVal + centsSeparator + centsVal;

            if (thousandsSeparator) {
                var thousandsCount = 0;
                for (var j = integerVal.length; j > 0; j--) {
                    char = integerVal.substr(j - 1, 1);
                    thousandsCount++;
                    if (thousandsCount % 3 == 0)
                        char = thousandsSeparator + char;
                    thousandsFormatted = char + thousandsFormatted;
                }
                if (thousandsFormatted.substr(0, 1) == thousandsSeparator)
                    thousandsFormatted = thousandsFormatted.substring(1, thousandsFormatted.length);
                formatted = thousandsFormatted + centsSeparator + centsVal;
            }

            if (prefix)
                formatted = prefix + formatted;

            jQuery(this).val(formatted);

        });
    };

    this.vCampo = function () {
        var campo = jQuery(".validar-campo");
        campo.bind('blur focus keydown keyup change', function () {
            var v = jQuery(this).val();
            var id = jQuery(this).attr("id");

            jQuery(this).removeAttr('style', 'border: 1px solid red;');
            jQuery(this).removeClass('campo-validacao');
            jQuery('.error-validacao-' + id).remove();

            if (v === "") {
                jQuery(this).attr('style', 'border: 1px solid red;');
                jQuery(this).addClass('campo-validacao');
                jQuery('.error-validacao-' + id).remove();
                if (jQuery(this).attr('data-msn_validacao'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + jQuery(this).attr('data-msn_validacao') + '</span>');
                else
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar campo.</span>');
            } else if (jQuery(this).attr('data-minlength')) {
                if (jQuery(this).val().length < jQuery(this).attr('data-minlength'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no m&iacute;nimo (' + jQuery(this).attr('data-minlength') + ') caracteres.</span>');
            } else if (jQuery(this).attr('maxlength')) {
                if (jQuery(this).val().length > jQuery(this).attr('maxlength'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no m&aacute;ximo (' + jQuery(this).attr('maxlength') + ') caracteres.</span>');
            }
        });
    };

    this.validar = function (obj, func, msn) {
        obj.bind('keydown keyup change', function () {
            var v = jQuery(this).val();
            valido = func(v);
            Formzin.msnValidacao(jQuery(this), valido, msn);
        });
    };

    this.mBuscarEndereco = function () {
        jQuery(".buscar_endereco").change(function () {
            var cep = jQuery(this);
            jQuery.getJSON("https://viacep.com.br/ws/" + cep.val() + "/json/",
            function (data) {
                if (data.logradouro) {
                    jQuery("." + cep.attr("data-prefixo") + "bairro").val(data.bairro);
                    jQuery("." + cep.attr("data-prefixo") + "cidade").val(data.localidade);
                    jQuery("." + cep.attr("data-prefixo") + "logradouro").val(data.logradouro);
                    jQuery("." + cep.attr("data-prefixo") + "uf").val(data.uf);
                    jQuery("." + cep.attr("data-prefixo") + "ibge").val(data.ibge);

                    if (cep.attr("data-readonly")) {
                        jQuery("." + cep.attr("data-prefixo") + "bairro").attr("readonly", true);
                        jQuery("." + cep.attr("data-prefixo") + "cidade").attr("readonly", true);
                        jQuery("." + cep.attr("data-prefixo") + "logradouro").attr("readonly", true);
                        jQuery("." + cep.attr("data-prefixo") + "uf").attr("readonly", true);
                        jQuery("." + cep.attr("data-prefixo") + "ibge").attr("readonly", true);
                    } else {
                        jQuery("." + cep.attr("data-prefixo") + "bairro").attr("readonly", false);
                        jQuery("." + cep.attr("data-prefixo") + "cidade").attr("readonly", false);
                        jQuery("." + cep.attr("data-prefixo") + "logradouro").attr("readonly", false);
                        jQuery("." + cep.attr("data-prefixo") + "ibge").attr("readonly", false);
                    }
                } else {
                    jQuery("." + cep.attr("data-prefixo") + "bairro").attr("readonly", false);
                    jQuery("." + cep.attr("data-prefixo") + "cidade").attr("readonly", false);
                    jQuery("." + cep.attr("data-prefixo") + "logradouro").attr("readonly", false);
                    jQuery("." + cep.attr("data-prefixo") + "uf").attr("readonly", false);
                }
            });
        });
    };

    this.mPagamentoCartaoCredito = function () {
        jQuery(".cc_numero")
                .attr("style", "padding-left: 35px; background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAAsCAYAAAApSpU1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OUFFQzJFN0Y4NTM3MTFFM0ExMjdDRDcwQkQ5NzQ5RTEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OUFFQzJFN0U4NTM3MTFFM0ExMjdDRDcwQkQ5NzQ5RTEiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFMzM3RTMwRDI3NzExRTE5MDg1QUFDNzhCNTREMzEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkM2RTQ0NjlBRDI3NzExRTE5MDg1QUFDNzhCNTREMzEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+t5dkQQAABLNJREFUeNrsm8lPK0cQxtuOQcHsiwWITTCsAiQgIEAgBBfEiUP+0JwQN6Toif0AHECAAbGvZgcbCYid+TW0NWOP7UlCFL28/qTG45npqeqvvqoaj41nd3dXmMgzx+/m6DGHR2jEzLFijlHDMJ59nzu/+f3+7tzcXE3PBzzhcPiXSCTyDeF4TCWhnD8CgYBWUAJCoRCK+gklMTyxWEyz4qAo+PGaf7wejxaRI0MfvHi9ulBn5sqrOcgMTZIL+OI3BrpwayVpkjRJmiRNkiZJ3wJo/K+UdH19Ld7e3uRg+19V0veIxcVFcXx8LLfz8vJEcXGxKCsr+2/TLRKJiJeXF7ldWlrqeA4RfXx8FDk5OcLv96ecr1BQUCCysrLSnmMF5zIHFBYWisbGRnF/fy/t1tbWplzHzc2NfHXy60uURLQ2NjbE8/NzfB+RGxkZSTJ4dHQkVldXRXV1tRgYGEg6tr6+7mijpaVFdHZ2pj0HVFRUiOHhYbnd2toq1XRyciK6u7sdF39xcSGWl5fF6+urzff29nZRU1PzNSRB0NLSklw0FyZ6oVBIErGyshJ3WGFnZ0dkZ2dLx1GFk+NjY2M25TBne3tbFBUVSTUEAgF5DIVgBwI4ppRknYsd7HENwzCSCJqdnZXHCUJdXZ14eHiQ57Im4IaotOmGhLkYzPf09MQdzM/Pl8eI+Pn5uYyukjRqY1Esji8ZUEciSkpKbNuk7vT0tLi6upLBICWsPhEY6xy1H9UBgoc9qy9gbW1N+jwxMWHzvby8XJLH2rCt7P2t7kYkQFNTky2CKj0mJydtTh0eHsrziA6L3d/fdyVnFgeUgtzi4OBALrihoUHaxb4CdZGA1dfXJ/nOe2qZ6o6ulERknJQUDofjxdXpuM/ni+9HWUgfcthfWVkp3xNtJWl1LlG0qvX29laqlQVb7ahtJ/+Uatva2uQxFRSUizJUDaLbOfmu1MMaUxV7tT+tkv5KF0B1LJg5LEDNVSnhBMhhkC7j4+NJEU8HdV3mYI+UzGQvsat+SXdThil2iS0fQii2KIZje3t7cj9d0IrLy0vZ0q15PzQ0FL/G3NycnMN13DrOPJXK8/PztmOkHKVA+Us6WUtC4i2BGyGkLdwUOZXryNka6a2tLdklMAIBKILa1dHRYasLMzMzYnNzUxbzRFukJfs5h1Y+Ojpqs5Eq3VStHBwctBEAcRRrOjL+VlVVyX3Nzc1JKlVBhcxM94gZP5b09vaKu7s7GXGcIwJ0NQjCMM4og4ktGGVQa05PT2X0U8medKO+oEw3oGty3USFqPcq5biPAlNTU7L74XswGJTvUXhfX1/GzubqPgnDXV1dMkILCwu2G7L+/n5JFF2GjwROBukizMWpVCDSZ2dnkniVvqmAOgkaqnUqxqiHoJDiBIAbXoKKjwzlO2siwG7A19w/m68vpFamOoCDiR8Nvhco/1V5cIOnpyfJvWuSfkQokvRDN/1kUj+Z1ErSJOl000rSJGlokv5RTYp9lKSY/llgMiQ3KClqjuD7+7umxIJPPngsEVW/424zx298IPd6vT+8oqLRKAoKmuNXc2x6Pv9tgidSVeYo03Xqgydz8A3BqWEYb38KMAAfdI6dhxQApgAAAABJRU5ErkJggg==) no-repeat 5px center; background-size: 25px 15px;");
        jQuery(".cc_titular").attr({
            "style": "text-transform: uppercase;"
        });
        jQuery(".cc_vencimento").attr("placeholder", "MM/AA");
        jQuery(".cc_cod_seguranca").attr({
            "style": "padding-left: 35px; background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAAsCAYAAAApSpU1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCRTMzN0UzMEQyNzcxMUUxOTA4NUFBQzc4QjU0RDMxMCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDNkU0NDY5QUQyNzcxMUUxOTA4NUFBQzc4QjU0RDMxMCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkJFMzM3RTJFRDI3NzExRTE5MDg1QUFDNzhCNTREMzEwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkJFMzM3RTJGRDI3NzExRTE5MDg1QUFDNzhCNTREMzEwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+c/edDQAAA2JJREFUeNrsms1OGlEUx8/MgFJFCQ2yqYnGxMboSon7LnSDuzYsfAFrfQGfwSdowyuYdIcbXRCXfnSnsZIYTewGSQmCVgVmev+3HjoQsQN1xZx/QuZ+D/d3zz1zLozhOA5dX1+Hq9Vq9ubmZs62bYN8LtM0ncHBwW/BYPDd8PBwJYDC+/v7XQVoVlWQYfieESnDMcrlckLx2FXZORAxLi4u6v39/YayJhL9kbIiGI8zNjZmmSofeHh4MJSJCZnmLUe1Wg1GFAAZodN+22le8EldOaHz83N9HRkZodvbW8rn8wSfpnwbjY+P09XVla7jMuQhrucxUM/l8Xhc90E5X9GWr7jPwMBAI48xcT06OqKZmRk9DqfdY6MP+vL37RCSEWgp8KRsNkvz8/N0fHysJ8fAlpaWKJPJ6DwmjC+MSaAdhD6o4/ao29/f15OAGCQmgr4YD/VYALTd29vT9cqHagBo414w3JPTW1tblEwm9b15fPRbW1vzDIgfYl1ttdbV5hVziy2rVYVCQZfzarOw0mwdPGFAwCKwuN/09PSTY6It0hgHbdzWjI9ywt1sN73VQrlc7peKB0g5cHFEj+rr60P8SJOTk6/Mbrabj5x299vNd+GAWNK/LUk/3ZaXl2l0dJQuLy+FzqPcPDQkeP1YLEYSdTc/wS3LooODg7/brV6vCxmX3DwEkkB6YUjqxCtkXHLzaECybVvIuOTmIZA6gSTBZPtgsnHADYVCQqZFd3d3zQdckYezm8gDJPkrqVluHmJJHhTw0qhSqfQsgHA47B0SzOu5MGBqaqrnAJ2cnMh2e/Ht1iuO++zsjDY3N3U6kUjQ4eEhRaNRmpiY0GmULSws+NtxAwhULBY1GEBDGQBBKPN9CAAgsCSGtbOz00ijnGH5PgTAT64AAqtBemNjg9bX12l7e5vS6bRYEixlcXFR+x4AQTqVSmlQnO7UkhoH3KGhIWr3fhLipF4NAdrFSXg/qVwuNx9w5VjS3pICnVCXY8l/hu69bE2y3Z4BxMc0OZZ4tCRHZeQH7qfiI9MEFweQbJucU/m3pFngUbPr35GE466trnx8/zn95evrSPQtdfmiaY/J+Vkqnn5aWf0APsbjC5RBlXkTiURiKm+Coh/fMOHdZFmWXSqVCir5Q/Go/hZgAIS/w3X4SEpcAAAAAElFTkSuQmCC) no-repeat 5px center; background-size: 25px 15px;"
            , "maxlength": 4
        });
        jQuery(".cc_cod_seguranca").attr("placeholder", "CVV");
        jQuery(".cc_parcela").html(this.montarParcelas());
    };

    this.mSelecao = function () {
        jQuery(".selecao").change(function () {
            var e = jQuery(this);
            var classeSelecao = e.attr('data-classe_selecao');

            jQuery("." + classeSelecao).hide();

            if ((e.attr('type') === 'checkbox' && e.is(":checked"))
                    || (e.attr('type') === 'radio' && e.is(":checked"))
                    || e.is("select")) {
                Formzin._selecao(e);
            }
        }).change();
    };

    this._selecao = function (e) {
        var selecao = e.attr('data-selecao').split(',');

        for (var s = 0; s < selecao.length; s++) {
            var r = selecao[s].split("|");
            if (e.val() === r[0])
                jQuery("." + r[1]).show();
        }
    };

    this.montarParcelas = function () {
        var valorTotal = parseFloat(jQuery(".cc_parcela").attr('data-valor_total'));
        var totalParcelas = parseInt(jQuery(".cc_parcela").attr('data-total_parcelas'));
        var descontoAvista = parseFloat(jQuery(".cc_parcela").attr('data-desconto_avista'));
        var tipoDesconto = jQuery(".cc_parcela").attr('data-tipo_desconto');
        var juros = parseFloat(jQuery(".cc_parcela").attr('data-juros'));
        var parcelasJuros = jQuery(".cc_parcela").attr('data-parcelas_juros');
        if (parcelasJuros)
            parcelasJuros = parcelasJuros.split(',');

        var val = jQuery(".cc_parcela").attr('data-val');
        var option = '<option value="">Selecione a Parcela</option>';

        for (var p = 1; p <= totalParcelas; p++) {
            valorParcela = valorTotal / p;
            msnParcela = '';

            if (descontoAvista && p === 1) {
                if (tipoDesconto && tipoDesconto === 'moeda') {
                    valorParcela = (valorTotal - descontoAvista) / p;
                    msnParcela = 'com (R$ ' + this.formatarReal(descontoAvista) + ' de desconto)';
                } else {
                    valorParcela = ((valorTotal - (valorTotal * descontoAvista) / 100)) / p;
                    msnParcela = 'com (' + descontoAvista + '% de desconto)';
                }
            } else {
                if (juros && parcelasJuros && parcelasJuros.indexOf(String(p)) !== -1) {
                    valorParcela = ((valorTotal + (valorTotal * juros) / 100)) / p;
                    msnParcela = 'com juros';
                }
            }

            valorParcela = this.formatarReal(valorParcela);

            option += '<option ' + ((val && val === p) ? 'selected' : '') + ' value="' + p + '">' + p + 'x de R$ ' + valorParcela + ' ' + msnParcela + '</option>';
        }

        return option;
    };

    this.msnValidacao = function (obj, valido, msn) {
        var id = obj.attr('id');
        if (valido === false) {
            jQuery(".error-validacao-" + id).remove();
            obj.attr('style', 'border: 1px solid red;');
            obj.addClass('campo-validacao-' + id);
            if (obj.attr('data-msn_validacao'))
                obj.after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + obj.attr('data-msn_validacao') + '</span>');
            else
                obj.after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + msn + '</span>');
        } else {
            obj.removeAttr('style', 'border: 1px solid red;');
            obj.removeClass('campo-validacao-' + id);
            jQuery(".error-validacao-" + id).remove();
        }
    };

    this.formatarCampo = function (obj, mask, skipMaskChars) {
        if (obj.val()) {
            var trans = {
                '0': {pattern: /\d/},
                'A': {pattern: /[a-zA-Z0-9]/},
                'S': {pattern: /[a-zA-Z]/}
            };

            var buf = [],
                    value = obj.val(),
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = "push",
                    lastMaskChar,
                    check;

            lastMaskChar = maskLen - 1;
            check = function () {
                return m < maskLen && v < valLen;
            };

            while (check()) {

                var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = trans[maskDigit];

                if (translation) {
                    if (valDigit.match(translation.pattern)) {
                        buf[addMethod](valDigit);
                        m += offset;
                    } else if (translation.optional) {
                        m += offset;
                        v -= offset;
                    }
                    v += offset;
                } else {
                    if (skipMaskChars === undefined) {
                        buf[addMethod](maskDigit);
                    }

                    if (valDigit === maskDigit) {
                        v += offset;
                    }

                    m += offset;
                }
            }

            return buf.join("");
        } else {
            return "";
        }

    };

    this.validarEmail = function (email) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!pattern.test(email))
            return false;

        return true;
    };

    this.validarUrl = function (url) {
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (pattern.test(url))
            return true;
        else
            return false;
    };

    this.validarCpf = function (cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf === '')
            return false;

        if (cpf.length !== 11 ||
                cpf === "00000000000" ||
                cpf === "11111111111" ||
                cpf === "22222222222" ||
                cpf === "33333333333" ||
                cpf === "44444444444" ||
                cpf === "55555555555" ||
                cpf === "66666666666" ||
                cpf === "77777777777" ||
                cpf === "88888888888" ||
                cpf === "99999999999")
            return false;

        add = 0;
        for (i = 0; i < 9; i ++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== parseInt(cpf.charAt(9)))
            return false;

        add = 0;
        for (i = 0; i < 10; i ++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11)
            rev = 0;
        if (rev !== parseInt(cpf.charAt(10)))
            return false;

        return true;
    };

    this.validarCnpj = function (cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '')
            return false;

        if (cnpj.length != 14)
            return false;

        // Elimina CNPJs invalidos conhecidos
        if (cnpj == "00000000000000" ||
                cnpj == "11111111111111" ||
                cnpj == "22222222222222" ||
                cnpj == "33333333333333" ||
                cnpj == "44444444444444" ||
                cnpj == "55555555555555" ||
                cnpj == "66666666666666" ||
                cnpj == "77777777777777" ||
                cnpj == "88888888888888" ||
                cnpj == "99999999999999")
            return false;

        // Valida DVs
        tamanho = cnpj.length - 2
        numeros = cnpj.substring(0, tamanho);
        digitos = cnpj.substring(tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(0))
            return false;

        tamanho = tamanho + 1;
        numeros = cnpj.substring(0, tamanho);
        soma = 0;
        pos = tamanho - 7;
        for (i = tamanho; i >= 1; i--) {
            soma += numeros.charAt(tamanho - i) * pos--;
            if (pos < 2)
                pos = 9;
        }
        resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
        if (resultado != digitos.charAt(1))
            return false;

        return true;

    };

    this.validarData = function (valor) {
        var currVal = valor;
        if (currVal === '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern);

        if (dtArray === null)
            return false;

        dtMonth = dtArray[3];
        dtDay = dtArray[1];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth === 4 || dtMonth === 6 || dtMonth === 9 || dtMonth === 11) && dtDay === 31)
            return false;
        else if (dtMonth === 2)
        {
            var isleap = (dtYear % 4 === 0 && (dtYear % 100 !== 0 || dtYear % 400 === 0));
            if (dtDay > 29 || (dtDay === 29 && !isleap))
                return false;
        }
        return true;
    };

    this.validarCartaoCredito = function (s) {
        var v = "0123456789";
        var w = "";
        for (i = 0; i < s.length; i++) {
            x = s.charAt(i);
            if (v.indexOf(x, 0) !== -1)
                w += x;
        }

        j = w.length / 2;
        k = Math.floor(j);
        m = Math.ceil(j) - k;
        c = 0;
        for (i = 0; i < k; i++) {
            a = w.charAt(i * 2 + m) * 2;
            c += a > 9 ? Math.floor(a / 10 + a % 10) : a;
        }
        for (i = 0; i < k + m; i++)
            c += w.charAt(i * 2 + 1 - m) * 1;
        return (c % 10 === 0);
    };

    this.formatarReal = function (mixed) {
        var int = parseInt(mixed.toFixed(2).toString().replace(/[^\d]+/g, ''));
        var tmp = int + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
    };
};

Formzin.iniciar();
