import { statusCodeLoginEhValido } from '../validador.js';

const API = "https://ajude-api.herokuapp.com/api/auth/login";

const requestPostLogin = (email, senha) => ({
    method: 'POST',
    body: JSON.stringify({
        email: email,
        senha: senha
    }),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
})

function login() {
    let email = document.querySelector("#email_login").value;
    let senha = document.querySelector("#senha_login").value;

    fetch(API, requestPostLogin(email, senha))
    .then(r => {
        if (statusCodeLoginEhValido(r)) {
            r.json()
            .then(d => localStorage.setItem('token', d.token))
            localStorage.setItem('emailAtivo', email);
            alert('Login efetuado com sucesso!');
        }
    })
}

(function init() {
    let $button = document.querySelector("button");
    $button.addEventListener('click', login);
}());