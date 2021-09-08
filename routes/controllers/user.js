const express = require('express');
const app = express();

app.get('/', (req, res) => {
	if (!req.session.email) {
		res.redirect('/')
	}
	else {
		res.render('index', {title: 'Users', page: 'setting/users'})
	};
})
module.exports = app;