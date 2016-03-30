// map does not have surrounding countries (MX or CA) nor a graticule because of the Albers USA projection which moves Alaska and Hawaii from their actual locations to a location below the southwest United States.

window.onload = setMap();

// set the width and height of the map
function setMap() {
    var width = 960,
        height = 460;

    // creating the map as an svg and giving it attributes of width and height
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    // creating projection - Albers USA which puts Alaska and Hawaii, projected in their own right below the 48 contiguous states
    var projection = d3.geo.albersUsa()
    // no center because it's already centered on the US as part of the projection code
        .scale(600)
        .translate([width / 2, height / 2]); // keeps map centered in the svg container

    // creating a path generator to draw the projection
    var path = d3.geo.path()
        .projection(projection);

    // uses queue.js to parallelize asynchronous loading of the the CSV and shapefile data
    d3_queue.queue()
        .defer(d3.csv, "data/8th_grade_science_achievement_gap.csv")
        .defer(d3.json, "data/US_shapefile.topojson")
        .await(callback); // waits til both sets of data are loaded before it sends the data to the callback function

    // callback function that takes the data as two parameters and an error parameter that will report any errors that occur
    function callback(error, csvData, unitedStates) {
        // translate the topojson to GeoJSON within the DOM
        var us = topojson.feature(unitedStates, unitedStates.objects.US_shapefile).features; // pulls the array of features from the shapefile data and passes it to .data()

        // adding the US states (enumeration units) to the map
        var states = map.selectAll(".states")
            .data(us)
            .enter()
            .append("path")
            .attr("class", function(d) {
                return "states " + d.properties.name; // unique class name in the shapefile properties; in this case names of the states
            })
            .attr("d", path);
    };
};
