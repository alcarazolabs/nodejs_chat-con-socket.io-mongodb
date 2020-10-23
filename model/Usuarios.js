const mongoose = require('mongoose');
const usuarioSchema = new mongoose.Schema({
    socketID:{
        type: String,
        require: true
    },
    username:{
        type: String,
        required: true,
        min: 5,
        max: 10
    },
    fecha:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Usuario', usuarioSchema)