const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../config/generateToken');

const registerUser =asyncHandler(async(req, res) => {
    const {name, email, password,pic} = req.body;


    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please fill all the fields");
    }

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    });

    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            password: user.password,
            pic: user.pic,
            token: generateToken(user._id)
        });
    }
    else{
        res.status(400);
        throw new Error("User not created");
    }

});

const authUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;

    const userExists = await User.findOne({email});
    if(userExists && (await userExists.matchPassword(password))){
        
        res.json({
            _id: userExists._id,
            name: userExists.name,
            email: userExists.email,
            pic: userExists.pic,
            token: generateToken(userExists._id)
        });
    } else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});



module.exports = {registerUser, authUser};


