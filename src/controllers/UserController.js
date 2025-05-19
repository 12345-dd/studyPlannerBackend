const userSchema = require("../models/UserModel");
const Encrypt = require("../utils/Encrypt");

const registerUser = async(req,res) => {
    try{
        req.body.password = await Encrypt.encryptPassword(req.body?.password);
        const newUser = await userSchema.create(req.body);
        if(newUser){
            res.status(201).json({
                message:"User Added Successfully",
                data:newUser
            })
        } else {
            res.status(404).json({
                message:"Error in adding new User"
            })
        }
    } catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

const loginUser = async(req,res) => {
    try{
        const {email,password} = req.body;

        const user = await userSchema.findOne({email:email});

        if(user !== null){
            const isMatch = await Encrypt.comparePassword(password,user.password);
            if(isMatch){
                res.status(200).json({
                    message:"Login Successfully",
                    data:user
                })
            } else {
                res.status(401).json({
                    message:"Invalid Credential"
                })
            }
        } else {
            res.status(404).json({
                message:"User Not Found"
            })
        }
    } catch(err){
        res.status(500).json({
            message:"Internal Server Error",
            data:err
        })
    }
}

module.exports = {
    registerUser,
    loginUser
}