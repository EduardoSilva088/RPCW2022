const http = require('http')
const url = require('url')
const axios = require('axios')

function generateMainPage() {
    page = `
        <h2>Escola de Música</h2>
        <ul>
            <li><a href="/alunos">Lista de Alunos</a></li>
            <li><a href="/cursos">Lista de Cursos</a></li>
            <li><a href="/instrumentos">Lista de Instrumentos</a></li>
        </ul>
    `
    return page
}

function generateAlunosPage(res) {
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    axios.get('http://localhost:3000/alunos?_sort=nome&_order=asc')
        .then(resp => {
			alunos = resp.data			
			res.write("<ul>")
			alunos.forEach(a => {
				res.write(`<li><a href='/alunos/${a.id}'>${a.nome}</a></li>`)
			})
			res.write("</ul>")
			res.end()
        }).catch(error => {
            console.log("Erro: " + error)
			res.write("<p>Não existem alunos para lhe mostrar.</p>")
			res.end()
        })
}

function generateAluno(res, id){
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
	axios.get('http://localhost:3000/alunos/'+id)
		.then(resp => {
			a = resp.data
			console.log(a);
			res.write(`<h2>Aluno ${a.id}</h2>`)
			res.write(`<p>Nome: ${a.nome}</p>`)
			res.write(`<p>Data de Nascimento: ${a.dataNasc}</p>`)
			res.write(`<p>Curso: <a href="/cursos/${a.curso}">${a.curso}</a></p>`)
			res.write(`<p>Ano: ${a.anoCurso}</p>`)
			res.write(`<p>Instrumento: ${a.instrumento}</p>`)
			res.end()
		}).catch(error => {
			console.log("Erro: " + error)
			res.write("<p>Aluno não existe!</p>")
			res.end()
		})
}

function generateCursosPage(res) {
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    axios.get('http://localhost:3000/cursos')
        .then(resp => {
			cursos = resp.data			
			res.write("<ul>")
			cursos.forEach(c => {
				res.write(`<li><a href='/cursos/${c.id}'>${c.designacao}</a></li>`)
			})
			res.write("</ul>")
			res.end()
        }).catch(error => {
            console.log("Erro: " + error)
			res.write("<p>Não existem cursos para lhe mostrar.</p>")
			res.end()
        })
}

function generateCurso(res, id){
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
	axios.get('http://localhost:3000/cursos/'+id)
		.then(resp => {
			c = resp.data
			res.write(`<h2>Curso ${c.id}</h2>`)
			res.write(`<p>Nome: ${c.designacao}</p>`)
			res.write(`<p>Duração: ${c.duracao}</p>`)
			res.write(`<p>Instrumento: ${c.instrumento["#text"]}</p>`)
			res.end()
		}).catch(error => {
			console.log("Erro: " + error)
			res.write("<p>Curso não existe!</p>")
			res.end()
		})
}

function generateInstrumentosPage(res){
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
    axios.get('http://localhost:3000/instrumentos')
        .then(resp => {
			instrumentos = resp.data			
			page = res.write("<ul>")
			instrumentos.forEach(i => {
				res.write(`<li><a href='/instrumentos/${i.id}'>${i["#text"]}</a></li>`)
			})
			res.write("</ul>")
			res.end()
        }).catch(error => {
            console.log("Erro: " + error)
			res.write("<p>Não existem instrumentos para lhe mostrar.</p>")
			res.end()
        })
}

function generateInstrumento(res, id){
	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
	axios.get('http://localhost:3000/instrumentos/'+id)
		.then(resp => {
			i = resp.data
			res.write(`<h2>Instrumento ${i.id}</h2>`)
			res.write(`<p>Nome: ${i["#text"]}</p>`)
			res.end()
		}).catch(error => {
			console.log("Erro: " + error)
			res.write("<p>Instrumento não existe!</p>")
			res.end()
		})
}

var myserver = http.createServer(function (req, res) {
    console.log(req.method + " " + req.url)
    if(req.method == "GET"){
		var divs = req.url.split("/",3)
		console.log(divs);
        if (req.url == "/"){
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.write(generateMainPage())
            res.end()
        }
		// Alunos 
        else if (req.url == "/alunos") {
            generateAlunosPage(res)
        }
		// Aluno específico
		else if (divs.length == 3 && divs[1] == "alunos"){
			generateAluno(res,divs[2])
		}
		// Cursos
        else if (req.url == "/cursos") {
            generateCursosPage(res)
        }
		// Curso específico
		else if (divs.length == 3 && divs[1] == "cursos"){
			generateCurso(res,divs[2])
		}
		// Instrumentos
        else if (req.url == "/instrumentos") {
            generateInstrumentosPage(res)
        }
		// Instrumento específico
		else if (divs.length == 3 && divs[1] == "instrumentos"){
			generateInstrumento(res, divs[2])
		}
        else {
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'})
            res.end('<p>Error. Rout not supported: ' +  req.url + '</p>')
        }
    }
    
    
})

myserver.listen(4000)
console.log("Servidor à escuta na porta 4000...")