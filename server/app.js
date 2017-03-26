var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan')

var linkPreview = require('./routes/linkPreview');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(morgan('combined'));
app.use('/api/link-preview', linkPreview);

module.exports = app;
