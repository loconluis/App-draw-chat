$(document).ready(function(){

  //USE YOUR API_KEY FROM PUSHER XXXXX
  var pusher = new Pusher('XXXXXXXXXXXXXXXXXXXX', {
      encrypted: true
    });

  //Subscripcion al socket public-chat 
  //Subcribe to the channel
  var channel = pusher.subscribe('public-chat');
  channel.bind('message-added', addMessage);

  //Subscripcion al socket draw channel
  //Subcribe to the channel
  var ch = pusher.subscribe('draw-sketch');
  ch.bind('draw-added', newDraw);

  //Recuperando el mensaje
  //Recover the message
  $('#btn-send').click(function(){
    var msg = $('#message').val();
    //console.log(msg +'funcion del boton send');
    $('#message').val("");

    //Envio por post
    //Post send data
    $.post("http://localhost:5000/message", {msg});
  });

  //Accion que se dispara en el servidor cuando se conecta al canal
  //Function on the SOCKET CONNECTION
  function addMessage(data){
    console.log(data);
    //console.log(data.message + 'de la funcion del cliente');
    $('.chat').append('<li>'+ data.message +'</li><hr class="style">');
  }
});


//Pizzara-code
//Declaracion de variables(objetos)
//Variable init
var canvas, ctx,
  brush = {
    x: 0,
    y: 0,
    color: "#000000",
    size: 12,
    down: false,
  },
  strokes = [],
  currentStroke = null;
//Funcion que pinta las lineas
//Draw lines
function draw(){
  //Limpia el contexto;
  ctx.clearRect(0,0, 745, 325);
  //Forma redondea al final de las lineas
  ctx.lineCap = 'round';

  //setea los atributos de cada punto
  for (var i = 0; i < strokes.length; i++){
    var s = strokes[i];
    ctx.strokeStyle = s.color;
    ctx.lineWidth = s.size;
    ctx.beginPath();

    //pinta los puntos
    ctx.moveTo(s.points[0].x, s.points[0].y);
    for (var j = 0; j < s.points.length; j++){
      var p = s.points[j];
      ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();

  }

}

//Inicializa todo
//INITIALIZATION FUNCTION
function init(){
  canvas = $('#board');
  ctx = canvas[0].getContext('2d');

  //Cuando el mouse se mueve
  function mouseEvent(e){
    //puntos distantes entre 0 y canvas
    var offset = canvas.offset();
    brush.x = e.pageX - offset.left;
    brush.y = e.pageY - offset.top;
    var xy={
      equis: brush.x,
      ye: brush.y,
      color: brush.color,
      size: brush.size
    };
    //console.log('x: '+brush.x+' y: '+brush.y);
    $.post("http://localhost:5000/draw", xy);


    //agrega cordenadas
    currentStroke.points.push({
      x: brush.x,
      y: brush.y,
    });

    draw();
  }

  canvas.mousedown(function(e){
    brush.down = true;

    currentStroke = {
      color: brush.color,
      size: brush.size,
      points: [],
    };

    strokes.push(currentStroke);
    console.log(strokes);
    //$.post("http://localhost:5000/draw", strokes);
    mouseEvent(e);

  }).mouseup(function(e){
    brush.down = false;
    mouseEvent(e);

    currentStroke = null;

  }).mousemove(function(e){
    if(brush.down)
      mouseEvent(e);
  });
  /*----------CONFIGURACION DE LOS BOTONES----------------*/
  //Boton de guardar imagen
  $('#save-btn').click(function(){
    window.open(canvas[0].toDataURL());
  });

  //Boton de retroceder
  $('#undo-btn').click(function(){
    strokes.pop();
    draw();
  });

  //Boton de limpiar todo
  $('#clear').click(function(){
    strokes = [];
    draw();
  });

  //Input para escoger color
  $('#color-picker').on('input', function(){
    brush.color = this.value;
    console.log(brush.color);
  });

  //Input para escoger el tamaño del pincel
  $('#brush-size').on('input', function(){
    brush.size = this.value;
  });
}

//Dibuja en el cliente todo en REAL_TIME
function newDraw(data){
  //FUNCION REAL TIME
}

$(init);
