const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  port = process.env.PORT || 3010;

const configs = require("./configs");
const dbConfig = configs.db;
const response = configs.response;
const db = require("./models");

db.mongoose
.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
})
.catch(err => {
  console.error("Connection error", err);
  process.exit();
});

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value
 */ 
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    const method = req.body._method
    delete req.body._method
    return method
  }
}))
  
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
	res.header(
		"Access-Control-Allow-Headers",
		"x-access-token, Origin, Content-Type, Accept"
	);
	next();
});

app.get("/api", (req, res) => {
  response.success({username: "",password:""}, "Welcome to restful api application.", res);
});

var { auth, user, task } = require('./routes');

app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);
app.use('/api/v1/task', task);

app.listen(port, '0.0.0.0', () => {
	console.log('Server running at port'+port+': http://127.0.0.1:'+port+'/api');
});