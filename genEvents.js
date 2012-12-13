/*
 * emailrequest wraps an object containing
 * desired events and a request label in the
 * IRIS email transport requirements and sends
 * an email using specified Gmail account.
 *
 * It logs server response with the input label
 */

var dnode = require('dnode')


var server = dnode({
    service : genEvents
})

server.listen(5001)

function genEvents(json, cb) {
  json.events = [
    /*
     * Object containing event requests
     */
    "NNA II 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
  , "PFO TS 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
  , "PFO II 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
  , "KMI CD 1999 01 04 02 41 57.5 1999 01 04 02 43 57.5  1 BHZ"
  ]

  json.label = "bpostTest" // Label for finding file name in ftp
  cb(null, json)
}