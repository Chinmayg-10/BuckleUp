const { Router } = require("express");
const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const JWT_SECRET= process.env.JWT_SECRET;
const router = Router();
const userMiddleware = require("../middleware/user");
const fs=require("fs");
const path=require("path");
const { profile } = require("console");
const userModel=require("../database/db.js")

todoJson=path.join(__dirname,"../database/todos.json");
let allUsersData=[];

const profilePictures=["1.jpg","2.jpg","3.jpg","4.jpg","5.jpg","6.jpg","7.jpg","8.jpg","9.jpg","10.jpg","11.jpg","12.jpg"];

// User Routes
router.post('/signup',async (req, res) => {

    if(req.body.username&&req.body.password&&req.body.name){
        let incomingUsername=req.body.username;
        let userFound=await userModel.findOne({username:incomingUsername});
        if(!userFound){
            // let username= uuidv4();
            let newUser={
                username: incomingUsername,
                name: req.body.name,
                password: req.body.password,
                profileImg: profilePictures[Math.floor(Math.random()*profilePictures.length)],
                todos: []
            }
            
            try{
                await userModel.create(newUser)
            } 
            catch(err){
                return res.status(500).json({ 
                    message: "Internal server error. Couldn't save the data.", 
                    error: err 
                });
            }
            token=jwt.sign({ 
                username: incomingUsername
            },JWT_SECRET); 

            res.status(200).json({
                message: `Signup Complete, for ${req.body.name}!!!`,
                token: token,
                profileImg: newUser.profileImg,
                username: incomingUsername
            });
            return;
        }
        else{
            res.status(409).json({
                message: "Username already exist!!"
            });
            return;
        }
    }
    else{
        res.status(401).json({
            message: 'Signup Incomplete, username, name, password not provided!!!'
        });
        return;
    }    
});
     

router.post("/login",async (req,res)=>{
    // Implement user login logic
    if(req.body.username&&req.body.password){
        let username=req.body.username;
        let userFound=await userModel.findOne({username:username})
        if(userFound && userFound.password===req.body.password){
            token=jwt.sign({ 
                username: username
            },JWT_SECRET); 

            res.json({
                message: `User ${username} Logged In succesfully!!!!`,
                token: token,
                username: userFound.username
            });
            return;
        }
        else{
            res.status(401).json({
                message: `LogIn Failed!!!! as ${userFound?'Password is incorrect':'User doesn\'t exist! signup first'}`,
                status: userFound?'Password is incorrect':'User doesn\'t exist!'
            })
            return;
        }
    }
    else{
        res.status(401).json({
            message: "LogIn Failed!!!!",
            status: "No Username or Password provided!!!"
        })
        return;
    }
});

router.get('/signup',(req,res)=>{
    res.sendFile(path.join(__dirname,"../../public/signup.html")); //i'm thinking of taking signups/login on same page and basically changing routs on fe
})
router.get('/login',(req,res)=>{
    res.sendFile(path.join(__dirname,"../../public/login.html"));

})

router.get('/todos',  (req, res) => {
    res.sendFile(path.join(__dirname,"../../public/todos.html"));
});
router.get('/',  (req, res) => {
    res.sendFile(path.join(__dirname,"../../public/index.html"));
});

// router.post('/logout', userMiddleware, (req, res) => {
//     // Implement logout logic
//     // no need to do this simply remove token from fe
// });

module.exports = router