var express = require('express');
var router = express.Router();

//get homepage 

router.get('/', ensureAuthenticated, function(req, res) {
    res.render('index');
});

router.get('/test', ensureAuthenticated, function(req, res) {
    res.render('index2');
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();

    } else {
        req.flash('error_msg', 'tu no estas logeado');
        res.redirect('/users/login');
    }
}

module.exports = router;