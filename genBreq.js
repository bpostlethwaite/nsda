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
    service : genBreq
})

server.listen(5002)

function buildbreq(spec) {
/*
 * Build breqfast object
 * with functions for operating on
 * data.
 */

  var that = this
  if (!spec) spec = {}

  that.breqfast = {
    ".NAME": spec.name || "bpostlethwaite"
  , ".INST": spec.inst || "UBC"
  , ".MAIL": undefined
  , ".EMAIL": spec.email || "post.ben.here@gmail.com"
  , ".PHONE":  spec.phone || undefined
  , ".FAX":  spec.fax || undefined
  , ".MEDIA":  spec.media || "FTP"
  , ".LABEL":  spec.label || "BP_default"
  , ".QUALITY": spec.quality || "B"
  , ".END": undefined
  , "EVENTS" : spec.events || undefined
  }

  function stringify() {
    /*
     * Parses breqfast object into
     * breqFast request text.
     */
    var breq = that.breqfast
    var text = ''
      , keys = Object.keys(breq)
    keys.forEach( function(key) {
      if (Array.isArray(breq[key]))
        text += breq[key].join('\n')
      else
        text += key + (breq[key] ? " " + breq[key] + "\n" : "\n")
    })
    return text
  }

  that.stringify = stringify
  return that
}

function genBreq(breqspec, cb) {
  /*
   * Test service
   *
   */
  var breqstring = buildbreq(breqspec).stringify()
  cb(breqstring)
}
