(function(){

// variables for data join
var attrArray = ["All students", "Male students", "Female students", "White students", "Black students", "Hispanic students", "Asian students", "American Indian/Alaska Native students", "Native Hawaiian/Other Pacific Islander students", "Students of two or more races", "Students eligible for National Lunch Program", "Students not eligible for National Lunch Program"]; //list of attributes

// data that is expressed on the map
var expressed = attrArray[0]; //initial attribute

window.onload = setMap();

function setMap() {
    var width = window.innerWidth * 0.6,
        height = 500;

    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", width)
        .attr("height", height);

    var projection = d3.geo.albersUsa()
        .scale(750)
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
// joins shapefile with CSV data
function joinData (us, csvData) {
    // loops through csv to assign each set of csv attribute values to geojson state
    for (var i=0; i<csvData.length; i++) {
        var csvState = csvData[i]; // current state
        var csvKey = csvState.name; // csv primary key

        // loops through geojson regions to find correct state
        for (var a=0; a<us.length; a++) {

            var geojsonProps = us[a].properties; // current state geojson
            var geojsonKey = geojsonProps.name; //geojson primary key

            // if the keys match, it transfers csv data to geojson properties object
            if (geojsonKey == csvKey) {

                // assigns all attributes and values
                attrArray.forEach(function(attr) {
                    var val = parseFloat(csvState[attr]); //gets CSV attribute value
                    geojsonProps[attr] = val; //assigns attribute and value to geojson properties
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
// creates a color scale for the choropleth map
function makeColorScale(data) {
    var colorClasses = [
        "#bd0026",
        "#f03b20",
        "#fd8d3c",
        "#fecc5c",
        "#ffffb2"
    ];
    // creates color scale generator
    var colorScale = d3.scale.threshold()
        .range(colorClasses);

    // builds array of all values of the exxpressed attribute
    var domainArray = [];
    for (var i=0; i<data.length; i++) {
        var val = parseFloat(data[i][expressed]);
        domainArray.push(val);
    };
    // creates clusters using k-means algorithm to create natural breaks
    var clusters = ss.ckmeans(domainArray, 5);
    // resets domain array to cluster minimums
    domainArray = clusters.map(function(d) {
        return d3.min(d);
    });
    // removes first value from domain array to create class breakpoints
    domainArray.shift();
    // assign array of last 4 cluster minimums as domain
    colorScale.domain(domainArray);

    return colorScale;

};
// dealing with null (NaN) values in the data and how it will be expressed in the choropleth map
function choropleth(props, colorScale) {
    var val = parseFloat(props[expressed]);
    // if the value doesn't exist, assign gray, if it's not NaN, then give it a color according to the color scale
    if (isNaN(val)) {
        return "#CCC";
    } else {
        return colorScale(val);
    };
};

// creates coordinated bar chart
function setChart(csvData, colorScale) {
    // sets min and max of the data (depending on what attribute is expressed)
    var minmax = [
        d3.min(csvData, function(d) {
            return parseFloat(d[expressed]); }),
        d3.max(csvData, function(d) {
            return parseFloat(d[expressed]); })
    ];
    // dimensions of the chart frame
    var chartWidth = window.innerWidth * 0.8,
        chartHeight = 473,
        leftPadding = 35,
        rightPadding = 5,
        topBottomPadding = 5,
        chartInnerWidth = chartWidth - leftPadding - rightPadding
        chartInnerHeight = chartHeight - topBottomPadding * 2,
        translate = "translate(" + leftPadding + "," + topBottomPadding + ")";
    // creates a second svg element to hold the bar chart
    var chart = d3.select("body")
        .append("svg")
        .attr("width", chartWidth)
        .attr("height", chartHeight)
        .attr("class", "chart");

    // creates a rectangle to set a background fill
    var chartBackground = chart.append("rect")
        .attr("class", "chartBackground")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);

    // scales the size of the bars proportionally to the frame
    var yScale = d3.scale.linear()
        .range([chartHeight - 25, 0])
        .domain(minmax);

    // sets bars for each state
    var bars = chart.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .sort(function(a, b){
            return b[expressed]-a[expressed]
        })
        .attr("class", function(d){
            return "bar " + d.name;
        })
        .attr("width", chartInnerWidth / csvData.length - 1)
        .attr("x", function(d, i){
            return i * (chartInnerWidth / csvData.length) + leftPadding;
        })
        .attr("height", function(d, i){
            return 463 - yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d, i){
            return yScale(parseFloat(d[expressed])) + topBottomPadding;
        })
        .style("fill", function(d){
            return choropleth(d, colorScale);
        });

    //creates a text element for the chart title
    var chartTitle = chart.append("text")
        .attr("x", 200)
        .attr("y", 30)
        .attr("class", "chartTitle")
        .text("Average score for " + expressed.toLowerCase() + " in each state");

    //creates vertical axis generator
    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

    //places axis on the chart
    var axis = chart.append("g")
        .attr("class", "axis")
        .attr("transform", translate)
        .call(yAxis);

    //creates a frame for chart border
    var chartFrame = chart.append("rect")
        .attr("class", "chartFrame")
        .attr("width", chartInnerWidth)
        .attr("height", chartInnerHeight)
        .attr("transform", translate);
};


})(); //last line of main.js
