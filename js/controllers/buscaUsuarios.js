import { jwtEhValido } from '../validador.js';

const API = 'https://ajude-api.herokuapp.com/api';

const requestGetUsuarios = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

function search() {
    let substring = document.querySelector("#busca_usuario").value;
    let rota = `/usuarios?email=${substring}`;
    fetch(API + rota, requestGetUsuarios)
        .then(r => {
            if (jwtEhValido(r)) {
                r.json()
                    .then(u => {
                        localStorage.setItem('usuarios', JSON.stringify(u));
                        if (u.length === 0) {
                            alert('Nenhum usuário encontrado para essa pesquisa!');
                        } else {
                            setInterval(function () { window.location.href = "https://danilomfreitas.github.io/views/usuarios.html"; }, 300);
                        }
                    })
            }
        })
}

(function init() {
    let $button = document.querySelector("button");
    $button.addEventListener('click', search);
}());