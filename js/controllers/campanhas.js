import { responseGetEhValido } from '../validador.js'
 
const API = 'https://ajude-api.herokuapp.com/api';
let campanhas = [];
let $campanha = document.querySelector(".exibicao_campanhas");

function criaViewCampanhas(campanhas) {
    $campanha.innerHTML = '';

    campanhas.forEach(e => {
        let $div = document.createElement('div');
        let $p = document.createElement("p");
        $div.className = "nome_wrapper";
        $campanha.appendChild($div);
        $div.appendChild($p);
        $p.innerHTML = `Campanha: <button class="acess" id="${e.url}">${e.nome}</button><br>Descrição: ${e.descricao}
        <br>Data limite para arrecadações: ${e.deadline}<br>Status: ${e.status}<br>Meta: ${e.metaArrecadacao}`;
    })

}

function exibeCampanhas(dados) {
    campanhas = dados
    criaViewCampanhas(campanhas);
}

function filtraCampanhas() {
    let filtroSubstring = document.querySelector('#filtro_input').value;

    if (filtroSubstring.trim() != "") {
        let campanhasFiltradas = campanhas.filter(c => c.nome.toLowerCase().includes(filtroSubstring.toLowerCase()));
        criaViewCampanhas(campanhasFiltradas);
        adicionaEventoBotoes();
    }
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
                        window.location.href = "http://127.0.0.1:5500/app/views/campanha.html"
                    })
            }
        })
}

function adicionaEventoBotoes() {
    let $botoes = document.querySelectorAll('.acess');
    $botoes.forEach(e => {
        e.addEventListener('click', function() {
            let idCampanha = this.id;
            acessoDiretoCampanha(idCampanha);
        });
    })
}

(function init() {
    let $botaoFiltrar = document.querySelector("#filtro_botao");
    $botaoFiltrar.addEventListener('click', filtraCampanhas);
    document.body.onload = exibeCampanhas(JSON.parse(localStorage.getItem('campanhas')));
    window.onload = adicionaEventoBotoes();
}());