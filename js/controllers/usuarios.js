import { responseGetEhValido } from '../validador.js'

const API = 'https://ajude-api.herokuapp.com/api';
let usuarios = [];
let $usuario = document.querySelector(".exibicao_usuarios");

function criaViewUsuarios(usuarios) {
    $usuario.innerHTML = '';

    usuarios.forEach(e => {
        let $div = document.createElement('div');
        let $p = document.createElement("p");
        $div.className = "nome_wrapper";
        $usuario.appendChild($div);
        $div.appendChild($p);
        $p.innerHTML = `Usuário: <button class="acess" id="${e.email}">${e.email}
                        </button><br>Nome Completo: ${e.primeiroNome}&nbsp;${e.ultimoNome}`
    })

}

function exibeUsuarios(dados) {
    usuarios = dados
    criaViewUsuarios(usuarios);
}

function filtraUsuarios() {
    let filtroSubstring = document.querySelector('#filtro_input').value;

    if (filtroSubstring.trim() !== "") {
        let usuariosFiltrados = usuarios.filter(u => (u.email.toLowerCase().includes(filtroSubstring.toLowerCase())));
        criaViewUsuarios(usuariosFiltrados);
        adicionaEventoBotoes();
    }
}

const requestGetUsuario = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

function acessoDiretoUsuario(email) {
    fetch(API + "/usuarios/" + email, requestGetUsuario)
        .then(r => {
            if (responseGetEhValido(r)) {
                r.json()
                    .then(u => {
                        localStorage.setItem('usuario', JSON.stringify(u));
                        window.location.href = "http://127.0.0.1:5500/app/views/usuario.html"
                    })
            }
        })
}

function adicionaEventoBotoes() {
    let $botoes = document.querySelectorAll('.acess');
    $botoes.forEach(e => {
        e.addEventListener('click', function () {
            let email = this.id;
            acessoDiretoUsuario(email);
        });
    })
}

(function init() {
    let $botaoFiltrar = document.querySelector("#filtro_botao");
    $botaoFiltrar.addEventListener('click', filtraUsuarios);
    document.body.onload = exibeUsuarios(JSON.parse(localStorage.getItem('usuarios')));
    window.onload = adicionaEventoBotoes();
}());