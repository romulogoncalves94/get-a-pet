const User = require('../models/User')

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
    }
}