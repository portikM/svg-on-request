var express = require('express');
var router = express.Router();
var createError = require('http-errors')
const fs = require('fs');
var appRoot = require('app-root-path');

function loadData(query) {
  return new Promise(function (resolve, reject) {
    fs.readFile(`${appRoot.path}/static/${query.name}.svg`, 'utf8', (err, data) => {
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
        var svgData = data.toString();
        var colour = null;

        if (query.colour || query.color) {
          if (isValidHex(query.colour) || isValidHex(query.color)) {
            colour = query.colour || query.color;
          }
        }
        colour = colour || '#38B2AC'

        resolve(svgData.replace(/current-colour/g, colour))
      }
    })
  })
}

function isValidHex(colour) {
  if (!colour || typeof colour !== 'string') return false;

  if (colour.substring(0, 1) === '#') colour = colour.substring(1);

  switch (colour.length) {
    case 3: return /^[0-9A-F]{3}$/i.test(colour);
    case 6: return /^[0-9A-F]{6}$/i.test(colour);
    case 8: return /^[0-9A-F]{8}$/i.test(colour);
    default: return false;
  }

  return false;
}

router.get('/', async (req, res, next) => {
  await loadData(req.query)
    .then(data => res.send(data))
    .catch(err => res.status(err.status).send(err));
});

module.exports = router;
