const User = require('../models/User')
const bcrypt = require('bcrypt')
const createUserToken = require('../helpers/create-user-token')

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
}