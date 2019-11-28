import { validaCadastroUsuario } from '../validador.js';

const API = 'https://ajude-api.herokuapp.com/api';

const requestPostUsuario = (primeiroNome, ultimoNome, email, numCartaoCredito, senha) => ({
    'method': 'POST',
    'body': `{"primeiroNome": "${primeiroNome}", "ultimoNome":"${ultimoNome}", 
            "email":"${email}", "numCartaoCredito":"${numCartaoCredito}", 
            "senha":"${senha}"}`,
    'headers': { 'Content-type': 'application/json' }
});

function save() {
    let primeiroNome = document.querySelector("#primeiro_nome_cadastro").value;
    let ultimoNome = document.querySelector("#ultimo_nome_cadastro").value;
    let email = document.querySelector("#email_cadastro").value;
    let numCartaoCredito = document.querySelector("#num_cartaocredito_cadastro").value;
    let senha = document.querySelector("#senha_cadastro").value;

    fetch(API + '/usuarios', requestPostUsuario(primeiroNome, ultimoNome, email, numCartaoCredito, senha))
        .then(r => {
            validaCadastroUsuario(r);
        })
}

(function init() {
    let $button = document.querySelector("button");
    $button.addEventListener('click', save);
}());