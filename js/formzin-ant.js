/* ========================================================================
 * Formzin: formzin.js v0.3
 * http://brunobrasilweb.github.io/Formzin.js
 * ========================================================================
 * Copyright (c) 2013 @brunobrasilweb.
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
var Formzin = {
    iniciar: function() {
        jQuery(document).ready(function() {
            Formzin.formatar(jQuery('.cpf'), "000.000.000-00");
            Formzin.formatar(jQuery('.cnpj'), "00.000.000/0000-00");
            Formzin.formatar(jQuery('.cep'), "00000-000");
            Formzin.formatar(jQuery('.telefone'), "(00) 0000-00000");
            Formzin.formatar(jQuery('.cartao_credito'), "0000 0000 0000 0000");
            Formzin.formatar(jQuery('.inteiro'), "inteiro");
            Formzin.formatar(jQuery('.mascara'), "mascara");
            Formzin.formatar(jQuery('.caixa_alta'), "caixa_alta");
            Formzin.formatar(jQuery('.data'), "data");
            Formzin.formatar(jQuery('.placa_carro'), "SSS 0000");
            Formzin.formatar(jQuery('.codigo_rastreio'), "SS000000000SS");
            Formzin.fMoeda();

            Formzin.vCampo();
            Formzin.validar(jQuery('.validar-email'), Formzin.validarEmail, 'Por favor preenchar um e-mail v&aacute;lido.');
            Formzin.validar(jQuery('.validar-url'), Formzin.validarUrl, 'Por favor preenchar uma url v&aacute;lida.');
            Formzin.validar(jQuery('.validar-cpf'), Formzin.validarCpf, 'Por favor preenchar o CPF corretamente.');
            Formzin.validar(jQuery('.validar-cnpj'), Formzin.validarCnpj, 'Por favor preenchar o CNPJ corretamente.');
            Formzin.validar(jQuery('.validar-data'), Formzin.validarData, 'Por favor preenchar a data corretamente.');

            Formzin.mBuscarEndereco();
            Formzin.mPagamentoCartaoCredito();
        });
    },
    formatar: function(obj, formato) {
        //obj.val(Formzin.formatarCampo(obj, formato));

        if (formato == "caixa_alta")
            jQuery('.caixa_alta').attr("style", "text-transform: uppercase;");

        obj.bind('keyup', function() {
            var v = jQuery(this).val();

            if (formato == "inteiro") {
                v = v.replace(/\D/g, "");
            } else if (formato == "mascara") {
                v = Formzin.formatarCampo(jQuery(this), jQuery(this).attr("formato"));
            } else if (formato == "caixa_alta") {
                v = v.toUpperCase();
            } else if (formato == "data") {
                var separador = jQuery(this).attr('separador');

                if (!separador)
                    separador = "/";

                v = Formzin.formatarCampo(jQuery(this), "00" + separador + "00" + separador + "0000");
            } else {
                v = Formzin.formatarCampo(jQuery(this), formato);
            }

            jQuery(this).val(v);
        });
    },
    fMoeda: function() {
        var moeda = jQuery(".moeda");
        moeda.bind('keydown keyup', function() {
            var obj = jQuery(this);

            var prefix = (obj.attr('prefixo')) ? obj.attr('prefixo') : "";
            var centsSeparator = (obj.attr('decimal')) ? obj.attr('decimal') : ",";
            var thousandsSeparator = (obj.attr('milhar')) ? obj.attr('milhar') : ".";
            var limit = false;
            var centsLimit = (obj.attr('limite_decimal')) ? parseInt(obj.attr('limite_decimal')) : 2;
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
    },
    vCampo: function() {
        var campo = jQuery(".validar-campo");
        campo.bind('blur focus keydown keyup change', function() {
            var v = jQuery(this).val();
            var id = jQuery(this).attr("id");

            jQuery(this).removeAttr('style', 'border: 1px solid red;');
            jQuery(this).removeClass('campo-validacao');
            jQuery('.error-validacao-' + id).remove();

            if (v == "") {
                jQuery(this).attr('style', 'border: 1px solid red;');
                jQuery(this).addClass('campo-validacao');
                jQuery('.error-validacao-' + id).remove();
                if (jQuery(this).attr('msn_validacao'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + jQuery(this).attr('msn_validacao') + '</span>');
                else
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar campo.</span>');
            } else if (jQuery(this).attr('minlength')) {
                if (jQuery(this).val().length < jQuery(this).attr('minlength'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no m&iacute;nimo (' + jQuery(this).attr('minlength') + ') caracteres.</span>');
            } else if (jQuery(this).attr('maxlength')) {
                if (jQuery(this).val().length > jQuery(this).attr('maxlength'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no m&aacute;ximo (' + jQuery(this).attr('maxlength') + ') caracteres.</span>');
            }
        });
    },
    validar: function(obj, func, msn) {
        obj.bind('keydown keyup change', function() {
            var v = jQuery(this).val();
            valido = func(v);
            Formzin.msnValidacao(jQuery(this), valido, msn);
        });
    },
    mBuscarEndereco: function() {
        jQuery(".buscar_endereco").change(function() {
            var cep = jQuery(this);
            jQuery.getJSON("http://cep.republicavirtual.com.br/web_cep.php?cep=" + cep.val() + "&formato=json",
                    function(data) {
                        if (data.resultado === "1") {
                            jQuery("." + cep.attr("prefixo") + "bairro").val(data.bairro);
                            jQuery("." + cep.attr("prefixo") + "cidade").val(data.cidade);
                            jQuery("." + cep.attr("prefixo") + "logradouro").val(data.tipo_logradouro + ' ' + data.logradouro);
                            jQuery("." + cep.attr("prefixo") + "uf").val(data.uf);
                        }
                    });
        });
    },
    mPagamentoCartaoCredito: function() {
        jQuery(".cc_numero").attr("style", "padding-left: 35px; background:url('images/cartoes/cartao.png') no-repeat 5px center; background-size: 25px 15px;");
        jQuery(".cc_numero").attr("placeholder", "NÚMERO DO CARTÃO");
        jQuery(".cc_titular").attr("placeholder", "TITULAR DO CARTÃO");
        jQuery(".cc_vencimento").attr("placeholder", "MM/AA");
        jQuery(".cc_cod_seguranca").attr("style", "padding-left: 35px; background:url('images/cartoes/verso.png') no-repeat 5px center; background-size: 25px 15px;");
        jQuery(".cc_cod_seguranca").attr("placeholder", "CVV");
    },
    msnValidacao: function(obj, valido, msn) {
        var id = obj.attr('id');
        if (valido == false) {
            jQuery(".error-validacao-" + id).remove();
            obj.attr('style', 'border: 1px solid red;');
            obj.addClass('campo-validacao-' + id);
            if (obj.attr('msn_validacao'))
                obj.after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + obj.attr('msn_validacao') + '</span>');
            else
                obj.after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + msn + '</span>');
        } else {
            obj.removeAttr('style', 'border: 1px solid red;');
            obj.removeClass('campo-validacao-' + id);
            jQuery(".error-validacao-" + id).remove();
        }
    },
    formatarCampo: function(obj, mask, skipMaskChars) {
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
            check = function() {
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

    },
    validarEmail: function(email) {
        var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!pattern.test(email))
            return false;

        return true;
    },
    validarUrl: function(url) {
        var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        if (pattern.test(url))
            return true;
        else
            return false;
    },
    validarCpf: function(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf == '')
            return false;

        if (cpf.length != 11 ||
                cpf == "00000000000" ||
                cpf == "11111111111" ||
                cpf == "22222222222" ||
                cpf == "33333333333" ||
                cpf == "44444444444" ||
                cpf == "55555555555" ||
                cpf == "66666666666" ||
                cpf == "77777777777" ||
                cpf == "88888888888" ||
                cpf == "99999999999")
            return false;

        add = 0;
        for (i = 0; i < 9; i ++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;

        add = 0;
        for (i = 0; i < 10; i ++)
            add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(10)))
            return false;

        return true;
    },
    validarCnpj: function(cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '')
            return false;

        if (cnpj.length != 14)
            return false;

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

    },
    validarData: function(valor) {
        var currVal = valor;
        if (currVal == '')
            return false;

        var rxDatePattern = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;
        var dtArray = currVal.match(rxDatePattern);

        if (dtArray == null)
            return false;

        dtMonth = dtArray[3];
        dtDay = dtArray[1];
        dtYear = dtArray[5];

        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay > 31)
            return false;
        else if ((dtMonth == 4 || dtMonth == 6 || dtMonth == 9 || dtMonth == 11) && dtDay == 31)
            return false;
        else if (dtMonth == 2)
        {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay > 29 || (dtDay == 29 && !isleap))
                return false;
        }
        return true;
    }
};

Formzin.iniciar();