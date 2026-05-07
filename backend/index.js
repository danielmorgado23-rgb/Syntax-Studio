// ========================= index.js =========================

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

/* =========================
   MIDDLEWARES
========================= */

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   MONGODB
========================= */

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB conectado 🚀'))
.catch(err => console.error('Error MongoDB:', err));

/* =========================
   MODELOS
========================= */

const Cotizacion = require('./models/Cotizacion');
const Admin = require('./models/Admin');

/* =========================
   RUTA PRINCIPAL
========================= */

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   PING
========================= */

app.get('/ping', (req, res) => {
  res.send('alive');
});

/* =========================
   GUARDAR SOLICITUD
========================= */

app.post('/api/cotizacion', async (req, res) => {

  try {

    const {
      nombre,
      telefono,
      descripcion,
      tipoProyecto
    } = req.body;

    if (!nombre || !telefono || !descripcion) {
      return res.status(400).json({
        message: 'Datos incompletos'
      });
    }

    const nuevaCotizacion = new Cotizacion({
      nombre,
      telefono: telefono.replace(/\D/g, ''),
      descripcion,
      tipoProyecto,
      fecha: new Date(),
      estado: 'pendiente'
    });

    await nuevaCotizacion.save();

    res.status(201).json({
      message: 'Solicitud guardada correctamente'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Error del servidor'
    });

  }

});

/* =========================
   OBTENER SOLICITUDES
========================= */

app.get('/api/cotizaciones', async (req, res) => {

  try {

    const cotizaciones =
      await Cotizacion.find().sort({ fecha: -1 });

    res.json(cotizaciones);

  } catch (error) {

    res.status(500).json({
      message: 'Error al obtener datos'
    });

  }

});

/* =========================
   ACTUALIZAR
========================= */

app.put('/api/cotizacion/:id', async (req, res) => {

  try {

    await Cotizacion.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.json({
      message: 'Actualizado correctamente'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error al actualizar'
    });

  }

});

/* =========================
   ELIMINAR
========================= */

app.delete('/api/cotizacion/:id', async (req, res) => {

  try {

    await Cotizacion.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Eliminado correctamente'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error al eliminar'
    });

  }

});

/* =========================
   CREAR ADMIN
========================= */

app.get('/crear-admin', async (req, res) => {

  try {

    const existe =
      await Admin.findOne({ usuario: 'admin' });

    if (existe) {
      return res.send('El admin ya existe');
    }

    const nuevoAdmin = new Admin({
      usuario: 'admin',
      password: '12345'
    });

    await nuevoAdmin.save();

    res.send('Admin creado correctamente');

  } catch (error) {

    console.error(error);

    res.status(500).send('Error al crear admin');

  }

});

/* =========================
   LOGIN
========================= */

app.post('/login', async (req, res) => {

  try {

    const {
      usuario,
      password
    } = req.body;

    const admin =
      await Admin.findOne({ usuario, password });

    if (!admin) {

      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });

    }

    res.json({
      message: 'Login correcto'
    });

  } catch (error) {

    res.status(500).json({
      message: 'Error login'
    });

  }

});

/* =========================
   RUTAS ADMIN
========================= */

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

/* =========================
   SERVIDOR
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor listo 🚀 Puerto ${PORT}`);
});







