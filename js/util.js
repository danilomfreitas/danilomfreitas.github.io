function removeAcentos(string) {
    let stringSemAcentos = string;
    let mapaAcentosHex = {
        a : /[\xE0-\xE6]/g,
        e : /[\xE8-\xEB]/g,
        i : /[\xEC-\xEF]/g,
        o : /[\xF2-\xF6]/g,
        u : /[\xF9-\xFC]/g,
        c : /\xE7/g,
        n : /\xF1/g
    };
    
    for (let letra in mapaAcentosHex) {
        let expressaoRegular = mapaAcentosHex[letra];
		stringSemAcentos = stringSemAcentos.replace(expressaoRegular, letra);
	}

	return stringSemAcentos;
}

function removePontuacao(string) {
    let stringSemPontuacao = string;
    let sinais = [/\./g, /,/g, /;/g, /:/g, /!/g, /\?/g, /[\\()]/g, /-/g, /[\\"]/g];
    sinais.map(e => stringSemPontuacao = stringSemPontuacao.replace(e, " "));
	return stringSemPontuacao;
}

function geraUrlUnica(string) {
    let rota = string.toLowerCase();
    rota = removePontuacao(rota);
    rota = removeAcentos(rota);
    rota = rota.replace(/\s{2,}/g, " ");
    rota = rota.replace(/\s/g, "-");

    return rota;
}

function msgSucesso(strObj) {
    let msgSucesso = ""

    switch (strObj) {
        case "Usuário":
            msgSucesso = "Usuário cadastrado com sucesso!";
            break;
        case "Campanha":
            msgSucesso = "Campanha cadastrada com sucesso!";
            break;
        case "Comentário":
            msgSucesso = "Comentário feito com sucesso!";
            break;
        case "Doação":
            msgSucesso = "Doação feita com sucesso, obrigado!";
            break;
    }

    return msgSucesso;
}

function msgInsucesso(strObj) {
    let msgInsucesso = ""

    switch (strObj) {
        case "Usuário":
            msgInsucesso = "Usuário com mesmo email já cadastrado!";
            break;
        case "Campanha":
            msgInsucesso = "Campanha com mesmo nome já cadastrada!";
            break;
        case "Comentário":
            msgInsucesso = "Esse mesmo comentário já consta em nosso sistema, por favor, tente novamente!";
            break;
    }

    return msgInsucesso;
}

export { geraUrlUnica, msgSucesso, msgInsucesso }