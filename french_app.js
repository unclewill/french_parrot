
'use strict';

//process.env.DEBUG = 'actions-on-google:*';
var http = require('http');
var path = require('path');
var Callback = require('./Callback');
var webRequest = require('request');
var ActionsSdkApp = require('actions-on-google').ActionsSdkApp;
var express = require('express');
var expressApp = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
var SCHEDULE_QUERY = 'your_domain_goes_here.SCHEDULE_QUERY';

function handlePost(request, response)
{
 var app, actions;

 // Javascript assistant API

 app = new ActionsSdkApp( {request: request, response: response} );

 // Our intent to handler mapping

 actions = new Map();
 actions.set(SCHEDULE_QUERY,           queryIntent);
 actions.set(app.StandardIntents.MAIN, mainIntent);
 actions.set(app.StandardIntents.TEXT, textIntent);
 app.handleRequest(actions);

 // Handles the main intent

 function mainIntent(app)
 {
  app.ask('Polly want a cracker');
 }

 // Handles a custom query intent

 function queryIntent(app)
 {
 }

 // Handles the text intent

 function textIntent(app)
 {
  var text, query, get, cb;

  text = app.getRawInput() || '';

  query = {};
  query.key='trnsl.1.1.20171018T204650Z.b6985ea253719533.8ae17f2ece97a6d46e97e180abe2bd17122ed163';
  query.lang='en-fr';
  query.format='plain';
  query.text = text;

  get = {};
  get.url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?';
  get.qs = query;

  cb = new Callback();
  cb.text = text;
  cb.app = app;
  cb.request = request;
  cb.response = response;

  webRequest(get, cb.to(translateCompletes));

  return cb.getPromise();
 }

 function translateCompletes(error, response, body, cb)
 {
  var ok, foreign, card, rich;

  if ( error )
  {
   ok = false;
   foreign = error;
  }

  else if ( !body )
  {
   ok = false;
   foreign = 'The translator returned nothing';
  }

  else
  {
   ok = true;
   body = JSON.parse(body);
   foreign = body.text[0];
  }

  // Translation fails -
  // just parrot and log the error

  if ( !ok )
  {
   cb.app.ask(cb.text);
   console.log(foreign);
  }

  // Translation succeeds -
  // parrot and show a card with the translation

  else
  {
   card = cb.app.buildBasicCard();
   card.setTitle('Translating')
       .setSubtitle('To French')
       .setBodyText(foreign)
       .addButton('Yandex', 'http://translate.yandex.com')
       .setImage('https://image.ibb.co/ggzUO6/translate.png',
                 'accessibilty text goes here',
                 56, 56);

   rich = cb.app.buildRichResponse();
   rich.addBasicCard(card);
   rich.addSimpleResponse(cb.text)

   cb.app.ask(rich);
  }

  cb.fulfill(foreign);
  cb = null;
 }
}

// returns our home page

function handleGetIndex(request, response)
{
 response.render('pages/index')
}

// returns our about page

function handleGetAbout(request, response)
{
 response.render('pages/about')
}

// Configure and start the web server.

expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'ejs');
expressApp.use( bodyParser.json( {type: 'application/json'} ) );

// Assistant requests are routed here

expressApp.post('/', handlePost);

// Note that the license for the translation
// web service that we use requires that we
// show a credit on the about page.

expressApp.get('/', handleGetIndex);
expressApp.get('/about', handleGetAbout);

// Start listening on the proper port

expressApp.set('port', port);
expressApp.listen(port);
console.log('French parrot Assistant listening on port %s', port);

module.exports = expressApp;
