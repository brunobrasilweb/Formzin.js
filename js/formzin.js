/* ========================================================================
 * Formzin: formzin.js v0.1
 * http://formzin.com
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
            Formzin.formatacao();
            Formzin.validacaoReal();
            Formzin.manipulacao();
        });
    },
    validacaoReal: function() {
        //Validar Campo
        Formzin.vCampo();
        //Validar CPF
        Formzin.vCpf();
        //Validar CNPJ
        Formzin.vCnpj();
        //Validar Data
        Formzin.vData();
    },
    formatacao: function() {
        // CPF
        Formzin.fCpf();
        // CNPJ
        Formzin.fCnpj();
        // Inteiro
        Formzin.fInteiro();
        // Data
        Formzin.fData();
        // CEP
        Formzin.fCep();
        // Moeda
        Formzin.fMoeda();
        // Caixa Alta
        Formzin.fCaixaAlta();
        // Telefone
        Formzin.fTelefone();
        // Cartão de Crédito
        Formzin.fCartaoCredito();
        // Mascara
        Formzin.fMascara();
    },
    manipulacao: function() {
        // Buscar endereço
        Formzin.mBuscarEndereco();
    },
    fMascara: function() {
        var mascara = jQuery(".mascara");
        mascara.bind('keyup', function() {
            var v = jQuery(this).val();
            v = Formzin.formatarCampo(jQuery(this), jQuery(this).attr("formato"));
            jQuery(this).val(v);
        });
    },
    fCpf: function() {
        var cpf = jQuery(".cpf");
        cpf.attr("maxlength", "14");
        cpf.bind('keyup', function() {
            var v = jQuery(this).val();
            v = Formzin.formatarCampo(jQuery(this), "000.000.000-00");
            jQuery(this).val(v);
        });
    },
    fCnpj: function() {
        var cnpj = jQuery(".cnpj");
        cnpj.attr("maxlength", "18");
        cnpj.bind('keyup', function() {
            var v = jQuery(this).val();
            v = Formzin.formatarCampo(jQuery(this), "00.000.000/0000-00");
            jQuery(this).val(v);
        });
    },
    fInteiro: function() {
        jQuery(".inteiro").bind('keydown keyup', function() {
            var v = jQuery(this).val().replace(/\D/g, "");
            jQuery(this).val(v);
        });
    },
    fData: function() {
        var data = jQuery(".data");
        data.attr("maxlength", "10");
        data.bind('keyup', function() {
            var separador = jQuery(this).attr('separador');
            var v = jQuery(this).val();

            if (!separador)
                separador = "/";

            v = Formzin.formatarCampo(jQuery(this), "00" + separador + "00" + separador + "0000");

            jQuery(this).val(v);
        });
    },
    fCep: function() {
        var cep = jQuery(".cep");
        cep.attr("maxlength", "9");
        cep.bind('keyup', function() {
            var v = jQuery(this).val();
            v = Formzin.formatarCampo(jQuery(this), "00000-000");

            jQuery(this).val(v);
        });
    },
    fCaixaAlta: function() {
        var caixaAlta = jQuery(".caixa_alta");
        caixaAlta.attr("style", "text-transform: uppercase;");
        caixaAlta.bind('keydown keyup', function() {
            var v = jQuery(this).val();
            v = v.toUpperCase();

            jQuery(this).val(v);
        });
    },
    fTelefone: function() {
        var tel = jQuery(".telefone");
        tel.attr("maxlength", "15");
        tel.bind('keyup', function() {
            var v = jQuery(this).val();
            v = Formzin.formatarCampo(jQuery(this), "(00) 0000-00000");

            jQuery(this).val(v);
        });
    },
    fCartaoCredito: function() {
        var cartao = jQuery(".cartao_credito");
        cartao.attr("maxlength", "19");
        cartao.bind('keyup', function() {
            var v = jQuery(this).val();
            v = Formzin.formatarCampo(jQuery(this), "0000 0000 0000 0000");

            jQuery(this).val(v);
        });
    },
    fMoeda: function() { // crédito ao site jquerypriceformat.com
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
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar o CPF corretamente.</span>');
            } else if (jQuery(this).attr('minlength')) {
                if (jQuery(this).val().length < jQuery(this).attr('minlength'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no mínimo (' + jQuery(this).attr('minlength') + ') caracteres.</span>');
            } else if (jQuery(this).attr('maxlength')) {
                if (jQuery(this).val().length > jQuery(this).attr('maxlength'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no máximo (' + jQuery(this).attr('maxlength') + ') caracteres.</span>');
            }
        });
    },
    vCpf: function() {
        var cpf = jQuery(".validar-cpf");
        cpf.attr("maxlength", "14");
        cpf.bind('keydown keyup change', function() {
            var v = jQuery(this).val();
            var id = jQuery(this).attr("id");
            valido = Formzin.validarCpf(v);
            if (valido == false) {
                jQuery(".error-validacao-" + id).remove();
                jQuery(this).attr('style', 'border: 1px solid red;');
                jQuery(this).addClass('campo-validacao-' + id);
                if (jQuery(this).attr('msn_validacao'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + jQuery(this).attr('msn_validacao') + '</span>');
                else
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar o CPF corretamente.</span>');
            } else {
                jQuery(this).removeAttr('style', 'border: 1px solid red;');
                jQuery(this).removeClass('campo-validacao-' + id);
                jQuery(".error-validacao-" + id).remove();
            }
        });
    },
    vCnpj: function() {
        var cnpj = jQuery(".validar-cnpj");
        cnpj.bind('keydown keyup change', function() {
            var v = jQuery(this).val();
            var id = jQuery(this).attr("id");
            valido = Formzin.validarCnpj(v);
            if (valido == false) {
                jQuery(".error-validacao-" + id).remove();
                jQuery(this).attr('style', 'border: 1px solid red;');
                jQuery(this).addClass('campo-validacao-' + id);
                if (jQuery(this).attr('msn_validacao'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + jQuery(this).attr('msn_validacao') + '</span>');
                else
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar o CNPJ corretamente.</span>');
            } else {
                jQuery(this).removeAttr('style', 'border: 1px solid red;');
                jQuery(this).removeClass('campo-validacao-' + id);
                jQuery(".error-validacao-" + id).remove();
            }
        });
    },
    vData: function() {
        var data = jQuery(".validar-data");
        data.bind('keydown keyup change', function() {
            var v = jQuery(this).val();
            var id = jQuery(this).attr("id");

            valido = Formzin.validarData(v);
            if (valido == false) {
                jQuery(".error-validacao-" + id).remove();
                jQuery(this).attr('style', 'border: 1px solid red;');
                jQuery(this).addClass('campo-validacao-' + id);
                if (jQuery(this).attr('msn_validacao'))
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + jQuery(this).attr('msn_validacao') + '</span>');
                else
                    jQuery(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar a data corretamente.</span>');
            } else {
                jQuery(this).removeAttr('style', 'border: 1px solid red;');
                jQuery(this).removeClass('campo-validacao-' + id);
                jQuery(".error-validacao-" + id).remove();
            }
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
    formatarCampo: function(obj, mask, evt) {
        try {
            var value = obj.val();

            // If user pressed DEL or BACK SPACE, clean the value
            try {
                var e = (evt.which) ? evt.which : event.keyCode;
                if (e == 46 || e == 8) {
                    obj.val("");
                    return;
                }
            } catch (e1) {
            }

            var literalPattern = /[0\*]/;
            var numberPattern = /[0-9]/;
            var newValue = "";

            for (var vId = 0, mId = 0; mId < mask.length; ) {
                if (mId >= value.length)
                    break;

                // Number expected but got a different value, store only the valid portion
                if (mask[mId] == '0' && value[vId].match(numberPattern) == null) {
                    break;
                }

                // Found a literal
                while (mask[mId].match(literalPattern) == null) {
                    if (value[vId] == mask[mId])
                        break;

                    newValue += mask[mId++];
                }

                newValue += value[vId++];
                mId++;
            }

            return newValue;
        } catch (e) {
        }
    },
    validarCpf: function(cpf) { // Credito ao site www.geradorcpf.com
        cpf = cpf.replace(/[^\d]+/g, '');

        if (cpf == '')
            return false;

        // Elimina CPFs invalidos conhecidos
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

        // Valida 1o digito
        add = 0;
        for (i = 0; i < 9; i ++)
            add += parseInt(cpf.charAt(i)) * (10 - i);
        rev = 11 - (add % 11);
        if (rev == 10 || rev == 11)
            rev = 0;
        if (rev != parseInt(cpf.charAt(9)))
            return false;

        // Valida 2o digito
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
    validarCnpj: function(cnpj) { // crédito ao site www.geradorcnpj.com

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

    },
    validarData: function(valor) { // Crédito ao site http://www.codigocomcafe.com/2009/08/validando-datas-com-javascript-e-regex/
        regex = /^((((0?[1-9]|1\d|2[0-8])\/(0?[1-9]|1[0-2]))|((29|30)\/(0?[13456789]|1[0-2]))|(31\/(0?[13578]|1[02])))\/((19|20)?\d\d))jQuery|((29\/0?2\/)((19|20)?(0[48]|[2468][048]|[13579][26])|(20)?00))jQuery/;

        resultado = regex.exec(valor);
        if (!resultado)
            return false;
        else
            return true;
    }
};

Formzin.iniciar();