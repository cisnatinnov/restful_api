//response success
const success = (data, message, res) => {
	let obj = {
		data: data,
		message: message,
	}
	res.status(200).json(obj);
}
//response deleted
const deleted = (data, message, res) => {
	let obj = {
		data: data,
		message: message,
	}
	res.status(204).json(obj);
}
//response error
const error = (message, res) => {
	let obj = {
		message: message,
	}
	res.status(500).json(obj);
}
//response not found
const notFound = (message, res) => {
	let obj = {
		message: message,
	}
	res.status(404).json(obj);
}
//response unAuth
const unAuth = (message, res) => {
	let obj = {
		accessToken: null,
		message: message,
	}
	res.status(403).json(obj);
}
//response invalid
const invalid = (message, res) => {
	let obj = {
		accessToken: null,
		message: message,
	}
	res.status(401).json(obj);
}
//response inused
const inused = (message, res) => {
	let obj = {
		message: message,
	}
	res.status(400).json(obj);
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