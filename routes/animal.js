const express = require('express')
const router = express.Router();

const {getAllAnimals, addNewAnimal, getAnimal, updateAnimal, deleteAnimal} = require('../controller/animal');
// const addNewAnimal = require('../controller/animal');

router.get('/', getAllAnimals)
router.get('/:id', getAnimal)
router.get('/', getAllAnimals)
router.get('/', getAllAnimals)
router.post('/add', addNewAnimal)
router.put('/update/:id', updateAnimal)
router.delete('/delete/:id', deleteAnimal)


module.exports = router;
