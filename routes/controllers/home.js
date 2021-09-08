const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.render('index', {title: 'Home', page: 'home'});
})
module.exports = app;