const express = require('express')
const controllerEvaluation = require('../controllers/evaulation.controller.js')

const router = express.Router()


router.get('/affiche', controllerEvaluation.getAllEvalution)
router.get('/observation', controllerEvaluation.getAllObservation)
router.post('/afficheParticipatif', controllerEvaluation.getAllParticiatif)
router.get('/evaluerChart',controllerEvaluation.getAllEvalutionForEvaluer)
router.post('/creatEval',controllerEvaluation.createEvalution )
router.post('/participatif',controllerEvaluation.createParticipation)
router.post('/sociabilite',controllerEvaluation.createSociabilite)
router.delete('/:id', controllerEvaluation.deleteEvalution)
router.patch('/:id',controllerEvaluation.updateEvalution)

module.exports =router