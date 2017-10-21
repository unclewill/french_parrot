/*
MIT License

Copyright (c) 2017 william depalo (will@ivrforbeginners.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

'use strict';

var Promise = require('bluebird');

function Callback()
{
 var _fn, _self, _resolve, _reject, _promise;

 _fn = _resolve = _reject = null;
 _self = this;

 this.handler = function()
 {
  var i, parms;

  for ( i = 0,  parms = []; i < arguments.length; i++ )
   parms.push( arguments[i] );

  parms.push(_self);

  _fn.apply(this, parms);
 };

 this.to = function(callbackTo)
 {
  _fn = callbackTo;

  return _self.handler;
 };

 this.newPromise = function()
 {
  return _promise = new Promise( function(res, rej){ _resolve = res; _reject = rej; } ).then(_no_op);
 };

 this.getPromise = function()
 {
  return _promise;
 };

 this.fulfill = function(value)
 {
  if ( _promise && _resolve )
   _resolve.call(_promise, value);

  _promise = null;
 };

 this.reject = function(err)
 {
  if ( _promise && _reject )
   _reject.call(_promise, err);

  _promise = null;
 };
}

function _no_op()
{
}

module.exports = Callback;

