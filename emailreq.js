/*
 * emailrequest wraps an object containing
 * desired events and a request label in the
 * IRIS email transport requirements and sends
 * an email using specified Gmail account.
 *
 * It logs server response with the input label
 */

var dnode = require('dnode')
  , nodemailer = require("nodemailer")


var server = dnode({
    service : mail
})

server.listen(5003)


function mail(json, cb) {
/*
 * Mail breqfast request
 */
  //create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
      user: "post.ben.here@gmail.com"
    , pass: "dance magic"
    }
  })

  // setup e-mail data with unicode symbols
  var mailOptions = {
    from: "post.ben.here@gmail.com", // sender address
    to: "post.ben.here@gmail.com", // list of receivers
//    to: "breq_fast@iris.washington.edu", // list of receivers
    subject: "", // Subject line
    text: json.data
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    error = "some error"
    if(error) {
      cb(error)
    }
    else cb(null, response.msg)
  })
}

