var {parse} = require('querystring')
var http = require('http')
var axios = require('axios')
var fs = require('fs')
var static = require('./static')


// Retrieves json info from request body
function recuperaInfo(request, callback){
    if(request.headers['content-type'] ==
                           'application/x-www-form-urlencoded'){
        let body = ''
        request.on('data', bloco => {
            body += bloco.toString()
        })
        request.on('end', ()=>{
            callback(parse(body))
        }) 
    }
}

function getRegisterPage(){
    return `
    <form class="w3-container" action="/tarefas" method="POST">
      <label class="w3-text-teal"><b>Data Limite</b></label>
      <input
        class="w3-input w3-border w3-light-grey"
        type="datetime-local"
        name="dataLimite"
      />
      <label class="w3-text-teal"><b>Responsável</b></label>
      <input
        class="w3-input w3-border w3-light-grey"
        type="text"
        name="responsavel"
      />
      <label class="w3-text-teal"><b>Descrição</b></label>
      <input
        class="w3-input w3-border w3-light-grey"
        type="text"
        name="descricao"
      />
      <label class="w3-text-teal"><b>Tipo</b></label>
      <input class="w3-input w3-border w3-light-grey" type="text" name="tipo" />
      <p><label class="w3-text-blue-gray"></label></p>
      <input class="w3-btn w3-teal" type="submit" value="Registar" />
      <input class="w3-btn w3-teal" type="reset" value="Limpar valores" />
    </form>`
}

function getListaTarefas(lista){
    var ret = ""

    lista.forEach(tarefa => {
        if(tarefa.estado == "ativo"){
            ret += `
            <tr>
                <form action="/acao" method="POST">
                    <td>${tarefa.dataCriacao}</td>
                    <td>${tarefa.dataLimite}</td>
                    <td>${tarefa.responsavel}</td>
                    <td>${tarefa.descricao}</td>
                    <td>${tarefa.tipo}</td>
                    <td>${tarefa.estado}</td>
                    <td><button name="acao" type="submit" value="finalizarT${tarefa.id}">Finalizar</button></td>
                    <td><button name="acao" type="submit" value="cancelarT${tarefa.id}">Cancelar</button></td>
                </form>
            </tr>
            `
        }
    });
    ret += `</table>`
    return ret
}

function getHistoricoTarefas(lista){
    var ret = ""
    lista.forEach(tarefa => {
        if(tarefa.estado != "ativo"){
            ret += `
            <tr>
                <td>${tarefa.dataCriacao}</td>
                <td>${tarefa.dataLimite}</td>
                <td>${tarefa.responsavel}</td>
                <td>${tarefa.descricao}</td>
                <td>${tarefa.tipo}</td>
                <td>${tarefa.estado}</td>
            </tr>
            `
        }
    });
    ret += `</table>`


    return ret
}

function geraPage(lista){
    var pagina = `
    <html>
    <head>
      <title>To-Do List</title>
      <meta charset="utf-8" />
      <link rel="stylesheet" href="w3.css" />
    </head>
    <body>
    `

    pagina += `
    <div class="w3-container w3-teal">
        <h2>Registar tarefa:</h2>
    </div>
    `
    pagina += getRegisterPage()

    pagina += `
    <div class="w3-container w3-teal">
      <h2>Lista de Tarefas Atuais:</h2>
    </div>
    <table class="w3-table w3-bordered">
      <tr>
        <th>Data de Criação</th>
        <th>Data Limite</th>
        <th>Responsável</th>
        <th>Descrição</th>
        <th>Tipo</th>
        <th>Estado</th>
      </tr>
    `
    pagina += getListaTarefas(lista)

    pagina += `
    <div class="w3-container w3-teal">
      <h2>Historico de Tarefas:</h2>
    </div>
    <table class="w3-table w3-bordered">
      <tr>
        <th>Data de Criação</th>
        <th>Data Limite</th>
        <th>Responsável</th>
        <th>Descrição</th>
        <th>Tipo</th>
        <th>Estado</th>
      </tr>
    `

    pagina += getHistoricoTarefas(lista)

    pagina += `
    </body>
    </html>
    
    `

    return pagina

}


var server = http.createServer(function (req, res) {
    // Logger: que pedido chegou e quando
    var d = new Date().toISOString().substr(0, 16)
    console.log(req.method + " " + req.url + " " + d)

    if(static.recursoEstatico(req)){
        static.sirvoRecursoEstatico(req, res)
    }
    else {
      // Tratamento do pedido
        switch(req.method){
            case "GET": 
                // GET /todolist --------------------------------------------------------------------
                if((req.url == "/") || (req.url == "/todolist")){
                    axios.get("http://localhost:3000/todolist")
                        .then(result => {
                            var list = result.data
                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            res.write(geraPage(list))
                            res.end()
                            // Add code to render page with the student's list
                        })
                        .catch(function(erro){
                            console.log(erro)
                            result.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                            result.write("<p>Não foi possível obter Todo List...")
                            res.end()
                        })
                }
                else{
                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                    res.write("<p>" + req.method + " " + req.url + " não suportado neste serviço.</p>")
                    res.end()
                }
                break
            case "POST":
                 if(req.url == "/tarefas"){
                     recuperaInfo(req, result => {
                        result["estado"] = "ativo"
                        result["dataCriacao"] = d
                        axios.post("http://localhost:3000/todolist", result)
                            .then(resp => {
                                axios.get("http://localhost:3000/todolist")
                                    .then(resp => {
                                        var list = resp.data
                                        res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        res.write(geraPage(list))
                                        res.end()
                                    })
                                    .catch(function(erro){
                                        console.log(erro)
                                        result.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                        result.write("<p>Não foi possível obter Todo List...")
                                        res.end()
                                    })
                            })
                            .catch(function(erro){
                                console.log(erro)
                                res.write('<p>Erro no POST: ' + erro + '</p>')
                                res.write('<p><a href="/">Voltar</a></p>')
                                res.end()
                            })
                     })
                 }
                 else if (req.url == "/acao"){
                    recuperaInfo(req, result => {
                        if (JSON.stringify(result)=="{}") {
                            console.log("Pedido não processado")
                        }
                        else {

                            var acao = JSON.stringify(result).split(":")[1]; 
                            var id = acao.split("T")[1]; id = id.substring(0,id.length-2)
                            acao = acao.split("T")[0]; acao = acao.substring(1,acao.length)

                            var update = {}
                            if  (acao == "finalizar") { update["estado"] = "Finalizado"}
                            else if (acao == "cancelar") { update["estado"]= "Cancelado"}

                            axios.patch(`http://localhost:3000/todolist/${id}`, update)
                                .then(response => {
                                    axios.get("http://localhost:3000/todolist")
                                        .then(response => {
                                            var list = response.data
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write(geraPage(list))
                                            res.end()
                                        })
                                        .catch(function(erro){
                                            console.log(erro)
                                            res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                            res.write("<p>Erro: Não foi possível obter a ToDo List.")
                                            res.end()
                                        })
                                })
                                .catch(erro => {
                                    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                                    res.write('<p>Erro no POST: ' + erro + '</p>')
                                    res.write('<p><a href="/">Voltar</a></p>')
                                    res.end()                            
                                })

                        }
                    })
                }
                
                break
            default: 
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'})
                res.write("<p>" + req.method + " não suportado neste serviço.</p>")
                res.end()
        }  
    }

    
})

server.listen(4444)

console.log('Server running at http://127.0.0.1:4444/');

