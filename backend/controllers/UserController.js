const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//Helpers
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')
const getUserByToken = require('../helpers/get-user-by-token')

module.exports = class UserController {

    static async register(req, res){
        
        const {
            name,
            email, 
            phone,
            password,
            confirmPassword
        } = req.body

        //Validations
        if(!name){
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }
        if(!email){
            res.status(422).json({ message: 'O campo e-mail é obrigatório!' })
            return
        }
        if(!phone){
            res.status(422).json({ message: 'O campo telefone é obrigatório!' })
            return
        }
        if(!password){
            res.status(422).json({ message: 'O campo senha é obrigatório!' })
            return
        }
        if(!confirmPassword){
            res.status(422).json({ message: 'O campo confirmação de senha é obrigatório!' })
            return
        }
        if(password !== confirmPassword){
            res.status(422).json({ message: 'O campo senha e confirmação de senha precisam ser iguais!' })
            return
        }

        //Check if user exists
        const userExists = await User.findOne({ email:email })

        if(userExists){
            res.status(422).json({ message: 'E-mail já utilizado! Por favor escolha outro e-mail.' })
            return 
        }

        //Create a password
        const salt = await bcrypt.genSalt(12)
        const passwordHash = await bcrypt.hash(password, salt)

        //Create a user
        const user = new User({
            name,
            email,
            phone,
            password: passwordHash,
        })

        try {

            const newUser = await user.save()
            await createUserToken(newUser, req, res)
  
        } catch (error) {

            res.status(500).json({ message:error })

        }
    }

    static async login(req, res){

        const {email, password} = req.body

        if(!email){
            res.status(422).json({ message: 'Campo e-mail obrigatório!'})
            return
        }

        if(!password){
            res.status(422).json({ message: 'Campo senha obrigatório!'})
            return
        }

        //Check if user exists
        const user = await User.findOne({ email:email })

        if(!user){
            res.status(422).json({ message: 'Não há usuário cadastrado com esse e-mail!'})
            return
        }

        //Check if password match with database password
        const checkPassword = await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({ message: 'Senha inválida!'})
            return
        }

        await createUserToken(user, req, res)

    }

    static async checkUser(req, res){

        let currentUser

        console.log(req.headers.authorization)

        if(req.headers.authorization){
            const token = getToken(req)
            const decoded = jwt.verify(token, 'nossosecret')
            
            currentUser = await User.findById(decoded.id)

            currentUser.password = undefined

        } else{
            currentUser = null
        }

        res.status(200).send(currentUser)

    }

    static async getUserById(req, res){

        const id = req.params.id

        const user = await User.findById(id).select('-password')

        if(!user){
            res.status(422).json({ message: 'Usuário não encontrado!' })
            return
        }

        res.status(200).json({ user })

    }

    static async editUser(req, res){

        const id = req.params.id

        //Check if user exists
        const token = getToken(req)
        const user = await getUserByToken(token)

        const { name, email, phone, password, confirmPassword } = req.body

        if(req.file){
            user.image = req.file.filename
        }

        //Validations
        if(!name){
            res.status(422).json({ message: 'O campo nome é obrigatório!' })
            return
        }
        if(!email){
            res.status(422).json({ message: 'O campo e-mail é obrigatório!' })
            return
        }

        //Check if email has alredy taken
        const userExists = await User.findOne({ email:email })

        if(user.email !== email && userExists){
            res.status(422).json({ message: 'E-mail já cadastrado! Por favor utilize outro e-mail!'})
            return
        }

        user.email = email

        if(!phone){
            res.status(422).json({ message: 'O campo telefone é obrigatório!' })
            return
        }

        user.phone = phone

        if(password !== confirmPassword){
            res.status(422).json({ message: 'O campo senha e confirmação de senha precisam ser iguais!' })
            return 

        } else if(password === confirmPassword && password != null){
            const salt = await bcrypt.genSalt(12)
            const passwordHash = await bcrypt.hash(password, salt)

            user.password = passwordHash
        }

        try {
            //Return user updated data
            await User.findOneAndUpdate(
                {_id: user._id },
                { $set: user },
                { new: true }
            )

            res.status(200).json({ message: 'Usuário atualizado com sucesso!' })

        } catch (error) {

            res.status(500).json({ message: error})
            return
        }
    }
}