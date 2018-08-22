const express = require('express');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');
const moment = require('moment');

/**
 * Configs
 */

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(3000);


/**
 * Middlewares
 */
const nameMiddleware = (req, res, next) => {
  const { nome } = req.query;

  if (!nome) {
    res.redirect('/');
  } else {
    next();
  }
};


/**
 * Rotas
 */

app.get('/', (req, res) => {
  res.render('main');
});

app.post('/check', (req, res) => {
  const { dataDeNascimento, nome } = req.body;

  if (!dataDeNascimento || !nome) {
    return res.redirect('/');
  }

  const idade = moment().diff(moment(dataDeNascimento, 'YYYY/MM/DD'), 'years');

  if (idade >= 18) {
    return res.redirect(`/major?nome=${nome}`);
  }
  return res.redirect(`/minor?nome=${nome}`);
});

app.get('/major', nameMiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('major', { nome });
});

app.get('/minor', nameMiddleware, (req, res) => {
  const { nome } = req.query;
  res.render('minor', { nome });
});
