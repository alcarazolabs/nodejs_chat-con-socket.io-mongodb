var express = require('express')
const bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
//conectarse a la base de datos:
require('./database.js')
const Usuarios = require('./model/Usuarios')
const Mensajes = require('./model/Mensajes')
//cors
var cors = require('cors')
app.use(cors())

//servir contenido estatico
app.use(express.static(__dirname))

//body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get('/mensajes', (req, res)=>{
    Mensajes.find({}, function(err, mensajes) {
        if(err) {
            res.send(err);
            return;
        }
        res.json(mensajes);
    });
});
app.get('/usuarios', async (req, res)=>{
    /*
    Usuarios.find({}, function(err, usuarios) {
        if(err) {
            res.send(err);
            return;
        }
        res.json(usuarios);
    });*/
    try{
    const usuarios = await Usuarios.find()
        res.json(usuarios)
    }catch(error){
        return res.status(500).json({error: error.message})
    }
});
/*
https://es.stackoverflow.com/questions/393354/al-registrar-y-luego-buscar-todos-con-mongoose-retorna-un-array-vacio
   Mensajes.create(req.body, function(err, result) {
        if(err) {
            console.log(err)
            res.send(err);
            return;
        }
    
    });
    Mensajes.find({}, function(err, mensajes) {
        if(err) {
            res.send(err);
            return;
        }
        console.log("=========MENSAJES========")
        console.log({mensajes})
        //emitir evento 'mensaje'
        io.emit('mensaje', mensajes)
    });

*/
app.post('/mensajes', async (req, res)=>{
    try{
    const reg_mensaje = await Mensajes.create(req.body)
        /*
        if(reg_mensaje){
            const mensajes = await Mensajes.find();
            //emitir evento 'mensaje'
            io.emit('mensaje', mensajes)
        }
        */
       io.emit('mensaje',req.body)
    }catch(error){
        return res.status(500).json({error: error.message});
    }
    
});
//Escuchar/emitir eventos con socket.io
io.on('connection', (socket)=>{
  
    socket.on('nuevouser', function(nick){
        var usuario = {
            socketID: socket.id,
            username: nick
        };
        //buscar usuario para evitar repetidos:
        Usuarios.find({username: nick}, function(error, data){
            if(data.length){

                io.to(socket.id).emit('usuarioexiste', {error:"El usuario ya esta registrado. Intente con otro."})
            
            }else{
                //Crear usuario
                
                Usuarios.create(usuario, function(err, result) {
                    if (err) {
                     console.log(err)
                    } else {
                      //console.log(result);
                      io.emit("clienteconectado", usuario)
                    } 
                  });
              
            }
        });
 
    })
    socket.on('enviarmsgprivado', function(data){
        //console.log(data)
        //emitir evento 'recibirmensaje' para un usuario
        io.to(data.destinatarioID).emit('recibirmensajeprivado', data)
    });

    socket.on('disconnect', async ()=>{
        //Eliminar usuario
        Usuarios.deleteOne({ socketID: socket.id }, function(err, result) {
            if (err) {
              console.log(err)
            } else {
              //res.send(result);
              //console.log(result)
              io.emit('usuariodesconectado', 'desconectado')
            }
          });
       

    })

})


var server = http.listen(3000, ()=>{
    console.log("servidor corriendo en puerto:",
    server.address().port);
})