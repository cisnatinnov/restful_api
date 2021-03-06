//response success
const success = (data, message, res) => {
	let obj = {
		data: data,
		message: message,
	}
	res.status(200).send(obj);
}
//response deleted
const deleted = (data, message, res) => {
	let obj = {
		data: data,
		message: message,
	}
	res.status(204).send(obj);
}
//response error
const error = (message, res) => {
	let obj = {
		message: message,
	}
	res.status(500).send(obj);
}
//response not found
const notFound = (message, res) => {
	let obj = {
		message: message,
	}
	res.status(404).send(obj);
}
//response unAuth
const unAuth = (message, res) => {
	let obj = {
		accessToken: null,
		message: message,
	}
	res.status(403).send(obj);
}
//response invalid
const invalid = (message, res) => {
	let obj = {
		accessToken: null,
		message: message,
	}
	res.status(401).send(obj);
}
//response inused
const inused = (message, res) => {
	let obj = {
		message: message,
	}
	res.status(400).send(obj);
}

module.exports = {
	success,
	error,
	notFound,
	invalid,
	inused,
	unAuth,
	deleted
}