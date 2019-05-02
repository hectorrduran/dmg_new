var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var passport = require('passport');

var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/user');
//get users 

router.get('/register', function(req, res) {
    res.render('register');
});

//login

router.get('/login', function(req, res) {
    res.render('login');
});

//register

router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    //validation

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Name is email').notEmpty();
    req.checkBody('email', 'Name is email').isEmail();
    req.checkBody('username', 'Name is username').notEmpty();
    req.checkBody('password', 'Name is password').notEmpty();
    req.checkBody('password2', 'Name is password').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });

        User.createUser(newUser, function(err, user) {
            if (err) throw err;
        });

        req.flash('success_msg', 'Tu estas registrado y puedes logearte');
        res.redirect('/users/login');
    }

});

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'user no encontrado' });
            }

            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }
));


passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

router.get('/logout', function(req, res) {
    req.logout();
    req.flash('success_msg', 'cerraste sesion');
    res.redirect('/users/login');
});
module.exports = router;