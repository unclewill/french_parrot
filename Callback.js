'use strict';

var Promise = require('bluebird');

function Callback()
{
 var _fn, _self, _resolve, _reject, _promise;

 _fn = _resolve = _reject = null;
 _self = this;

 this.handler = function(err, parm1, parm2)
 {
  _fn.call(this, err, parm1, parm2, _self);
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

