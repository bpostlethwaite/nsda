/*
 * Main control. Call services.
 *
 *
 */
var ss = require("blunderbuss")()

var services = {
  "genEvents": 5001
, "genBreq": 5002
, "emailreq": 5003
}


ss.register(services)
ss.logger(true)
ss.start({"data":2})
