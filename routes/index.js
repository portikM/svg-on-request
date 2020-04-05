var express = require('express');
var router = express.Router();
var createError = require('http-errors')
const fs = require('fs');
var appRoot = require('app-root-path');

function loadData(filename) {
  return new Promise(function (resolve, reject) {
    fs.readFile(`${appRoot.path}/static/${filename}.svg`, 'utf8', (err, data) => {
      if (err) {
        var httpError = null;
        if (err.code === 'ENOENT') {
          httpError = { status: 404, message: 'Not Found', reference: 'https://nodejs.org/en/docs/' }
        } else {
          httpError = {
            status: 500,
            message: 'Please contact me if you believe this is problem with my service.',
            error: err
          }
        }
        reject(httpError)
      } else {
        resolve(data.toString())
      }
    })
  })
}

router.get('/', async (req, res, next) => {
  await loadData(req.query.name)
    .then(data => res.send(data))
    .catch(err => res.status(err.status).send(err));
});

module.exports = router;
