var http = require('http')
var fs = require('fs')


var server = http.createServer(function (req, res) {
    var urlPath = req.url.substring(1)
    var fileFolder = urlPath.substring(start=0,end=urlPath.lastIndexOf("/"))
    var fileName = urlPath.substring(start=urlPath.lastIndexOf("/")+1)


    console.log(urlPath)


    if(fileFolder.includes("film")) urlPath = "films/f" + fileName + ".html"
    else if(urlPath == "films" || urlPath == "films/" || urlPath == "/" || urlPath == "") urlPath = "index.html"
    
    fs.readFile(decodeURI(urlPath), function (err, data) {
        res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
        if (err) {
            res.end('<p>Error. Rout not supported: ' +  req.url + '</p>')
        }
        else {
            res.write(data)
        }
        res.end()
    })
});

server.listen(7777);

console.log("Servidor à escuta na porta 7777...")