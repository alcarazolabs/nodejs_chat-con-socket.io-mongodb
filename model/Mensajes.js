const mongoose = require('mongoose');
const mensajesSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true
    },
    mensaje:{
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

module.exports = mongoose.model('Mensaje', mensajesSchema)