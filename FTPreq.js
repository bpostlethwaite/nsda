/*
 * getRequest waits for events from checkRequest
 * and once it has details it aquires a file stream
 * from the ftp server and pipes it to rdseedRequest
 * for decompressing into SAC format.
 *
 */

var FTPClient = require('ftp')
var fs = require('fs')

var conn = new FTPClient()
conn.on('connect', function() {
  // authenticate as anonymous
  conn.auth('ftp', 'post.ben.here@gmail.com', function(e) {
    if (e)
      throw e
    conn.get('foo.txt', function(e, stream) {
      if (e)
        throw e
      stream.on('success', function() {
        conn.end()
      })
      stream.on('error', function(e) {
        console.log('ERROR during get(): ' + e)
        conn.end()
      })
      stream.pipe(fs.createWriteStream('localfoo.txt'))
    })

  })
})
conn.connect( 21, "ftp.iris.washington.edu")