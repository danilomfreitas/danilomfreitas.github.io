import { responseGetEhValido } from '../validador.js'

const API = 'https://ajude-api.herokuapp.com/api';

function exibeUsuario(dados) {
    let usuario = dados;
    let $dadosUsuario = document.querySelector(".dados_usuario");
    let $nomeUsuario = document.querySelector(".nome_usuario");
    let $campanha = document.querySelector(".campanhas_usuario");
    let $doacao = document.querySelector(".doacoes_usuario");
    $dadosUsuario.innerHTML = '';
    $nomeUsuario.innerHTML = '';
    $campanha.innerHTML = '';

    let $h1 = document.createElement("h1");
    let $p1 = document.createElement("p");

    $nomeUsuario.appendChild($h1);
    $dadosUsuario.appendChild($p1);

    $h1.innerHTML = `${usuario.primeiroNome}&nbsp;${usuario.ultimoNome}`
    $p1.innerHTML = `Email: ${usuario.email}`;

    if (usuario.campanhas !== null) {
        usuario.campanhas.forEach(e => {
            let $div = document.createElement('div');
            let $p2 = document.createElement('p');
            $div.className = "nome_wrapper";
            $campanha.appendChild($div);
            $div.appendChild($p2);
            $p2.innerHTML = `Campanha: <button class="acess" id="${e.url}">${e.nome}</button><br>Descrição: ${e.descricao}
            <br>Data limite para arrecadações: ${e.deadline}<br>Status: ${e.status}<br>Meta: ${e.metaArrecadacao}`;
        });
    }

    if (usuario.doacoes !== null) {
        usuario.doacoes.forEach(e => {
            let $p = document.createElement("p")
            $doacao.appendChild($p);
            $p.innerHTML = `Quantia Doada: ${e.quantiaDoada}`;
        });
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
        e.addEventListener('click', function () {
            let idCampanha = this.id;
            acessoDiretoCampanha(idCampanha);
        });
    })
}


(function init() {
    document.body.onload = exibeUsuario(JSON.parse(localStorage.getItem('usuario')));
    window.onload = adicionaEventoBotoes();
}());