function entrar(){
    var usu = document.getElementById("usu").value
    var pas = document.getElementById("senha").value

    if (usu == "Gabriel" && pas == "gabrielpassos16"){
        location.href = "https://www.youtube.com/c/CursoemV%C3%ADdeo/playlists"
        
    }else if (usu = "" || pas == ""){
        alert("ERRO 001! Campo de usuário ou senha vazios.")
        
    }else{
        alert("ERRO 002! Usuário não cadastrado.")
    }
    
}


function sobre(){
    alert("Olá meu nome é Gabriel Passos, bem-vindo(a) ao meu site! Tive um pouco de trabalho na criação dele, espero que tenha gostado. Obrigado pela visita <3")
}


function cadastrar(){
    var cadusu = document.getElementById("cadusu").value
    var cadsenha = document.getElementById("cadsenha").value
    var cadconfirma = document.getElementById("cadconfirma").value

    if (cadsenha == cadconfirma){
        vetor.push(cadusu)
        vetor.push(cadsenha)
        vetor.push("||")
        alert("Cadastro bem sucessedido!")
        location.href = "Login.html"
    }else{
        alert("ERRO 003! Senhas incompativeis!")
    }
}

