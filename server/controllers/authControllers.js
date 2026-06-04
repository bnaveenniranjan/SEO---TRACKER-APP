import User from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const generateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{EXP}{expiresIn : "30d"})
}

//Register user

export const register = async (req,res) => {
    try{
        const {name,email,password} = req.body;

        if(!name,!email,!password) return res.status(400).json({success : false,message:"all fields ae required "});
        
        //Checks if user exists
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({success : false,message:"User already exists"});

        //Hash password
        const hashedPassword = await bcrypt.hash(password,await bcrypt.genSalt(10))

        // Create user
        const user = await User.create({name,email,password:hashedPassword})
        
        const token = generateToken(user._id);

        res.status(201).json({})

    }catch(error){
        console.error("Register error:",error.message)
        res.status(500).json({success:false,message:"server error"})

    }
}
//login user

export const login = async (req,res) => {
    try{
        const {name,email,password} = req.body;

        if(!name,!email,!password) return res.status(400).json({success : false,message:"all fields ae required "});
        
        //Checks if user exists
        const existingUser = await User.findOne({email})
        if(existingUser) return res.status(400).json({success : false,message:"User already exists"});

        //Hash password
        const hashedPassword = await bcrypt.hash(password,await bcrypt.genSalt(10))

        // Create user
        const user = await User.create({name,email,password:hashedPassword})
        
        const token = generateToken(user._id);

        res.status(201).json({})

    }catch(error){
        console.error("Register error:",error.message)
        res.status(500).json({success:false,message:"server error"})

    }
}