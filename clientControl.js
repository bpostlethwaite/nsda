/*
 * Dnode test.
 *
 */


var ss = require("./serviceStack")

var services = {
  "genEvents": 5001
, "genBreq": 5002
, "emailreq": 5003
}


ss.register(services)
ss.log(true)
ss.start()

function main() {
  var service = "genEvents"
  services[service].on("remote", function(remote) {
    remote.service(function (err, data) {
      log(service, err, data)
      ev.emit( "genBreq", data )
    })
  })
  service = "genBreq"
  services[service].on("remote", function(remote) {
    ev.on(service, function (data) {
      remote.genBreq(data, function (err, data) {
      log(service, err, data)
        ev.emit( "emailreq", data )
      })
    })
  })
  service = "emailreq"
  service[service].on("remote", function(remote) {
    ev.on(service, function (data) {
      remote.emailreq(data, function (err, data) {
      log(service, err, data)
        ev.emit( "ftpreq", data )
      })
    })
  })
  // emailres.on("remote", function(remote) {
  //   ev.on("emailres", function (reqobj) {
  //     remote.emailres(reqobj, function (reqobj) {
  //       ev.emit("ftpreq", reqobj)
  //     })
  //   })
  // })
}


main()

ev.on("ftpreq", function( reqobj ) {
  console.log(reqobj)
})