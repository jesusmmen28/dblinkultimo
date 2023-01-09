const { totalVotes, getAllVotes, createVotes } = require('../db/votes');
const { getLinkById } = require('../db/links');
const { generateError } = require('../helpers');
const { validationVote } = require('../schemas/schemas');

const getTotalVotesController = async (req, res, next) => {
  try {
    const votes = await totalVotes();
    res.send({
      status: 'ok',
      data: votes,
    });
  } catch (error) {
    next(error);
  }
};

const getVotesController = async (req, res, next) => {
  try {
    const votes = await getAllVotes();
    res.send({
      status: 'ok',
      data: votes,
    });
  } catch (error) {
    next(error);
  }
};
/*
// controlador del nuevo voto
const votesController = async (req, res, next) => {
  try {
    await validationVote.validateAsync(req.body);
    const { id } = req.params;
    //console.log(req.params);

    // Conseguir la información del link que quiero votar
    const link = await getLinkById(id);

    // Comprobar que el usuario del token es el mismo que creó el link
    if (req.userId == link.user_id) {
      throw generateError(
        'Estás intentando votar por un link que has creado, debes votar por un link de otro usuario',
        401
      );
    }

    const { vote } = req.body;
    const links = await getLinkById(id);
    console.log(links);

    if (!vote == 1) {
      throw generateError('El voto debe existir y ser  igual a 1', 400);
    }
    const votes = await createVotes(req.userId, vote);
    console.log(votes);
    res.send({
      status: 'ok',
      message: `voto realizado correctamente`,
    });
  } catch (error) {
    next(error);
  }
};

*/



const votesController = async (req, res, next) => {
  try {
   
    await validationVote.validateAsync(req.body);
    const { id } = req.params;

    // Conseguir la información del link que quiero borrar
    const link = await getLinkById(id);

    // Comprobar que el usuario del token es el mismo que creó el link
    if (req.userId == link.user_id) {
      throw generateError(
        'Estás intentando votar por un link que has creado',
        401
      );
    }

    const { vote } = req.body;
    await createVotes(req.userId, link.user_id, vote);
    res.send({
      status: 'ok',
      message: `Has votado por el link con id: ${id} correctamente`,
    });
   
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTotalVotesController,
  getVotesController,
  votesController,
  
};