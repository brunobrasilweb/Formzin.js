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
        $(document).ready(function() {
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
        // Mascara
        Formzin.fMascara();
    },
    manipulacao: function() {
        // Buscar endereço
        Formzin.mBuscarEndereco();
    },
    fMascara: function() {
        var mascara = $(".mascara");
        mascara.bind('keyup', function() {
            var v = $(this).val();
            v = formatarCampo($(this), $(this).attr("formato"));
            $(this).val(v);
        });
    },
    fCpf: function() {
        var cpf = $(".cpf");
        cpf.attr("maxlength", "14");
        cpf.bind('keyup', function() {
            var v = $(this).val();
            v = formatarCampo($(this), "000.000.000-00");
            $(this).val(v);
        });
    },
    fCnpj: function() {
        var cnpj = $(".cnpj");
        cnpj.attr("maxlength", "18");
        cnpj.bind('keyup', function() {
            var v = $(this).val();
            v = formatarCampo($(this), "00.000.000/0000-00");
            $(this).val(v);
        });
    },
    fInteiro: function() {
        $(".inteiro").bind('keydown keyup', function() {
            var v = $(this).val().replace(/\D/g, "");
            $(this).val(v);
        });
    },
    fData: function() {
        var data = $(".data");
        data.attr("maxlength", "10");
        data.bind('keyup', function() {
            var separador = $(this).attr('separador');
            var v = $(this).val();

            if (!separador)
                separador = "/";

            v = formatarCampo($(this), "00" + separador + "00" + separador + "0000");

            $(this).val(v);
        });
    },
    fCep: function() {
        var cep = $(".cep");
        cep.attr("maxlength", "9");
        cep.bind('keyup', function() {
            var v = $(this).val();
            v = formatarCampo($(this), "00000-000");

            $(this).val(v);
        });
    },
    fCaixaAlta: function() {
        var caixaAlta = $(".caixa_alta");
        caixaAlta.attr("style", "text-transform: uppercase;");
        caixaAlta.bind('keydown keyup', function() {
            var v = $(this).val();
            v = v.toUpperCase();

            $(this).val(v);
        });
    },
    fMoeda: function() {
        var moeda = $(".moeda");
        moeda.bind('keydown keyup', function() {
            var obj = $(this);

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

            $(this).val(formatted);

        });
    },
    vCampo: function() {
        var campo = $(".validar-campo");
        campo.bind('blur focus keydown keyup change', function() {
            var v = $(this).val();
            var id = $(this).attr("id");
            
            $(this).removeAttr('style', 'border: 1px solid red;');
            $(this).removeClass('campo-validacao');
            $('.error-validacao-' + id).remove();
                
            if (v == "") {
                $(this).attr('style', 'border: 1px solid red;');
                $(this).addClass('campo-validacao');
                $('.error-validacao-' + id).remove();
                if ($(this).attr('msn_validacao'))
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + $(this).attr('msn_validacao') + '</span>');
                else
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar o CPF corretamente.</span>');
            } else if ($(this).attr('minlength')) {
                if ($(this).val().length < $(this).attr('minlength')) 
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no minimo (' + $(this).attr('minlength') + ') caracteres.</span>');
            } else if ($(this).attr('maxlength')) {
                if ($(this).val().length > $(this).attr('maxlength')) 
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor o campo deve ter no máximo (' + $(this).attr('maxlength') + ') caracteres.</span>');
            }
        });
    },
    vCpf: function() {
        var cpf = $(".validar-cpf");
        cpf.attr("maxlength", "14");
        cpf.bind('keydown keyup change', function() {
            var v = $(this).val();
            var id = $(this).attr("id");
            valido = validarCpf(v);
            if (valido == false) {
                $(".error-validacao-" + id).remove();
                $(this).attr('style', 'border: 1px solid red;');
                $(this).addClass('campo-validacao-' + id);
                if ($(this).attr('msn_validacao'))
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + $(this).attr('msn_validacao') + '</span>');
                else
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar o CPF corretamente.</span>');
            } else {
                $(this).removeAttr('style', 'border: 1px solid red;');
                $(this).removeClass('campo-validacao-' + id);
                $(".error-validacao-" + id).remove();
            }
        });
    },
    vCnpj: function() {
        var cnpj = $(".validar-cnpj");
        cnpj.bind('keydown keyup change', function() {
            var v = $(this).val();
            var id = $(this).attr("id");
            valido = validarCnpj(v);
            if (valido == false) {
                $(".error-validacao-" + id).remove();
                $(this).attr('style', 'border: 1px solid red;');
                $(this).addClass('campo-validacao-' + id);
                if ($(this).attr('msn_validacao'))
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + $(this).attr('msn_validacao') + '</span>');
                else
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar o CNPJ corretamente.</span>');
            } else {
                $(this).removeAttr('style', 'border: 1px solid red;');
                $(this).removeClass('campo-validacao-' + id);
                $(".error-validacao-" + id).remove();
            }
        });
    },
    vData: function() {
        var data = $(".validar-data");
        data.bind('keydown keyup change', function() {
            var v = $(this).val();
            var id = $(this).attr("id");
            
            valido = validarData(v);
            if (valido == false) {
                $(".error-validacao-" + id).remove();
                $(this).attr('style', 'border: 1px solid red;');
                $(this).addClass('campo-validacao-' + id);
                if ($(this).attr('msn_validacao'))
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">' + $(this).attr('msn_validacao') + '</span>');
                else
                    $(this).after('<span class="error-validacao error-validacao-' + id + '" style="color:red;">Por favor preenchar a data corretamente.</span>');
            } else {
                $(this).removeAttr('style', 'border: 1px solid red;');
                $(this).removeClass('campo-validacao-' + id);
                $(".error-validacao-" + id).remove();
            }
        });
    },
    mBuscarEndereco: function() {
        $(".buscar_endereco").change(function() {
            var cep = $(this);
            $.getJSON("http://cep.republicavirtual.com.br/web_cep.php?cep=" + cep.val() + "&formato=json",
                    function(data) {
                        if (data.resultado === "1") {
                            $("." + cep.attr("prefixo") + "bairro").val(data.bairro);
                            $("." + cep.attr("prefixo") + "cidade").val(data.cidade);
                            $("." + cep.attr("prefixo") + "logradouro").val(data.tipo_logradouro + ' ' + data.logradouro);
                            $("." + cep.attr("prefixo") + "uf").val(data.uf);
                        }
                    });
        });
    }
};

Formzin.iniciar();

function formatarCampo(obj, mask, evt) {
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
}

// Crédito ao site www.geradorcpf.com
function validarCpf(cpf) {

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

}

// crédito ao site www.geradorcnpj.com
function validarCnpj(cnpj) {

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

}

// Crédito ao site http://www.codigocomcafe.com/2009/08/validando-datas-com-javascript-e-regex/
function validarData(valor) {
    regex = /^((((0?[1-9]|1\d|2[0-8])\/(0?[1-9]|1[0-2]))|((29|30)\/(0?[13456789]|1[0-2]))|(31\/(0?[13578]|1[02])))\/((19|20)?\d\d))$|((29\/0?2\/)((19|20)?(0[48]|[2468][048]|[13579][26])|(20)?00))$/;

    resultado = regex.exec(valor);
    if (!resultado)
        return false;
    else
        return true;
}