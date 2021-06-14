module.exports = function (app) {
  const bcrypt = require('bcryptjs');
  const speakeasy = require('speakeasy');
  const jwt = require('jsonwebtoken');
  const csrf = require('csurf');
  var checkSession = require('../functions/validateSession.js');
  var sessionStatus;
  const webRequest = require('request');
  var currentError = undefined;
  const csrfProtection = csrf({
    cookie: true
  })
  var JWTToken = '';
  if (process.env.NODE_ENV === 'production') {
    JWTToken = process.env.JWT;
  }

  app.get('/', (req, res) => {
    // var sessionVal = req.cookies;
    // checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
    //   if (result) {
    //     res.redirect('/dashboard');
    //   } else {
    res.render('pages/index.ejs', {
      csrfToken: req.csrfToken(),
      "error": currentError
    });
    //   };
    // })
  });

  app.post('/', csrfProtection, (req, res) => {
    webRequest.post({
      headers: {
        'content-type': 'application/json'
      },
      url: 'https://magnus.cjax.uk/login',
      body: JSON.stringify(req.body)
    }, function (error, response, body) {
      var parsedJSON = JSON.parse(body);
      if (!error) {
        res.cookie('authCookie', parsedJSON.token, {
          expires: new Date(new Date(Date.now()).getTime() + 60 * 60 * 24 * 1000),
          httpOnly: true
        });
        res.redirect('/dashboard');
      }
    });
  });

  app.get('/dashboard', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    var dashboardData;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      if (result) {
        webRequest.get({
          headers: {
            'content-type': 'application/json',
            'Token': sessionVal.authCookie
          },
          url: 'https://magnus.cjax.uk/dashboard/stats',
          body: JSON.stringify(req.body)
        }, function (error, response, body) {
          dashboardData = JSON.parse(body);
          if (!error) {
            res.render('pages/dashboard.ejs', {
              csrfToken: req.csrfToken(),
              dashboardData: dashboardData
            })
          }
        });
      } else {
        res.clearCookie("authCookie");
        currentError = 'You must login before continuing';
        res.redirect('/');
      }
    });
  });

  app.get('/statistics', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      if (result) {
        res.render('pages/statistics.ejs', {
          csrfToken: req.csrfToken()
        })
      } else {
        res.clearCookie("authCookie");
        currentError = 'You must login before continuing';
        res.redirect('/');
      }
    });
  });

  app.get('/alerts', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    var alertData;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      webRequest.get({
        headers: {
          'content-type': 'application/json',
          'Token': sessionVal.authCookie
        },
        url: 'https://magnus.cjax.uk/alerts',
        body: JSON.stringify(req.body)
      }, function (error, response, body) {
        alertData = JSON.parse(body);
        if (!error) {
          res.render('pages/alerts.ejs', {
            csrfToken: req.csrfToken(),
            alertData: alertData
          })
        }
      });
    });
  });

  app.post('/alerts/:alertId/mark', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      webRequest.patch({
        headers: {
          'content-type': 'application/json',
          'Token': sessionVal.authCookie
        },
        url: 'https://magnus.cjax.uk/alerts/' + req.params.alertId + '/mark'
      }, function (error, response, body) {
        if (!error) {
          res.json({
            "status": "success"
          });
        }
      });
    });
  });

  app.get('/users/me', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      if (result) {
        res.render('pages/userProfile.ejs', {
          csrfToken: req.csrfToken()
        })
      } else {
        res.clearCookie("authCookie");
        currentError = 'You must login before continuing';
        res.redirect('/');
      }
    });
  });

  app.post('/users', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      webRequest.post({
        headers: {
          'content-type': 'application/json',
          'Token': sessionVal.authCookie
        },
        url: 'https://magnus.cjax.uk/users',
        body: JSON.stringify(req.body)
      }, function (error, response, body) {
        var parsedJSON = JSON.parse(body);
        if (!error) {
          res.redirect('/administration');
        }
      });
    });
  });

  app.get('/logout', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      res.clearCookie("authCookie");
      res.redirect('/');
    });
  });

  app.delete('/users/:userId', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      if (result) {
        res.render('pages/userProfile.ejs', {
          csrfToken: req.csrfToken()
        })
      } else {
        res.clearCookie("authCookie");
        currentError = 'You must login before continuing';
        res.redirect('/');
      }
    });
  });

  app.get('/students/:studentId', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    var studentData;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      webRequest.get({
        headers: {
          'content-type': 'application/json',
          'Token': sessionVal.authCookie
        },
        url: 'https://magnus.cjax.uk/students/' + req.params.studentId,
        body: JSON.stringify(req.body)
      }, function (error, response, body) {
        studentData = JSON.parse(body);
        if (!error) {
          res.render('pages/userProfileStudent.ejs', {
            csrfToken: req.csrfToken(),
            studentData: studentData
          })
        }
      });
    });
  });

  app.get('/administration', csrfProtection, (req, res) => {
    var sessionVal = req.cookies;
    var userData;
    var campusData;
    var cameraData;
    var studentData;
    checkSession.checkSession(app, sessionVal.authCookie, JWTToken).then(function (result) {
      if (result) {
        webRequest.get({
          headers: {
            'content-type': 'application/json',
            'Token': sessionVal.authCookie
          },
          url: 'https://magnus.cjax.uk/users',
          body: JSON.stringify(req.body)
        }, function (error, response, body) {
          userData = JSON.parse(body);
          webRequest.get({
            headers: {
              'content-type': 'application/json',
              'Token': sessionVal.authCookie
            },
            url: 'https://magnus.cjax.uk/campus',
            body: JSON.stringify(req.body)
          }, function (error, response, body) {
            campusData = JSON.parse(body);
            webRequest.get({
              headers: {
                'content-type': 'application/json',
                'Token': sessionVal.authCookie
              },
              url: 'https://magnus.cjax.uk/camera/all',
              body: JSON.stringify(req.body)
            }, function (error, response, body) {
              cameraData = JSON.parse(body);
              if (!error) {
                webRequest.get({
                  headers: {
                    'content-type': 'application/json',
                    'Token': sessionVal.authCookie
                  },
                  url: 'https://magnus.cjax.uk/students',
                  body: JSON.stringify(req.body)
                }, function (error, response, body) {
                  studentData = JSON.parse(body);
                  if (!error) {
                    res.render('pages/administration.ejs', {
                      csrfToken: req.csrfToken(),
                      userData: userData,
                      campusData: campusData,
                      cameraData: cameraData,
                      studentData: studentData
                    })
                  }
                });
              }
            });
          });
        });
      }
    });
  });
};