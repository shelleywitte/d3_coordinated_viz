(function(){
//pseudo-global variables
var attrArray = ["varA", "varB", "varC", "varD", "varE"]; //list of attributes
var expressed = attrArray[0]; //initial attribute

window.onload = setMap();

function setMap() {
    var width = 960,
        height = 500;

    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geo.albersUsa()
        .scale(1000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    d3_queue.queue()
        .defer(d3.csv, "data/8th_grade_science_achievement_gap.csv")
        .defer(d3.json, "data/US_shapefile.topojson")
        .await(callback);

    function callback(error, csvData, unitedStates) {
        var us = topojson.feature(unitedStates, unitedStates.objects.US_shapefile).features;

        console.log(us);
        console.log(csvData);

        us = joinData(us, csvData);

        setEnumerationUnits(us, map, path);

    };
};

function joinData (us, csvData) {
    var attrArray = ["All students", "Male", "Female", "White", "Black", "Hispanic", "Asian", "American Indian/Alaska Native", "Native Hawaiian/Other Pacific Islander", "Two or more races", "Eligible for National Lunch Program", "Not eligible for National Lunch Program"];

    for (var i=0; i<csvData.length; i++) {
        var csvState = csvData[i];
        var csvKey = csvState.name;

        for (var a=0; a<us.length; a++) {

            var geojsonProps = us[a].properties;
            var geojsonKey = geojsonProps.name;

            if (geojsonKey == csvKey) {

                attrArray.forEach(function(attr) {
                    var val = parseFloat(csvState[attr]);
                    geojsonProps[attr] = val;
                });
            };
        };
    };

    return us;
};

function setEnumerationUnits(us, map, path) {

    var states = map.selectAll(".states")
        .data(us)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "states " + d.properties.name;
        })
        .attr("d", path);
}

})(); //last line of main.js
