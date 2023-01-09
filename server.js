require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const {
  anonymousUsers,
  getAnonymousUsersController,
  loginController,
  editUser,
} = require('./controllers/users');

const {
  getLinksController,
  newLinkController,
  getSingleLinkController,
  deleteLinkController,
} = require('./controllers/links');

const { authUser } = require('./middlewares/auth');
const { votesController, getVotesController, getTotalVotesController } = require('./controllers/votes');

const app = express();

app.use(fileUpload());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static('./uploads'));

//Rutas de usuario
app.post('/user', anonymousUsers); //nos permite registrar
app.get('/user/:id', getAnonymousUsersController); //nos da informacion de un usuario
app.post('/login', loginController); //nos permite logearnos
app.put('/user/:id', authUser, editUser); //modificar usuario

//Rutas de link
app.post('/', authUser, newLinkController); //creo los link
app.get('/', getLinksController); //listo los link
app.get('/link/:id', getSingleLinkController); //Devuelvo un link
app.delete('/link/:id', authUser, deleteLinkController); //borro un link

//ruta de votos
app.post('/votes/:id', authUser, votesController);
app.get('/votes', getVotesController);
app.get('/totalvotes', getTotalVotesController);


// Middleware de 404
app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

// Middleware de gestión de errores
app.use((error, req, res, next) => {
  console.error(error);

  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});
// Lanzamos el servidor
app.listen(4000, () => {
  console.log('Servidor funcionando!');
});