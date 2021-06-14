const express = require('express')
const path = require('path')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const csrf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('express-error-handler');
const PORT = process.env.PORT || 5000
var csrfProtection = csrf({ cookie: true })

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(helmet.referrerPolicy({ policy: 'no-referrer' }))
// if (process.env.NODE_ENV === 'production'){
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'", 'magnus.vulns.co.uk', 'magnusfrater.herokuapp.com'],
//     scriptSrc: ["'self'", "'sha256-7XPxMRps4NQEYoSym7z6/EATDcSpV1N5We2uvJPZBYo='"],
//     styleSrc: ['magnus.vulns.co.uk', 'fonts.googleapis.com', 'use.fontawesome.com', 'magnusfrater.herokuapp.com'],
//     fontSrc: ["'self'", 'magnus.vulns.co.uk', 'fonts.gstatic.com', 'use.fontawesome.com', 'magnusfrater.herokuapp.com'],
//     imgSrc: ["* https:"],
//     frameSrc: ["'none'"],
//     sandbox: ['allow-forms', 'allow-scripts', 'allow-same-origin'],
//     reportUri: '/report-violation',
//     objectSrc: ["'none'"],
//     frameAncestors: ["'none'"],
//     upgradeInsecureRequests: false,
//     workerSrc: false
//   },
//   loose: false,
//   reportOnly: false,
//   setAllHeaders: false,
//   disableAndroid: false,
//   browserSniff: true
// }))
// }

handler = errorHandler({
  views: {
    '404': 'pages/404.ejs',
    '500': 'pages/500.ejs'
  }
});

app.get('*', csrfProtection, function (req, res, next) {
    next()
});
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./routes/index.js')(app);
app.use(errorHandler.httpError(404));
app.use(handler);
app.listen(PORT, () => {
  console.log('We are live on ' + PORT);
});