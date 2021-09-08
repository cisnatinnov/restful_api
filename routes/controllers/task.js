const express = require('express');
const app = express();

app.get('/', (req, res) => {
	if (!req.session.email) {
		res.redirect('/')
	}
	else {
		res.render('index', {title: 'Tasks', page: 'master/tasks'})
	};
})
module.exports = app;