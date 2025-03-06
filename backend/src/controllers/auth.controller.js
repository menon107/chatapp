import User from "../models/user.js";
import generateToken from "../lib/utils.js";
import bcrypt from "bcryptjs"; // Ensure bcrypt is imported
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => { 
    const { fullname, email, password } = req.body;
    try {
        if(!fullname || !password || !email){
            return res.status(400).json({ message: "all fields are required" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        const user = await User.findOne({ email }); // Awaiting user search
        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullname,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            await newUser.save(); // Save the new user before generating a token
            generateToken(newUser._id, res); // Generating token after saving

            return res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
                profilePic: newUser.profilePic,
            });
        } else {
            console.log("Error in signup");
            return res.status(400).json({ message: "Failed to create user" });
        }
    } catch (err) {
        console.error("Signup Error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
        const{email,password} = req.body;
    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"invalid credentials"});
        }
        const isValidPassword = await bcrypt.compare(password,user.password);
        if(!isValidPassword){
            return res.status(400).json({message:"Invalid credentials"});
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilePic:user.profilePic,
        })
    }
    catch(err){
        console.error("Login Error:",err);
        res.status(500).json({message:"login error"})
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    }
    catch(err){
        console.error("Logout Error:",err);
        res.status(500).json({message:"internal server error"})
    }
};

export const updateProfile = async(req,res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id
        if(!profilePic){
          return res.status(400).json({msg:"profile picture required"})  
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json({msg:"Successfully uploaded the image"})

    }
    catch(err){
        console.log("internal error ")
        res.status(500).json({msg:"error is ", err})
    }
};

export const checkAuth = async (req,res) => {
    try{
        res.status(200).json(req.user)
    }
    catch(err){
        console.log("Error in checkAuth controller")
        res.status(500).json({msg:"error is ", err})
    }
}




