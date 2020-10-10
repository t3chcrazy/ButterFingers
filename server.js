require("dotenv").config()
const express = require("express")
const app = express()
const jwt = require("jsonwebtoken")
const MongoDBClient = require("mongodb").MongoClient
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const { assert } = require("console")

app.use(bodyParser.json())

function checkToken(req, res, next) {
    const token = req.header("token")
    try {
        if (!token) {
            throw Error("Empty token")
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.email = decoded.user.email
        next()
    }
    catch (err) {
        return res.status({
            error: true,
            message: err.message
        })
    }
}

MongoDBClient.connect(process.env.MONGO_URI, (err, client) => {
    if (err) {
        console.log(err.message)
        return
    }
    const collection = client.db("butterfingers").collection("users")


    app.post("/signup", async (req, res) => {
        console.log("Here is req body", req.body)
        const {name, email, password} = req.body
        try {
            assert(name && name.length, "Invalid name")
            assert(email && email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/), "Invalid email")
            assert(password && password.length > 8, "Invalid password")
            const user = await collection.findOne({email: email})
            if (user) {
                throw Error("User already exists")
            }
            const salt = await bcrypt.genSalt(10)
            const cryptPassword = await bcrypt.hash(password, salt)
            const newUser = {
                name,
                email,
                password: cryptPassword,
                records: []
            }
            await collection.insertOne(newUser)
            return res.status(201).json({
                error: false,
                message: "User successfully created"
            })
            // TODO
        }
        catch (err) {
            res.status(401).json({
                error: true,
                message: err.message,
            })
        }
    })

    app.post("/signin", async (req, res) => {
        const {email, password} = req.body
        console.log("here is body", req.body)
        try {
            assert(email && email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/), "Invalid email")
            assert(password && password.length > 8, "Invalid password")
            const user = await collection.findOne({email})
            if (!user) {
                throw Error("User doesn't exist in our database")
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                throw Error("Incorrect password")
            }
            const userId = {
                user: {
                    email: user.email
                }
            }
            const token = await jwt.sign(userId, process.env.SECRET_KEY)
            return res.status(200).json({
                error: false,
                token
            })
        }
        catch (err) {
            return res.status(400).json({
                error: true,
                message: err.message
            })
        }
    })

    app.post("/score/submit", checkToken, async (req, res) => {
        try {
            const email = req.email
            const record = req.body
            console.log("Here is record", record)
            await collection.findOneAndUpdate({email}, {$push: {records: record}})
            return res.status(200).json({
                error: false,
                message: "Record saved"
            })
        }
        catch (err) {
            res.status(400).json({
                error: true,
                message: err.message
            })
        }
    })

    app.get("/getuser", checkToken, async (req, res) => {
        try {
            const email = req.email
            const user = await collection.findOne({email}, {projection: {_id: 0, password: 0}})
            res.status(200).json({
                error: false,
                data: user
            })
        }
        catch (err) {
            res.status(400).json({
                error: true,
                message: err.message
            })
        }
    })

    // TODO: INTEGRATE WITH FRONTEND

})

app.listen(8080, () => {
    console.log("Listening on port 8080")
})