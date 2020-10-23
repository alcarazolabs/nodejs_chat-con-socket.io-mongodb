const mongoose = require('mongoose');
//crear conexion a la BD
//console.log(process.env.MONGODB_URI)
/*
const URI = process.env.MONGODB_URI
             ? process.env.MONGODB_URI:
             'mongodb://localhost/chatmongo';
*/
const URI = "mongodb+srv://<user-mongodb atlas>:<password>@cluster0.kdqg8.mongodb.net/chatmongo?retryWrites=true&w=majority";

mongoose.connect(URI, {
    useNewUrlParser: true
    /*
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
    */
});

const connection = mongoose.connection;
connection.once('open', ()=> {
    console.log('Conectado a mongodb');
});