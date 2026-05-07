// ========================= models/Cotizacion.js =========================

const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({

  nombre: String,

  telefono: String,

  descripcion: String,

  tipoProyecto: String,

  fecha: Date,

  estado: String

});

module.exports =
  mongoose.model('Cotizacion', CotizacionSchema);




