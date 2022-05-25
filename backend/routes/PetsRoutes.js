const router = require('express').Router()

//Controller
const PetController = require('../controllers/PetController')

//Middlewares
const verifyToken = require('../helpers/verify-token')
const { imageUpload } = require('../helpers/image-upload')

//Routes
router.post('/create', verifyToken, imageUpload.array('images'), PetController.create)
router.get('/', PetController.getAll)
router.get('/mypets', verifyToken, PetController.getAllUserPets)
router.get('/myadoptions', verifyToken, PetController.getAllUserAdoptions)

module.exports = router