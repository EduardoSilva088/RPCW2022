const { default: axios } = require('axios');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/musicas', function(req, res, next) {
  axios.get("http://localhost:3000/musicas")
    .then(response => {
      var lista = response.data
      res.render('musicas', {musicas : lista})
    })
});

router.get('/musicas/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas/"+req.params.id)
    .then(response => {
      var musica = response.data
      res.render('musica', {musica : musica})
    })
});

router.get('/musicas/prov/:id', function(req, res, next) {
  axios.get("http://localhost:3000/musicas?prov="+req.params.id)
    .then(response => {
      var lista = response.data
      console.log(req)
      res.render('provincia', {musicas : lista, prov : req.params.id})
    })
});

module.exports = router;
