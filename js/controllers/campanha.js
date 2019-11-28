import { responsePostEhValido, jwtEhValido } from '../validador.js'

const API = 'https://ajude-api.herokuapp.com/api';
let likeCounter = 0;
let idCurtida

function exibeCampanha(dados) {
    let campanha = dados;
    const $dadosCampanha = document.querySelector(".dados_campanha");
    const $nomeCampanha = document.querySelector(".nome_campanha");
    const $comentario = document.querySelector(".coluna_comentarios");
    let $doacoes = document.querySelector(".coluna_doacoes");
    let $botaoLike = document.querySelector("#like_botao");
    $botaoLike.innerHTML = usuarioCurtiuCampanha(JSON.parse(localStorage.getItem('campanha'))) ? 'Retirar Like' : 'Curtir';
    $dadosCampanha.innerHTML = '';
    $nomeCampanha.innerHTML = '';
    $comentario.innerHTML = '';

    let $h1 = document.createElement("h1");
    let $p1 = document.createElement("p");

    $nomeCampanha.appendChild($h1);
    $dadosCampanha.appendChild($p1);

    $h1.innerHTML = `${campanha.nome}`
    let arrecadado = getQuantiaArrecadada(campanha);

    $p1.innerHTML = `Descrição: ${campanha.descricao}<br>Data limite para arrecadações (ano-mês-dia): ${campanha.deadline.substring(0, 10)}
    <br>Status: ${campanha.status}<br>Meta: ${campanha.metaArrecadacao}<br><div class="arrecadacao_wrapper">Arrecadado: <p id="arrecadado">${arrecadado}</p></div>`;

    if (campanha.comentarios !== null) {
        campanha.comentarios.forEach(e => {
            if (!e.apagado) {
                let $p = document.createElement("p");
                $p.id = `p${e.idComentario}`;
                $comentario.appendChild($p);
                $p.innerHTML = `${e.emailUsuarioDono} comentou: <br>${e.msg}<br>
                                <button class="delete" id="b${e.idComentario}">Deletar</button>`;
            }
        });
    }

    if (campanha.curtidas !== null) {
        likeCounter = 0;
        campanha.curtidas.forEach(e => {
            likeCounter++;
            let $likeCounter = document.querySelector('#like_counter');
            $likeCounter.innerHTML = likeCounter;
        })
    }

    if (campanha.doacoes !== null) {
        campanha.doacoes.forEach(e => {
            let $p = document.createElement("p");
            $doacoes.appendChild($p);
            $p.innerHTML = `Quantia Doada: ${e.quantiaDoada}`;
        })
    }
}

function obterRespostasComentarios(dados) {
    let campanha = dados;

    let $pComentario = document.querySelector("#p_comentario");
    let $div = document.createElement("div");
    $div.className = "respostas_comentario";

    campanha.comentarios.respostas.forEach(e => {
        $pComentario.appendChild($div);
        $div.innerHTML = `${e.msg}`
    })
}

function exibeRespostasComentarios(dados) {
    let $botaoRespostas = document.querySelector('#mostrar_respostas');
    $botaoRespostas.addEventListener('click', obterRespostasComentarios(dados));
}

