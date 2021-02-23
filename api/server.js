const express = require("express")
const session = require("express-session")
const KnexSessionStore = require("connect-session-knex")(session)

const userRouter = require("./users/users-router")
const authRouter = require("./auth/auth-router")
const server = express()

const config = {
    name:"sessionId",
    secret: "keep it secret, keep it safe",
    cookie:{
      maxAge: 1000 * 60 * 60,
      secure:false,
      httpOnly: true
    },
    resave:false,
    saveUnitialized:false,
  
    store: new KnexSessionStore({
      knex:require("../data/connection.js"),
      tablename:"sessions",
      sidfieldname:"sid",
      createTable:true,
      clearInterval:1000 * 60 * 60
    })
  }

server.use(session(config))
server.use(express.json())
server.use("/api/users", userRouter)
server.use("/api/auth", authRouter)


module.exports = server;