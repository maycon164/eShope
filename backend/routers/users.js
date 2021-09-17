const {User} = require('../models/user');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

require('dotenv').config({
    path:'./backend/.env'
})

module.exports = (app) => {

    function checkId(id, res){
        
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).send("user id is invalid");
        }

    }

    const api = process.env.API_URL;
 
    //LISTA TODOS OS USUARIOS
    app.get(`${api}/user`, async (req, res) => {

        const userList = await User.find().select('name phone email');
        if(!userList) res.status(500).json({error: "Cannot get anything from MongoDB"});
        
        res.status(200).json(userList);
   
    });

    //findById
    app.get(`${api}/user/:id`, async(req, res) => {
        
        checkId(req.params.id, res);

        let user = await User.findById(req.params.id).select('-passwordHash');
        
        if(!user)
            return res.status(400).send("cannot get any user");
        
        return res.status(200).json(user);
    });

    //Cadastrar novo user
    app.post(`${api}/user`, async (req, res) => {
        //console.log(req.body);

        let user = new User(req.body);
        user.passwordHash = bcrypt.hashSync(req.body.password, 10);

        /*let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: req.body.passwordHash,
            phone: req.body.phone,
            country: req.body.country,
            city: req.body.city,
            zip: req.body.zip,
            street: req.body.street,
            apartment: req.body.apartment,
            isAdmin: req.body.isAdmin,
        });*/

        user = await user.save();

        if(!user)
            return res.status(400).send("the user cannot be created");

        return res.status(200).json({success: true, user});

    })

}