/*
 * Service Stack
 * Some funky connect like stack, except using
 * dnode and streaming services.
 *
 */
var dnode = require('dnode')
  , winston = require('winston')
  , EventEmitter = require('events').EventEmitter
  , util = require("util")
  , ev = new EventEmitter


module.exports = function () {

  var that = {}
  that.id = 0

  function register(serviceObj) {
    that.stack = Object.keys(serviceObj)
    that.stack.forEach( function (service) {
      that[service] = {}
      that[service].name = service
      that[service].d = dnode.connect(serviceObj[service])
      that[service].id = that.id++
    })
  }

  function logger(service, bool) {
    if(typeof service === "boolean")
      that.log = bool
    else
      that.service.log = bool
  }

  function start() {
 /*
  * Run through each service and set up event handlers
  * to work in a chain. If the ID === 0 and the service
  * is the first service, do not set it up to wait for
  * an event, instead just call the function, and don't
  * pass in data - thus there is an assumption that the
  * first service is just a producer, all intermediary
  * services are throughputs and the final service is just
  * a consumer - though it might pass back err or a loggable
  * info object or string.
  */
    that.stack.forEach( function (service) {
      that[service].d.on("remote", function(remote) {
        if (that[service].id > 0) {
          ev.on(service, function (data) {
            remote.service(data, function (err, data) {
              if (that.log)
                log(service, err, data)
              ev.emit( next(service), data )
            })
          })
        } else {
          remote.service(function (err, data) {
            if (that.log)
              log(service, err, data)
            ev.emit( next(service), data )
          })
        }
      })
    })
  }

  function next(service) {
    var names = []
      , i
    for(i = 0; i < that.stack.length; i++) {
      if(that.stack[i] === service)
        if(i < that.stack.length - 1)
          return that.stack[i+1]
    }
    return null
  }

  function log(service, err, data) {
    winston.info(service + ":" + ( (err) ? err : JSON.stringify(data) ) )
  }

  that.register = register
  that.logger = logger
  that.start = start

  return that

}


var services = {
  "genEvents": 5001
, "genBreq": 5002
, "emailreq": 5003
}

var ss =  module.exports()

ss.register(services)
ss.logger(true)
ss.start()