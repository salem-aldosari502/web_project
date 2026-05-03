const jwt = require("jsonwebtoken");
const User = require('../models/user_info');
const bcrypt = require('bcrypt');


const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

exports.signupUser = async (req, res)=>{
    try {
        console.log(req.body)
        const {name, email, password, birth, gender, phone, role}= req.body;
        
        const hashedPassword = await bcrypt.hash(password,10)

        const newUser = await User.create({
            name,
            email,
            password:hashedPassword,
            birth,
            gender,
            phone,
            role
        })
        
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            birth: newUser.birth,
            gender: newUser.gender,
            phone: newUser.phone,
            role: newUser.role,
            createdAt: newUser.createdAt
        })
    }catch(error){
        res.status(400).json({message: error.message})
    }
};

exports.loginUser = async(req, res)=>{
    try{
        const {email,password}=req.body;
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch)
            return res.status(401).json({message:"invalid credentials"})

            const token = jwt.sign(
                {
                    id:user._id,
                    role:user.role
                },
                JWT_SECRET,
                {
                    expiresIn:"1h"
                }
            );

            res.json({
                token,
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                }
            });
    }catch(error){
        res.status(500).json({message: error.message})
    }
};


exports.getAllUsers = async (req, res)=>{
    try {
        const users = await User.find();
        res.status(200).json(users)
    }catch(error){
        res.status(500).json({message: error.message})
    }
};

exports.getUserById = async (req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({message: "User not found!"});
        }
    
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            birth: user.birth,
            gender: user.gender,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

exports.updateUser = async (req, res)=>{
    try {
        const {name, email, password, gender, avatar} = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (gender) updateData.gender = gender;
        if (avatar !== undefined) updateData.avatar = avatar;
        
        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {new: true}
        );
        
        if (!updatedUser) {
            return res.status(404).json({message: "User not found"});
        }
        
        res.status(200).json(updatedUser);
    }catch(error){
        res.status(500).json({message: error.message})
    }
};

exports.deleteUser = async (req, res)=>{
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "User deleted"});
    }catch(error){
        res.status(500).json({message: error.message})
    }
}