const requestPostComentario = (msg) => ({
    method: 'POST',
    body: JSON.stringify({
        msg: msg,
        emailUsuarioDono: localStorage.getItem('emailAtivo'),
        apagado: false,
        campanha: {"idCampanha": JSON.parse(localStorage.getItem('campanha')).idCampanha}
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

function postaComentario() {
    let msg = document.querySelector("#comentario_input").value;
    fetch(API + '/comentarios', requestPostComentario(msg))
    .then(r => {
        if (responsePostEhValido(r, "Comentário")) {
            r.json()
            .then(c => {
                let $p = document.createElement('p');
                $p.id = `p${c.idComentario}`
                $p.innerHTML = `${c.emailUsuarioDono} comentou: <br>${c.msg}<br><button class="delete" id="b${c.idComentario}">Deletar</button>`
                document.querySelector('.coluna_comentarios').appendChild($p);
                adicionaEventoBotoes();
            })
        }
    })
}

const requestDeleteComentario = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

function deletaComentario(idComentario) {
    fetch(API + '/comentarios/' + idComentario, requestDeleteCurtida)
    .then(r => {
        if (jwtEhValido(r)) {
            r.json()
            .then(c => {
                let $p = document.getElementById(`p${idComentario}`);
                if ($p.parentNode) {
                    $p.parentNode.removeChild($p);
                }
            })
        }
    })
}

function likeHandler() {
    let textoBotao = document.querySelector('#like_botao').innerHTML;

    if(textoBotao === 'Curtir') {
        darLike();
        document.querySelector('#like_botao').innerHTML = 'Retirar Like';
    } else {
        retirarLike();
        document.querySelector('#like_botao').innerHTML = 'Curtir';
    }
}

const requestPostCurtida = {
    method: 'POST',
    body: JSON.stringify({
        campanha: {"idCampanha": JSON.parse(localStorage.getItem('campanha')).idCampanha},
        usuarioDoLike: localStorage.getItem('emailAtivo'),
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

const requestDeleteCurtida = {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
}

function darLike() {
    fetch(API + '/curtidas', requestPostCurtida)
    .then(r => {
        if (jwtEhValido(r)) {
            r.json()
            .then(c => {
                likeCounter++;
                let $likeCounter = document.querySelector('#like_counter');
                $likeCounter.innerHTML = likeCounter;
                idCurtida = c.idCurtida
            })
        }
    })
}

function getIdCurtida(campanha) {
    if (idCurtida !== undefined) {
        return idCurtida;
    } else {
        campanha.curtidas.filter(c => {
            if (c.usuarioDoLike === localStorage.getItem('emailAtivo')) {
                idCurtida = c.idCurtida
            }
        })
    }

    return idCurtida;
}

function usuarioCurtiuCampanha(campanha) {
    let usuarioCurtiuCampanha = false;

    if (campanha.curtidas !== null) {
        campanha.curtidas.filter(c => {
            if (c.usuarioDoLike === localStorage.getItem('emailAtivo')) {
                usuarioCurtiuCampanha = true;
            }
        })
    }

    return usuarioCurtiuCampanha;
}

function retirarLike() {
    let campanha = JSON.parse(localStorage.getItem('campanha'));
    idCurtida = getIdCurtida(campanha);

    fetch(API + '/curtidas/' + idCurtida, requestDeleteCurtida)
    .then(r => r.json())
    .then(c => console.log(c))
    likeCounter--;
    let $likeCounter = document.querySelector('#like_counter');
    $likeCounter.innerHTML = likeCounter;
}

const requestPostDoacao = (quantiaDoada, dataDoacao) => ({
    method: 'POST',
    body: JSON.stringify({
        quantiaDoada: quantiaDoada,
        dataDoacao: dataDoacao,
        usuario: {"email": localStorage.getItem('emailAtivo')},
        campanha: {"idCampanha": JSON.parse(localStorage.getItem('campanha')).idCampanha},
    }),
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

function fazerDoacao() {
    let quantiaDoada = document.querySelector('#doacao_input').value;
    let dataDoacao = new Date();
    dataDoacao = dataDoacao.toISOString().substring(0,10);

    fetch(API + '/doacoes', requestPostDoacao(quantiaDoada, dataDoacao))
    .then(r => {
        if (responsePostEhValido(r, "Doação")) {
            r.json()
            .then(c => {
                let $p = document.createElement('p');
                let $doacoes = document.querySelector(".coluna_doacoes");
                $doacoes.appendChild($p);
                $p.innerHTML = `Quantia doada: ${c.quantiaDoada}`;
                alertMeta(JSON.parse(localStorage.getItem('campanha')), c.quantiaDoada);
                let arrecadado = Number(document.querySelector('#arrecadado').innerHTML) + c.quantiaDoada;
                document.querySelector('#arrecadado').innerHTML = arrecadado;
            })
        }
    })
}

function alertMeta(campanha, valorDoacaoAtual) {
    let arrecadado = Number(document.querySelector('#arrecadado').innerHTML);
    if (getDiferencaMeta(campanha) > 0 && arrecadado < campanha.metaArrecadacao && 
        (arrecadado + valorDoacaoAtual) >= campanha.metaArrecadacao ) {
        alert('Obrigado, sua doação fez com que a campanha atingisse a meta!');
    }
}

function getQuantiaArrecadada(campanha) {
    let quantiaArrecadada = 0;

    if (campanha.doacoes !== null) {
        campanha.doacoes.forEach(e => {
            quantiaArrecadada += e.quantiaDoada;
        })
    }

    return quantiaArrecadada;
}

function getDiferencaMeta(campanha) {
    return campanha.metaArrecadacao - getQuantiaArrecadada(campanha);
}

function adicionaEventoBotoes() {
    let $botoes = document.querySelectorAll('.delete');
    $botoes.forEach(e => {
        e.addEventListener('click', function() {
            let idComentario = this.id;
            let id = idComentario.substring(1);
            deletaComentario(id);
        });
    })
}

(function init() {
    document.body.onload = exibeCampanha(JSON.parse(localStorage.getItem('campanha')));
    window.onload = adicionaEventoBotoes();
    
    let $botaoPostarComentario = document.querySelector("#postar_comentario");
    $botaoPostarComentario.addEventListener('click', postaComentario);
    
    let $likeBotao = document.querySelector('#like_botao');
    $likeBotao.addEventListener('click', likeHandler);
    
    let $botaoDoacao = document.querySelector('#botao_doacao');
    $botaoDoacao.addEventListener('click', fazerDoacao);
}());