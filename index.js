const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./database/config')

// console.log(process.env)


//crear servidor
const app = express();

//base de Datos
dbConnection();


// cors

app.use(cors());

//directorio publico

app.use(express.static('public'));

//lectura y posteo del body

app.use(express.json())

//rutas

// TODO: auth// crear, login, renew
app.use('/api/auth', require('./routes/auth'));

// TODO: events// traer, crear , editar, eliminar
app.use('/api/events', require('./routes/events'));

// TODO: CRUD: Eventos


//escuchar express
app.listen(process.env.PORT, () => {
    console.log(`servidor corriendo ${process.env.PORT}`);
});