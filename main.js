var express = require("express");
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var xmldoc = require('xmldoc');
var loki = require('lokijs');
var buoyHelper = require('./lib/modules/buoy-helper');

var app = express();
app.use(express.static(__dirname + "/public"));

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

// TODO - in memory loki works great for a demo.
// replace with Mongo for a real world app.
var db = new loki('loki.json');
var users = db.addCollection('users');

// Hard code user as we are not dealing with user
// managment for this demo
users.insert({email: 'test.user@gmail.com',
    favorites: {}
});

// TODO - In production, idealy every api would have the following:
// logging/metrics for latency and availability (invalid request does not affect availability)
// and alarms on these metrics
// Alarm on any unexpected/programmer error.
app.get("/buoy/list/", function (req, res) {
    
    var user = users.findOne({ email:'test.user@gmail.com' });   
    var url = 'http://www.ndbc.noaa.gov/rss/ndbc_obs_search.php?lat=40N&lon=73W&radius=100';

    request.getAsync(url, {timeout: 2000}).then(function (response) {
        var data = response.body;
        if (response.statusCode !== 200) {
            res.send(500, 'Internal Error');
            console.error('Call to ' + url + ' failed with statusCode ' + response.statusCode + ' and statusMessage ' + response.statusMessage);
        } else {
            var buoyResponse = {};
            var json = buoyHelper.buoyXmlToItems(data, user.favorites);
            buoyResponse['items'] = json;
            res.status(200).send(buoyResponse);
        }
    }).catch(function (err) {
        res.send(500, 'Internal Error');
        console.error(err);
    });
});

app.post("/buoy/favorite/add/:stationId", function (req, res) {
    try {
        var stationId = req.params.stationId;
        var user = users.findOne({ email:'test.user@gmail.com' });    
        if (!user.favorites[stationId]) {
            user.favorites[stationId] = 1;
            users.update(user);
        } 
        res.status(200).send();
    } catch(err) {
        res.status(500).send();
        console.error(err);
    }
    
});

app.post("/buoy/favorite/remove/:stationId", function (req, res) {
    try {
        var stationId = req.params.stationId;
        var user = users.findOne({ email:'test.user@gmail.com' }); 
        if (user.favorites[stationId]) {
            delete user.favorites[stationId];
            users.update(user);
        }
        res.status(200).send();
    } catch(err) {
        res.status(500).send();
        console.error(err);
    }
    
});
