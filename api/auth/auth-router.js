const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const Users = require("../users/users-model")

const checkPayload = (req,res,next)=>{
    if(!req.body.username || !req.body.password){
        res.status(401).json("Username or password missing")
    }else{
        next()
    }
}

const checkUserInDb = async (req,res,next)=>{
    try{
        const rows = await Users.findBy({username: req.body.username})
        if(!rows.length){
            next()
        }else{
            res.status(401).json("Username already exists")
        }
    }catch(e){
        res.status(500).json(`Server error: ${e}`)
    }
}

const checkUserExists = async (req,res,next)=>{
    try{
        const rows = await Users.findBy({username: req.body.username})
        if(rows.length){
            req.userData = rows[0]
            next()
        }else{
            res.status(401).json("Login error, check credentials")
        }
    }catch(e){
        res.status(500).json(`Server error: ${e}`)
    }
}


router.post("/register",checkPayload, checkUserInDb,async (req,res) => {
    try{
        const hash = bcrypt.hashSync(req.body.password,10)
        const newUser = await Users.add({username: req.body.username, password:hash})
        res.status(201).json(newUser)
    }catch(e) {
        res.status(500).json({message: e.message})
    }
})

router.post("/login",checkPayload,checkUserExists, (req, res) => {
    try{
        const verified = bcrypt.compareSync(req.body.password, req.userData.password)
        if(verified) {
            req.session.user = req.userData
            res.json(`Welcom back ${req.userData.username}`)
        res.json(req)
        }else{ 
            res.status(401).json("username or password incorrect")
        }
    }catch(e) {
        res.status(500).json({message: "hello"})
    }
})



router.get("/logout", (req, res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err) {
                res.json("cant log out")
            }else{
                res.json("logged out")
            }
        })
    }else{
        res.json("no session")
    }
})


module.exports = router;