(function(){
//pseudo-global variables
var attrArray = ["varA", "varB", "varC", "varD", "varE"]; //list of attributes
var expressed = attrArray[0]; //initial attribute

window.onload = setMap();

function setMap() {
    var width = window.innerWidth * 0.5,
        height = 500;

    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geo.albersUsa()
        .scale(630)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    d3_queue.queue()
        .defer(d3.csv, "data/8th_grade_science_achievement_gap.csv")
        .defer(d3.json, "data/US_shapefile.topojson")
        .await(callback);

    function callback(error, csvData, unitedStates) {
        var us = topojson.feature(unitedStates, unitedStates.objects.US_shapefile).features;

        us = joinData(us, csvData);

        var colorScale = makeColorScale(csvData);

        setEnumerationUnits(us, map, path, colorScale);

        setChart(csvData, colorScale);

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

function setEnumerationUnits(us, map, path, colorScale) {

    var states = map.selectAll(".states")
        .data(us)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "states " + d.properties.name;
        })
        .attr("d", path)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale);
        });
}

function makeColorScale(data) {
    var colorClasses = [
        "#f7f7f7",
        "#cccccc",
        "#969696",
        "#636363",
        "#252525"
    ];

    var colorScale = d3.scale.quantile()
        .range(colorClasses);

    var domainArray = [];
    for (var i=0; i<data.length; i++) {
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };

    colorScale.domain(domainArray);

    return colorScale;

    console.log(colorScale.quantiles());
};

function choropleth(props, colorScale) {
    var val = parseFloat(props[expressed]);

    if (val && val != NaN) {
        return colorScale(val);
    } else {
        return "#CCC";
    };
};

function setChart(csvData, colorScale) {
    var chartWidth = window.innerWidth * 0.425,
        chartHeight = 460;

    var chart = d3.select("body")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");

    var yScale = d3.scale.linear()
        .range([0, chartHeight])
        .domain([0, 105]);

    var bars = chart.selectAll(".bars")
        .data(csvData)
        .enter()
        .append("rect")
        .attr("class", function(d) {
            return "bars " + d.name;
        })
        .attr("width", chartWidth / csvData.length - 1)
        .attr("x", function(d, i) {
            return i * (chartWidth / csvData.length);
        })
        .attr("height", function(d) {
            return yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d) {
            return chartHeight - yScale(parseFloat(d[expressed]));
        });


};

})(); //last line of main.js
