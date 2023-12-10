import express from 'express';
const app = express();
import configRoutes from './routes/index.js';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import exphbs from 'express-handlebars';

const staticDir = express.static('public');

const handlebarsInstance = exphbs.create({
  defaultLayout: 'main',
  // Specify helpers which are only registered on this instance.
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === 'number')
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },

    partialsDir: ['views/partials/']
  }
});

app.use('/public', staticDir);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthState',
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    cookie: {maxAge: 60000}
  })
);

app.get('/', (req, res, next) => {
  req.method = 'GET';
  //res.originalUrl = '/login';

  if (req.session.user) { // user is authenticated
    let log = `${new Date().toUTCString()}: ${req.method}: ${req.originalUrl} (Authenticated)`;
    console.log(log);
    if(req.session.user.role === 'admin'){
      return res.redirect('/admin');
    }
    else if(req.session.user.role === 'user'){    
      return res.redirect('/protected');
    }
  } else {
     let log = `${new Date().toUTCString()}: ${req.method}: ${req.originalUrl} (Authenticated)`;
     console.log(log);
    return res.redirect('/posts');
  }
});

/*

2. This middleware will only be used for the GET /login route and will do one of the following: If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route, if the user is authenticated AND they have a role of user, you will redirect them to the /protected route. If the user is NOT authenticated, you will allow them to get through to the GET /login route. A logged in user should never be able to access the login form.

*/
app.use('/login', (req, res, next) => {
  if (req.session.user) { // user is authenticated
    if(req.session.user.role === 'admin'){
      return res.redirect('/admin');
    }
    else {        
      return res.redirect('/protected');
    }
  } else {
    next();
  }
});

/*

3. This middleware will only be used for the GET /register route and will do one of the following: If the user is authenticated AND they have a role of admin, the middleware function will redirect them to the /admin route, if the user is authenticated AND they have a role of user, you will redirect them to the /protected route. If the user is NOT authenticated, you will allow them to get through to the GET /register route. A logged in user should never be able to access the registration form. */
app.use('/register', (req, res, next) => {
if (req.session.user) { // user is authenticated
  if(req.session.user.role === 'admin'){
    return res.redirect('/admin');
  }
  else if(req.session.user.role === 'user'){        
    return res.redirect('/protected');
  }
} else {
  next();
}
});

/*
4. This middleware will only be used for the GET /protected route and will do one of the following:

If a user is not logged in, you will redirect to the GET /login route.
If the user is logged in, the middleware will "fall through" to the next route calling the next() callback.
Users with both roles admin or user should be able to access the /protected route, so you simply need to make sure they are authenticated in this middleware. */

app.use('/protected', (req, res, next) => {
if (req.session.user) { // user is authenticated
  next();
} else {
  return res.redirect('/login');
}
});

/*
5. This middleware will only be used for the GET /admin route and will do one of the following:

If a user is not logged in, you will redirect to the GET /login route.
If a user is logged in, but they are not an admin user, you will redirect to /error and render a HTML error page saying that the user does not have permission to view the page, and the page must issue an HTTP status code of 403.
If the user is logged in AND the user has a role of admin, the middleware will "fall through" to the next route calling the next() callback.
ONLY USERS WITH A ROLE of admin SHOULD BE ABLE TO ACCESS THE /admin ROUTE! */
app.use('/admin', (req, res, next) => {
if (req.session.user) { // user is authenticated
  if(req.session.user.role !== 'admin'){
    res.errorMsg = "User does nort have permission to viwe the page. Status cpde 403";
    return res.status(403).redirect('/error');
  }
  else
    next();
} else {
  return res.redirect('/login');
}
});

/*
6. This middleware will only be used for the GET /logout route and will do one of the following:

1. If a user is not logged in, you will redirect to the GET /login route.

2. if the user is logged in, the middleware will "fall through" to the next route calling the next() callback.

*/
app.use('/logout', (req, res, next) => {
if (req.session.user) { // user is authenticated
  next();
} else {
  return res.redirect('/login');
}
});

configRoutes(app);

const portNum = 3000;
app.listen(portNum, () => {
  console.log("We've now got a server!");
  console.log(`Your routes will be running on http://localhost:${portNum}`);
});
