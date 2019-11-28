import { msgSucesso, msgInsucesso } from './util.js'

function dataEhValida(data) {
    let deadline = new Date(data);
    let dataAtual = new Date();
    
    if (deadline < dataAtual) {
        alert('Data inválida!');
        return false;
    }

    return true;
}

function validaCadastroUsuario(response) {
    if (response.status === 409) {
        alert(msgInsucesso("Usuário"));
    } else {
        alert(msgSucesso("Usuário"));
    }
}

function statusCodeLoginEhValido(response) {
    let statusCodeLoginEhValido = true;

    if (response.status === 500) {
        alert('Por favor, verifique seus dados e tente novamente!');
        statusCodeLoginEhValido = false;
    }

    return statusCodeLoginEhValido;
}

function jwtEhValido(response) {
    let jwtEhValido = false;

    switch(response.status) {
        case 401:
            alert('Por favor, verifique seu email e tente novamente');
            break;
        case 403:
            alert('Por favor, verifique seus dados de login e tente novamente');
            break;
        case 500:
            alert('Por favor, verifique seus dados de login e tente novamente');
            break;
        default:
            jwtEhValido = true;
    }

    return jwtEhValido;
}

function responsePostEhValido(response, strObj) {
    let responsePostEhValido = false;

    if (jwtEhValido(response)) {
        if (response.status === 409) {
            alert(msgInsucesso(strObj));
        } else {
            alert(msgSucesso(strObj));
            responsePostEhValido = true;
        }
    }

    return responsePostEhValido;
}

function responseGetEhValido(response) {
    let responseGetEhValido = false;

    if (jwtEhValido(response)) {
        if (response.status === 404) {
            alert('Campanha inexistente!');
        } else {
            responseGetEhValido = true;
        }
    }

    return responseGetEhValido;
}

export { dataEhValida, validaCadastroUsuario, responsePostEhValido, statusCodeLoginEhValido, responseGetEhValido, jwtEhValido };