const express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  port = process.env.PORT || 3010;

const configs = require("./configs");
const dbConfig = configs.db;
const response = configs.response;
const db = require("./models");
const Role = db.role;

db.mongoose
.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Successfully connect to MongoDB.");
  initial();
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
var session = require('express-session');
app.use(session({ 
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 86400 }
}))
//api
app.get("/api", (req, res) => {
  response.success({}, "Welcome to restful api application.", res);
});
var { auths, users, tasks } = require('./routes/api');
app.use('/api/v1/auths', auths);
app.use('/api/v1/users', users);
app.use('/api/v1/tasks', tasks);
//controllers
app.set('view engine', 'ejs');
app.get("/", (req, res) => {
  res.render('login', {title: 'Login'});
});
var { home, user, task } = require('./routes/controllers');
app.use('/home', home);
app.use('/users', user);
app.use('/tasks', task);

app.listen(port, '0.0.0.0', () => {
	console.log('Server running at port'+port+': http://127.0.0.1:'+port+'/');
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}