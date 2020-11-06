// requerimiento de las variables de entorno
require('dotenv').config();

// Importación de servicios
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importación de la conexión de la BD
const { dbConnection } = require('./database/config');

// Crear el servidor express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Llamar a la función de la base de datos
dbConnection();

// Directorio público
app.use(express.static('public'));

// Rutas
app.use('/api/participantes', require('./routes/participantes'));
app.use('/api/paises', require('./routes/paises'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/inscripciones', require('./routes/inscripciones'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/pre-registro', require('./routes/pre-registro'));
app.use('/api/pre-inscripcion', require('./routes/pre-inscripcion'));
app.use('/api/por-pagar', require('./routes/por-pagar'));
app.use('/api/pagos', require('./routes/pagos'));
app.use('/api/inscritos', require('./routes/inscritos'));
app.use('/api/reportes', require('./routes/reportes'));

// Si no encuentra ruta
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

// Escuchar el puerto del servidor
app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto: ' + process.env.PORT);
});