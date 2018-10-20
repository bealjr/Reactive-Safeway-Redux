const express = require('express'),
  router = express.Router(),
  searchingAlgorithm = require('../backendScripts/algorithm/searchingAlgorithm.js').userInput,
  bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Safeway' });
});

router.post('/directions', function(req, res, next){
  let origin = req.body.origin,
    destination = req.body.destination;

  searchingAlgorithm(origin, destination).then(function(waypointArray){
    console.log("this is waypoint array ", waypointArray);
    res.send(waypointArray);
  })
});

module.exports = router;
