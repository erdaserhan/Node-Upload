var express = require('express');
var router = express.Router();

var formidable = require('formidable');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req,res){
  var form = new formidable.IncomingForm();
  form.maxFileSize = 2 * 1024 * 1024;
  form.parse(req);

  let fileTypes = ['image/jpeg', 'image/png', 'image/gif'];

  form.onPart = function(part) {
    if(fileTypes.indexOf(part.mimetype) === -1) {
      form._error(new Error('File type is not supported : '+part.mimetype));
  } if(!part.originalFileName || fileTypes.indexOf(part.mimetype) !== -1){
    form._handlePart(part);
  }
  };

  form.on('fileBegin', function(name, file) {
    console.log('Fichier uploadé = ' +file.originalFilename);
    file.filepath = __dirname + '/../public/uploads/' + file.originalFilename;
    console.log(file.filepath);
  });

  form.on('file', function(name, file) {
    console.log('Nom original du fichier : ' +file.originalFilename);
    console.log('Taille du fichier : ' +file.size);
    console.log('Type du fichier : ' +file.mimetype);

    res.render('uploaded', {title:'upload', nom: file.originalFilename, taille: file.size, type: file.mimetype});
  });

  form.on('end', function() {
    console.log('Upload ok !');
  });

  form.on('error', function(err) {
    console.log('Erreur : '+ err);
    console.log('Stack : '+ err.stack);

    res.render('error', {title: "Erreur", message: "Une erreur s\'est produite", error: err });
  });
});

module.exports = router;
