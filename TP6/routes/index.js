var express = require('express');
var router = express.Router();
var fs = require('fs');

var multer = require('multer');
var upload = multer({dest: 'uploads'})

var File = require('../controllers/file');

/* GET home page. */
router.get('/', function(req, res, next) {
  var d = new Date().toISOString().substring(0,16)
  File.list()
    .then(data => {
      res.render('index', {
        files: data,
        date: d
      })
    })
});

router.get('/download/:file', (req, res) => {
  var filePath = __dirname + '/../fileStorage/' + req.params.file
  res.download(filePath)
})

router.post('/files', upload.single('file'), (req, res) => {
  var d = new Date().toISOString().substring(0,16)

  let oldPath = __dirname + '/../' + req.file.path
  let newPath = __dirname + '/../fileStorage/' + req.file.originalname
  
  fs.rename(oldPath,newPath,error => {
    if (error)
        throw error;
  })

  var file = {
    file: req.file.originalname,
    size: req.file.size,
    type: req.file.mimetype,
    date: d,
    text: req.body.text
  }


  File.insert(file)
    .then(data => {
      res.redirect('/')
    })
    .catch(error => {
      res.render('error',{error : error})
    })
})

router.post('/delete/:file', (req,res) => {
  File.remove(req.params.file)
    .then( data => {
      var filePath = __dirname + '/../fileStorage/' + req.params.file
      fs.unlink(filePath, error => {
        if(error){
          throw error;
        }
      })
    })
    .catch(error =>{
      console.log(error)
    })

  res.redirect('/')
})

module.exports = router;
