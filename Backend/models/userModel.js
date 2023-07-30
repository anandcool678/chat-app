const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
        name:{
            type: String,
            required: true
        },
        email:{
            type: String,
            trim: true,
            required: true,
            lowercase: true,
            match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please add valid email address.']
        },
        password:{
            type: String,
            required: true,
            select: false
        },
        pic:{
            type: String,
            required: true,
            default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        },

    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User",userSchema);

module.exports= User;