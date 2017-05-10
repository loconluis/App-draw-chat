//Server for the app
var express= require('express');
var bp = require('body-parser');
var Pusher = require('pusher');

//configuracion de body-parser
var app = express();
app.use(bp.json());
app.use(bp.urlencoded({extended: false}));

//Pusher config
//Change the X for Pusher credentials
var pusher = new Pusher({
  appId: 'XXXXXX',
  key: 'XXXXXXXXXXXXXXXXXXXX',
  secret: 'XXXXXXXXXXXXXXXXXXXXXX',
  encrypted: true
});

//Indicador de los archivo estaticos
app.use(express.static(__dirname+'/public'));

//Rutas de acceso al servidor
//Chat
app.post('/message', function(req, res){
  var message = req.body.msg;
  pusher.trigger('public-chat', 'message-added', {message});
  res.sendStatus(200);
});

//Pizarra
app.post('/draw', function(req, res){
  //var stroke = req.body;
  //console.log('body', req.body);
  var line = {
    x: req.body.equis,
    y: req.body.ye,
    color: req.body.color,
    size: req.body.size
  };
  console.log('x:'+line.x+' y:'+line.y+' color:'+line.color+' size: '+line.size);
  pusher.trigger('draw-sketch', 'draw-added', {line});
  res.sendStatus(200);
});

//Al correr el servidor se muestra el index.html
app.get('/', function(){
  res.sendFile('/public/index.html', {root:__dirname});
});

//Puerto donde escucha el servidor
var port = process.env.PORT || 5000;
app.listen(port, function(){
  console.log('Servidor corriendo...')
});
