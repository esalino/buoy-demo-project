var loki = require('lokijs');

// TODO - in memory loki works great for a demo.
// replace with Mongo for a real world app.
var db = new loki('loki.json');
var users = db.addCollection('users');

// Hard code user as we are not dealing with user
// managment for this demo
users.insert({email: 'test.user@gmail.com',
    favorites: {}
});

var findUser = function (userEmail) {
    return users.findOne({email: userEmail});
};

var addFavoriteBuoy = function (user, stationId) {
    if (user && user.favorites && !user.favorites[stationId]) {
        user.favorites[stationId] = 1;
        users.update(user);
        return true;
    }
    return false;
};

var removeFavoriteBuoy = function (user, stationId) {
    if (user && user.favorites && user.favorites[stationId]) {
        delete user.favorites[stationId];
        users.update(user);
        return true;
    }
    return false;
};

module.exports = {
    addFavoriteBuoy: addFavoriteBuoy,
    removeFavoriteBuoy: removeFavoriteBuoy,
    findUser: findUser
};

