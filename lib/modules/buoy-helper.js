var xmldoc = require('xmldoc');

var pattern = new RegExp('station=([a-z]|[0-9])+', 'i');
var getStationIdFromLink = function(link) {
    var found = pattern.exec(link);
    if (!found) {
        throw 'stationId not found';
    }
    var id = found[0].substring(8, found[0].length);
    return id;
};

// TODO - Since this is blocking, possibly extract extra performance
// by using sax-js which xmldoc is built on
var buoyXmlToItems = function(buoyXml, favorites) {
    var jsonItems = [];
    // Get the list of <item> from xml
    var document = new xmldoc.XmlDocument(buoyXml);
    var channel = document.childNamed('channel');
    var xmlItems = channel.childrenNamed('item');
    // Convert xml item into json item
    for (var i = 0; i < xmlItems.length; i++) {
        try {
            var item = {};
            var xmlItem = xmlItems[i];
            var children = xmlItem.children;
            // Get each xml item property
            for (var j = 0; j < children.length; j++) {
                var child = children[j];
                item[child.name] = child.val;
                if (child.name === 'link') {
                    var stationId = null;
                    // TODO - Research using guid element as the stationId.
                    // I didnt here because I noticed temporary ship onservations
                    // can show up and would have to understand how to better handle these
                    // temporary observations.
                    stationId = getStationIdFromLink(child.val);
                    item['stationId'] = stationId;
                    if (favorites && favorites[stationId]) {
                       item['favorite'] = true; 
                    } else {
                       item['favorite'] = false; 
                    }
                }
            }
            jsonItems.push(item);
        } catch(err) {
            console.error(err);
        }
    }
    // TODO - To make this more robust look for any favorites not
    // found and put a buoy not available place holder
    return jsonItems;
};

module.exports = {
	getStationIdFromLink: getStationIdFromLink,
	buoyXmlToItems: buoyXmlToItems
};
