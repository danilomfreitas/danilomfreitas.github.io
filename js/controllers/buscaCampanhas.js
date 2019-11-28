import { jwtEhValido } from '../validador.js';

const API = 'https://ajude-api.herokuapp.com/api';

const requestGetCampanhas = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

function search() {
    let substring = document.querySelector("#busca_campanha").value;
    let retornarTodas = document.querySelector('#checkbox_campanha').checked.toString();
    let rota = `/campanhas?substring=${substring}&retornarTodas=${retornarTodas}`;
    fetch(API + rota, requestGetCampanhas)
        .then(r => {
            if (jwtEhValido(r)) {
                r.json()
                    .then(c => {
                        localStorage.setItem('campanhas', JSON.stringify(c));
                        if (c.length === 0) {
                            alert('Nenhuma campanha para essa pesquisa!');
                        } else {
                            setInterval(function () { window.location.href = "http://127.0.0.1:5500/app/views/campanhas.html"; }, 300);
                        }
                    })
            }
        })
}

(function init() {
    let $button = document.querySelector("button");
    $button.addEventListener('click', search);
}());