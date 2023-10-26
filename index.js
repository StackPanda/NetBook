var express = require('express');
var app = express();
const path = require('path')
const port = 3000
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.array());
app.use(cookieParser());
app.use(session({ secret: "Your secret key" }));

var Users = [
    {
        "email": "austinjdub@gmail.com",
        "username": "austinjdub",
        "password": "620Jacob"
    }
];

app.get('/views/signup', function (req, res) {
    const options = {
        root: path.join(__dirname, 'public/pages/authentication')
    };

    const fileName = 'signup.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        }
    });
});

app.post('/signup', function (req, res) {
    if (!req.body.id || !req.body.password) {
        res.status("400");
        res.send("Invalid details!");
    } else {
        Users.filter(function (user) {
            if (user.username === req.body.username) {
                res.redirect('/signup?err=exists');
            }
        });
        var newUser = { email: req.body.email, username: req.body.username, password: req.body.password };
        Users.push(newUser);
        req.session.user = newUser;
        res.redirect('/protected_page');
    }
});

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        var err = new Error("Not logged in!");
        next(err);
    }
}

app.get('/views/account', checkSignIn, function (req, res) {
    const options = {
        root: path.join(__dirname, 'public/pages/user')
    };

    const fileName = 'account.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        }
    });
});

app.get('/views/login', function (req, res) {
    const options = {
        root: path.join(__dirname, 'public/pages/authentication')
    };

    const fileName = 'login.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        }
    });
});

app.post('/login', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.redirect('/login?err=missing');
    } else {
        Users.filter(function (user) {
            if (user.id === req.body.id && user.password === req.body.password) {
                req.session.user = user;
                res.redirect('/views/account');
            } else {
                res.redirect('/login?err=invalid');
            }
        });
    }
});

app.get('/logout', function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/views/login');
});

app.use('/views/account', function (err, req, res, next) {
    res.redirect('/login');
});

app.get('/views/home', function (req, res) {
    const options = {
        root: path.join(__dirname, 'public/pages/views')
    };

    const fileName = 'home.html';
    res.sendFile(fileName, options);
});

app.get('/views/about', function (req, res) {
    const options = {
        root: path.join(__dirname, 'public/pages/views')
    };

    const fileName = 'about.html';
    res.sendFile(fileName, options);
});

app.get('/', function (req, res) {
    const options = {
        root: path.join(__dirname, 'public')
    };

    const fileName = 'index.html';
    res.sendFile(fileName, options, function (err) {
        if (err) {
            next(err);
        }
    });
});

app.use('/assets', express.static(path.join(__dirname, 'src')))

app.listen(port, () => {
    console.log(`NetBook app listening on port ${port}`)
})