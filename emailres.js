/*
 * checkRequest polls gmail to look for
 * incoming response emails from the IRIS
 * server. If it finds these it parses email
 * into required details, logs success or failure
 * and label, and then sends details to getRequest.
 * It should timeout after a set period - and just
 * send a Timeout error message back to client.
 */

var dnode = require('dnode')
  , util = require('util')
  , ImapConnection = require('imap').ImapConnection


var server = dnode({
  service: emailres
})

server.listen(5004)

/*
 * Imap configuration
 */
var imap = new ImapConnection(
  {
    username: 'auto.iris.response@gmail.com'
  , password: 'auto iris key'
  , host: 'imap.gmail.com'
  , port: 993
  , secure: true
  })

/*
 * Error Handling
 */
function handleError(err) {
  console.log('log: ' + err)
}

function mailHandler (cb) {
  return function (err, mailbox) {
    if (err) return handleError(err)
    imap.search(['UNSEEN'] , function(err, results) {
      if (err) return handleError(err)
      if (results.length === 0) return handleError("No emails match selection")

      var fetch = imap.fetch(results, {
        markSeen: true
      , request: {headers: ['subject', 'body']}
      })
      fetch.on('message', function (msg) {

        msg.on('end', function () {
          var status = extract(msg)
          // msg.headers is now an object containing the requested headers ...
          console.log('Finished message. Headers ' + show(msg.headers))
        })
      })
      fetch.on('end', function() {
        console.log('Done fetching all messages!')
        //imap.logout()
      })
    })
  }
}

function msgparse(body, msgtype) {


function extract(m, cb) {
  /*
   * Extract and parse Message subject
   *
   * If message is of typeC (No data):
   *    -> Extract label information
   *    -> Perform Logging
   *
   *  * If message is of typeA (received notification):
   *    -> Extract label from end statement of body
   *    -> perform logging
   *
   * If message is of typeB (ftp request information):
   *    -> Extract ftp request information
   *    -> Perform logging
   *
   */

  /*
   * Extract and parse message subject
   */

  var subj = m.subject.slice(0,14)
    , status

  switch(subj)
  {
    /*
     * typeA email
     */
    case "Your request ":
    status = msgparse(m.body, 'A');
    break;

    /*
     * typeB email
     */
    case "IRIS received":
    status = msgparse(m.body, 'B');
    break;

    /*
     *  No data email
     */

    // Not Implemented

    /*
     * Unknown email type: need to implement
     */
    default:
    status = {
      data: m.subject,
      info : "email subject unknown"
    };
    break;

  }

  return status
}



function openBox (cb) {
  imap.connect(function(err) {
    if (err) return handleError(err)
    imap.openBox('INBOX', false, mailHandler() )
  })
}


