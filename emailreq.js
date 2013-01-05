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
      user: "auto.iris.response@gmail.com"
    , pass: "auto iris key"
    }
  })

  // setup e-mail data
  var mailOptions = {
    from: "auto.iris.response@gmail.com", // sender address
    to: "auto.iris.response@gmail.com", // list of receivers
//    to: "breq_fast@iris.washington.edu", // list of receivers
    subject: "", // Subject line
    text: json.data
  }

  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error) return cb(error)
    cb(null, response.msg)
  })
}

