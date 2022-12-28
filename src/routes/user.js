const express = require("express")
const User = require("../models/user.js")
const jwt = require('jsonwebtoken')
const secretkey = "secretKey"
const fast2sms = require('fast-two-sms')
const isAuthenticated = require("../middleware/isAuthenticated")

const app = express.Router()




app.post('/signin', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).send({ message: `user not found with email ${email}` })
    if (password !== user.password) return res.status(400).send({ message: "user credentials are not correct" });
    const token = jwt.sign(user._id.toString(), secretkey);
    user.token = [...user.token, token]
    await user.save()
    return res.send({ token, id: user.id, name: user.name, email: user.email, tokens: user.token });
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
})

app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body
  try {
    let existinguser = await User.findOne({ email })
    if (existinguser) {
      return res.status(404).send("email already exist try with another one")
    }
    let user = await User.create({
      name, email, password
    })
    res.send({
      name: user.name,
      email: user.email,
      password: user.password
    })
  } catch (e) {
    res.status(404).send(e.message)
  }
})


app.post('/userprofile', isAuthenticated, async (req, res) => {
  try {
    // const authData = jwt.verify(req.token, secretkey)
    const user = req.user

    user.token = undefined;

    return res.send(user);
  } catch (error) {
    return res.status(500).send({ message: error.message })
  }
})



app.delete('/signout', isAuthenticated, async (req, res) => {
  try {
    const token = req.token;
    const user = req.user;

    user.token = user.token.filter(el => el !== token);
    await user.save();
    return res.send({ message: 'logout succesfull' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
})

app.delete('/signout/all', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    user.token = [];
    await user.save();
    return res.send({ message: 'logout from all devices' })
  } catch (error) {

    return res.status(500).send({ message: error.message })
  }
})





// app.post("/login", (req, res) => {
//   var options = { authorization: "1HJIYUtvuiP70wLBN9D8gmfWR4MlAqkpodCsVEKFGbey5X3Q2ch6L0rP7UuWIO5c9wJZe4vD8mozljVT", message: 'Your otp for node is 12345', numbers: ['7033919229', '8434769419'] }
//   fast2sms.sendMessage(options)


// })








module.exports = app