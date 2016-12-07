var express = require("express");
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'));
var buoyHelper = require('./lib/modules/buoy-helper');
var database = require('./lib/modules/database');

var app = express();
app.use(express.static(__dirname + "/public"));

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

var hardCodedUser = 'test.user@gmail.com';

// TODO - In production, idealy every api would have the following:
// logging/metrics for latency and availability (invalid request does not affect availability)
// and alarms on these metrics
// Alarm on any unexpected/programmer error.
app.get("/buoy/list/", function (req, res) {

    // TODO - For demo just use hard coded user and rss search location and skip
    // user managment.
    var user = database.findUser(hardCodedUser);
    if (!user) {
        res.send(500, 'Internal Error');
        console.error('user:' + hardCodedUser + ' does not exist.');
        next();
    }

    request.getAsync(user.buoyRssSearch, {timeout: 2000}).then(function (response) {
        console.log(response);
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
        var user = database.findUser(hardCodedUser);
        if (!user) {
            throw error('user:' + hardCodedUser + ' does not exist.');
        }
        database.addFavoriteBuoy(user, req.params.stationId);
        res.status(200).send();
    } catch (err) {
        res.status(500).send();
        console.error(err);
    }

});

app.post("/buoy/favorite/remove/:stationId", function (req, res) {
    try {
        var user = database.findUser(hardCodedUser);
        if (!user) {
            throw error('user:' + hardCodedUser + ' does not exist.');
        }
        database.removeFavoriteBuoy(user, req.params.stationId);
        res.status(200).send();
    } catch (err) {
        res.status(500).send();
        console.error(err);
    }

});
