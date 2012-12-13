/*
 * Dnode test.
 *
 */


var ss = require("./serviceStack")()

var services = {
  "genEvents": 5001
, "genBreq": 5002
, "emailreq": 5003
}


ss.register(services)
ss.logger(true)
ss.start()
