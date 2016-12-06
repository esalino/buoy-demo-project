var chai = require("chai");
var buoyHelper = require('../lib/modules/buoy-helper');
var fs = require('fs');

describe('getStationIdFromLink', function() {
  it('Gets the stationId from noaa buoy link', function(done) {
    var input = 'http://www.ndbc.noaa.gov/station_page.php?station=sdhn4';

    var result = buoyHelper.getStationIdFromLink(input);
    chai.expect(result).to.equal('sdhn4');
    done();
  });
  
  it('Cannot find the regex pattern for station id', function(done) {
    var input = 'http://www.ndbc.noaa.gov/station_page.php?statio=sdhn4';

    chai.expect(function () { buoyHelper.getStationIdFromLink(input); }).to.throw('stationId not found');
    done();
  });
  
  it('Gets our buoy json converted from rss xml', function(done) {
    var input = fs.readFileSync('test/buoy_test_feed.xml', 'utf8');
    var result = buoyHelper.buoyXmlToItems(input);
    chai.expect(result.length).to.equal(24);
    chai.expect(result[0].stationId).to.equal('44025');
    chai.expect(result[0].title).to.equal('Station 44025 - LONG ISLAND - 30 NM SOUTH OF ISLIP, NY');
    chai.expect(result[0].description).to.equal('\n        <strong>December 5, 2016 2:50 pm EST</strong><br />\n        <strong>Location:</strong> 40.251N 73.164W or 17 nautical miles NNW of search location of 40N 73W.<br />\n        <strong>Wind Direction:</strong> NW (310&#176;)<br />\n        <strong>Wind Speed:</strong> 17 knots<br />\n        <strong>Wind Gust:</strong> 21 knots<br />\n        <strong>Significant Wave Height:</strong> 3 ft<br />\n        <strong>Dominant Wave Period:</strong> 5 sec<br />\n        <strong>Average Period:</strong> 3.8 sec<br />\n        <strong>Mean Wave Direction:</strong> SSW (213&#176;)<br />\n        <strong>Atmospheric Pressure:</strong> 29.95 in (1014.2 mb)<br />\n        <strong>Pressure Tendency:</strong> +0.00 in (-0.0 mb)<br />\n        <strong>Air Temperature:</strong> 49&#176;F (9.6&#176;C)<br />\n        <strong>Water Temperature:</strong> 54&#176;F (12.3&#176;C)<br />\n      ');
    done();
  });
});

