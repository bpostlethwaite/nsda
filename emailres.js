/*
 * checkRequest polls gmail to look for
 * incoming response emails from the IRIS
 * server. If it finds these it parses email
 * into required details, logs success or failure
 * and label, and then sends details to getRequest.
 */

var dnode = require('dnode')
  , util = require('util')
  , ImapConnection = require('imap').ImapConnection


function emailres (reqobj, cb) {
  reqobj["emailres"] = true
  cb(reqobj)
}

var server = dnode({
  service: emailres
})

server.listen(5004)


var imap = new ImapConnection(
  {
    username: 'post.ben.here@gmail.com'
  , password: 'dance magic'
  , host: 'imap.gmail.com'
  , port: 993
  , secure: true
  })

function herr(err) {
  console.log('log: ' + err)
}

function openBox (cb) {
  imap.connect(function(err) {
    if (err) return herr(err)
    imap.openBox('usArray', false, cb)
  })
}

function handleMail (err, mailbox) {
  if (err) return herr(err);
  imap.search(['UNSEEN'] , function(err, results) {
    if (err) return herr(err)
    if (results.length === 0) return herr("No emails match selection")

    var fetch = imap.fetch(results, {
      markSeen: true
    , request:
      {
        headers: ['subject', 'body']
      }
    })
    fetch.on('message', function (msg) {

      msg.on('end', function () {
        extract(msg)
        // msg.headers is now an object containing the requested headers ...
        console.log('Finished message. Headers ' + show(msg.headers));
      })
    })
    fetch.on('end', function() {
      console.log('Done fetching all messages!')
      imap.logout()
    })
  })
}

//function msgparse(msg, msgtype) {


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
    status = msgparse(m, 'A');
    break;

    /*
     * typeB email
     */
    case "IRIS received":
    status = msgparse(m, 'B');
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
      status: "unknown",
      info : m.subject
    };
    break;

  }
}