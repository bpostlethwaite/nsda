/*
 * Server is the main control program which handles
 * moving requests through the system and logging
 * progress.
 */
var emitStream = require('emit-stream')
  , muxdemux = require('mux-demux')
  , EventEmitter = require('events').EventEmitter
  , net = require('net')
  , fs = require('fs')
  , path = require('path')

var servicename = '/tmp/' + path.basename(__filename)

function service(stream) {
  var mdm = muxdemux(
    {
      error: false
    })

  mdm.pipe(stream).pipe(mdm)

  mdm.on('connection', function (meta) {
    c.pipe(process.stdout)


var ev = createEmitter()
  emitStream(ev).pipe(stream)
}

var server = net.createServer(service)

fs.unlink(servicename, function (err) {
  server.listen(servicename)
})

function createEmitter () {
  var ev = new EventEmitter
  setInterval(function () {
    ev.emit('ping', Date.now())
  }, 2000)
  return ev
}




function getBreq(label, events) {
/*
 * Build breqfast object
 */
  return {
    ".NAME": "bpostlethwaite"
  , ".INST": "UBC"
  , ".MAIL": undefined
  , ".EMAIL": "post.ben.here@gmail.com"
  , ".PHONE":  "778 869-9361"
  , ".FAX":  undefined
  , ".MEDIA":  "FTP"
  , ".LABEL":  label
  , ".QUALITY": "B"
  , ".END": undefined
  , "EVENTS" : events
  }
}


var events = {
/*
 * Object containing event requests
 */
  "NNA": "II 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
, "PFO": "TS 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
, "PFO": "II 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
, "KMI": "CD 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
}

var label = "bpostTest" // Label for finding file name in ftp

var breqfast = getBreq(label, events)

function eat(breq) {
/*
 * Parses breqfast object into
 * breqFast request text.
 */
  var text = ''
  var keys = Object.keys(breq)
  keys.forEach( function(key) {
    if (typeof(breq[key]) === 'object')
      text += eat(breq[key])
    else
      text += key + (breq[key] ? " " + breq[key] + "\n" : "\n")
  })
  return text
}

//console.log(eat(breqfast))
