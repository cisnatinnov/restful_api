const express = require('express');
const _ = require('lodash');
const models = require('../../models');
const { response } = require('../../configs');
const app = express();
const { authJwt } = require('../../middlewares');

const Task = models.task;

app.use(function(req, res, next) {
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});

app.get('/', [ authJwt.verifyToken, authJwt.isUser ], (req, res) => {
	Task.find({})
	.exec((err, result) => {
		if (err) {
			response.error(err, res);
			return;
		}
		else {
			if (_.isEmpty(result)) {
				response.notFound('No data', res);
				return;
			}
			response.success(results, 'Show '+results.length+' data', res);
		}
	})
})

app.get('/create',
[ authJwt.verifyToken, authJwt.isUser ],
(req, res) => {
	response.success({
		task: '',
		date: Date,
		time: ''
	}, 'Create data', res);
})

app.post('/create',
[ authJwt.verifyToken, authJwt.isUser ],
(req, res) => {
	const task = new Task({
		task: req.body.task,
		date: req.body.date,
		time: req.body.time
	})

	task.save((err, task) => {
		if (err) {
			response.error(err, res);
			return;
		}

		response.success(task, "Task inserted", res)
	})
})

app.get('/edit/:id',
[ authJwt.verifyToken, authJwt.isUser ],
(req, res) => {
	Task.findById(req.params.id)
	.exec((err, row) => {
		if (err) {
			response.error(err, res);
			return;
		}
		else {
			if (_.isEmpty(row)) {
				response.notFound('No data', res);
				return;
			}

			response.success({
				id: row._id,
				task: row.task,
				date: row.date,
				time: row.time
			}, 'Task found', res);
		}
	})
})

app.put('/edit/:id',
[ authJwt.verifyToken, authJwt.isUser ],
(req, res) => {
	var task = {
		task: req.body.task,
		date: req.body.date,
		time: req.body.time
	}

	Task.findByIdAndUpdate({_id: req.params.id}, task, (err, docs) => {
		if (err) {
			response.error(err, res);
			return;
		}

		response.success(docs, 'Data updated', res);
	})
})

app.delete('/delete/:id',
[ authJwt.verifyToken, authJwt.isUser ],
(req, res) => {
	Task.findByIdAndDelete({_id: req.params.id}, (err, docs) => {
		if (err) {
			response.error(errUpdate, res);
			return;
		}

		response.deleted(docs, 'Data deleted', res);
	})
})

module.exports = app;