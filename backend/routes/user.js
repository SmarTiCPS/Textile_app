const express = require('express');
const bcrypt = require('bcrypt');
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post("/signup",(req,res,next)=>{
    bcrypt.hash(req.body.password, 10).then(hash => {
        console.log(hash);
        const user= new User({
            email:req.body.email,
            password: hash,
            firstname :req.body.firstname,
            secondname:req.body.secondname,
            telnumber :req.body.telnumber
        });
        user.save().then(result => {
            res.status(201).json({
                message:"userCreated" ,
                result:result,
            });
        }).catch(err => {
            res.status(500).json({
                error:err
            });
        });
    });
    
});
router.post("/login",(req,res,next) =>{
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user =>{
        if(!user){
            return res.status(401).json({
                message: "Auth failed !!"
            });
        };
        fetchedUser = user;
        return bcrypt.compare(req.body.password,user.password);
    }).then(result =>{
        if(!result){
            return res.status(401).json({
                message: "Auth failed !!"
            });
        }
        const token = jwt.sign({email: fetchedUser.email , userId: fetchedUser._id},'secret_thisshould_be_longer',{expiresIn : "1h"});
        res.status(200).json({
            token:token
        })
    }) .catch(err =>{
        return res.status(401).json({
            message: "Auth failed !!"
        });
    })
});
module.exports = router;