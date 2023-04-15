const express = require('express')
const controllerEvaluation = require('../controllers/evaulation.controller.js')

const router = express.Router()


router.get('/affiche', controllerEvaluation.getAllEvalution)

router.post('/creatEval',controllerEvaluation.createEvalution )
router.delete('/:id', controllerEvaluation.deleteEvalution)
router.patch('/:id',controllerEvaluation.updateEvalution)

module.exports =router