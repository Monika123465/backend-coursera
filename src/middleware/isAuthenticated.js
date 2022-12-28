const jwt = require('jsonwebtoken');
const User = require('../models/user')
const secretkey = 'secretKey'
const isAuthenticated = async (req, res, next) => {

	try {
		const tokens = req.headers['authorization'];
		if (!tokens) return res.status(400).send({ message: 'token not found' })
		const token = tokens.split(' ')[1].trim();
		const userId = jwt.verify(token, secretkey);
		const dbUser = await User.findById(userId)
		if (!dbUser) return res.status(404).send({ message: "user not found" })
		if (!dbUser.token.includes(token)) return res.status(400).send({ message: "invalid token" });

		// return res.send({message: "exit here"})
		req.user = dbUser;
		req.token = token;
		next()

	} catch (error) {
		return res.status(500).send(error.message);
	}

}


module.exports = isAuthenticated;