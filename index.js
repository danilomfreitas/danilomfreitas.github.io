import { responseGetEhValido } from './js/validador.js'

const API = 'https://ajude-api.herokuapp.com/api';

const requestGetCampanhasCriterio = () => ({
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
})

function exibirCampanhas(criterio) {
    let rota = '/campanhas/ranking/' + criterio;
    fetch(API + rota, requestGetCampanhasCriterio)
        .then(r => {
            r.json()
                .then(c => {
                    let $colunaCampanhas = document.querySelector(".coluna_campanhas");
                    $colunaCampanhas.innerHTML = '';
                    let campanhasLength = 0;
                    if (c.length > 5) campanhasLength = 5;
                    else campanhasLength = c.length;

                    for (let i = 0; i < campanhasLength; i++) {
                        let $p = document.createElement("p");
                        $colunaCampanhas.appendChild($p);
                        $p.innerHTML = `<div class="nome_wrapper">Campanha: <button class="acess" id="${c[i].url}">${c[i].nome}</button></div>
                        <br>Descrição: ${c[i].descricao}<br>Data limite para arrecadações: ${c[i].deadline}
                        <br>Status: ${c[i].status}<br>Meta: ${c[i].metaArrecadacao}`;
                    }

                    adicionaEventoBotoes();
                })

        })
}

const requestGetCampanha = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

function acessoDiretoCampanha(idCampanha) {
    fetch(API + "/campanhas/" + idCampanha, requestGetCampanha)
        .then(r => {
            if (responseGetEhValido(r)) {
                r.json()
                    .then(c => {
                        localStorage.setItem('campanha', JSON.stringify(c));
                        window.location.href = "https://danilomfreitas.github.io/views/campanha.html"
                    })
            }
        })
}

function adicionaEventoBotoes() {
    let $botoes = document.querySelectorAll('.acess');
    $botoes.forEach(e => {
        e.addEventListener('click', function() {
            console.log
            let idCampanha = this.id;
            acessoDiretoCampanha(idCampanha);
        });
    })
}

function checaCriterio() {
    let porQuantiaRestante = document.querySelector("#radio_quantia_restante").checked;
    let porVencimento = document.querySelector("#radio_deadline").checked;
    let porLikes = document.querySelector("#radio_likes").checked;
    let criterio = '';

    if (porLikes) {
        criterio = 'like';
    } else if (porQuantiaRestante) {
        criterio = 'diferencaMeta';
    } else if (porVencimento) {
        criterio = 'vencimento';
    }

    return criterio;
}

function selecionaRadios() {
    let $radioQuantiaRestante = document.querySelector('#radio_quantia_restante');
    let $radioVencimento = document.querySelector('#radio_deadline');
    let $radioLikes = document.querySelector('#radio_likes');

    $radioQuantiaRestante.addEventListener('click', () => (setTimeout(exibirCampanhas(checaCriterio()), 300)));
    $radioVencimento.addEventListener('click', () => (setTimeout(exibirCampanhas(checaCriterio()), 300)));
    $radioLikes.addEventListener('click', () => (setTimeout(exibirCampanhas(checaCriterio()), 300)));    
}

(function init() {
    window.addEventListener('load', exibirCampanhas('diferencaMeta'));
    document.body.onload = selecionaRadios();
}())