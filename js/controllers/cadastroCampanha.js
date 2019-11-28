import { geraUrlUnica } from '../util.js'
import { dataEhValida, responsePostEhValido } from '../validador.js'

const API = 'https://ajude-api.herokuapp.com/api';

const request = (nome, url, descricao, deadline, metaArrecadacao) => ({
    method: 'POST',
    body: JSON.stringify({
        nome: nome,
        url: url,
        descricao: descricao,
        deadline: deadline,
        metaArrecadacao: metaArrecadacao,
        usuarioDono: { "email": localStorage.getItem('emailAtivo') },
        status: 'ativa'
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
});

function save() {
    let nome = document.querySelector("#nome").value;
    let url = geraUrlUnica(nome);
    let descricao = document.querySelector("#descricao").value;
    let deadline = document.querySelector("#deadline").value;
    let metaArrecadacao = parseFloat(document.querySelector("#meta").value);

    if (dataEhValida(deadline)) {
        fetch(API + '/campanhas', request(nome, url, descricao, deadline, metaArrecadacao))
            .then(r => {
                if (responsePostEhValido(r, "Campanha")) {
                    r.json()
                        .then(c => {
                            localStorage.setItem('campanha', JSON.stringify(c));
                            setInterval(() => window.location.href = "https://danilomfreitas.github.io/views/campanha.html", 300);
                        })
                }
            })
    }
}

(function init() {
    let $button = document.querySelector("button");
    $button.addEventListener('click', save);
}());