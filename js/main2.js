(function(){

// variables for data join
var attrArray = ["all students", "male students", "female students", "white students", "black students", "Hispanic students", "Asian students", "American Indian/Alaska native students", "native Hawaiian/other Pacific islander students", "students of two or more races", "students eligible for National School Lunch Program", "students not eligible for National School Lunch Program"]; //list of attributes

// data that is expressed on the map
var expressed = attrArray[0]; //initial attribute

// dimensions of the chart frame
var chartWidth = window.innerWidth * 0.8,
    chartHeight = 485,
    leftPadding = 35,
    rightPadding = 5,
    topBottomPadding = 10,
    chartInnerWidth = chartWidth - leftPadding - rightPadding
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

var yScale = d3.scale.linear()
    .range([chartHeight - 20, 0])
    .domain([0, 200])

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

        createDropdown(csvData);

    };
};
// joins shapefile with CSV data
function joinData (us, csvData) {
    // loops through csv to assign each set of csv attribute values to geojson state
    for (var i=0; i<csvData.length; i++) {
        var csvState = csvData[i]; // current state
        var csvKey = csvState.adm1_code; // csv primary key

        // loops through geojson regions to find correct state
        for (var a=0; a<us.length; a++) {

            var geojsonProps = us[a].properties; // current state geojson
            var geojsonKey = geojsonProps.adm1_code; //geojson primary key

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
            return "states " + d.properties.adm1_code;
        })
        .attr("d", path)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale);
        })
        .on("mouseover", function(d){
            highlight(d.properties);
        })
        .on("mouseout", function(d){
            dehighlight(d.properties);
        })
        .on("mousemove", moveLabel);

    var desc = states.append("desc")
        .text('{"stroke": "#000", "stroke-width": "0.5px"}');
};
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

    // sets bars for each state
    var bars = chart.selectAll(".bar")
        .data(csvData)
        .enter()
        .append("rect")
        .sort(function(a, b){
            return b[expressed]-a[expressed]
        })
        .attr("class", function(d){
            return "bar " + d.adm1_code;
        })
        .attr("width", chartInnerWidth / csvData.length - 1)
        .on("mouseover", highlight)
        .on("mouseout", dehighlight)
        .on("mousemove", moveLabel);

    var desc = bars.append("desc")
        .text('{"stroke": "none", "stroke-width": "0px"}');

    //creates a text element for the chart title
    var chartTitle = chart.append("text")
        .attr("x", 400)
        .attr("y", 30)
        .attr("class", "chartTitle")
        .attr("text-anchor", "middle")
        .text("Average score for " + expressed + " in each state");

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

    updateChart(bars, csvData.length, colorScale);
};

function createDropdown(csvData){
    //add select element
    var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, csvData)
        });

    //add initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select Attribute");

    //add attribute name options
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};

function changeAttribute(attribute, csvData){
    //change the expressed attribute
    expressed = attribute;

    //recreate the color scale
    var colorScale = makeColorScale(csvData);

    //recolor enumeration units
    var states = d3.selectAll(".states")
        .transition()
        .duration(1000)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        });

    var bars = d3.selectAll(".bar")
        //re-sort bars
        .sort(function(a, b){
            return b[expressed] - a[expressed];
        })
        .transition()
        .delay(function(d, i) {
            return i * 20
        })
        .duration(500);

    updateChart(bars, csvData.length, colorScale);
};

function updateChart(bars, n, colorScale) {
    bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
        .attr("height", function(d, i){
            return 463 - yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d, i){
            return yScale(parseFloat(d[expressed])) + topBottomPadding;
        })
        .style("fill", function(d){
            return choropleth(d, colorScale);
        })

        var chartTitle = d3.select(".chartTitle")
        .text("Average score for " + expressed + " in each state");
};

function highlight(props) {
    var selected = d3.selectAll("." + props.adm1_code)
        .style({
            "stroke": "gray",
            "stroke-width": "2.5"
        });
    setLabel(props);
};

function dehighlight(props) {
    var selected = d3.selectAll("." + props.adm1_code)
        .style({
            "stroke": function(){
                return getStyle(this, "stroke")
            },
            "stroke-width": function(){
                return getStyle(this, "stroke-width")
            }
        });

    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];

        d3.select(".infolabel")
		    .remove();
    };
};

function setLabel(props) {
    //label content
    var labelAttribute = "<h1>" + props[expressed] +
        "</h1><b>" + expressed + "</b>";

    //create info label div
    var infolabel = d3.select("body")
        .append("div")
        .attr({
            "class": "infolabel",
            "id": props.adm1_code + "_label"
        })
        .html(labelAttribute);

    var stateName = infolabel.append("div")
        .attr("class", "labelname")
        .html(props.name);
};

function moveLabel(){
    //get width of label
    var labelWidth = d3.select(".infolabel")
        .node()
        .getBoundingClientRect()
        .width;

    //use coordinates of mousemove event to set label coordinates
    var x1 = d3.event.clientX + 10,
        y1 = d3.event.clientY - 75,
        x2 = d3.event.clientX - labelWidth - 10,
        y2 = d3.event.clientY + 25;

    //horizontal label coordinate, testing for overflow
    var x = d3.event.clientX > window.innerWidth - labelWidth - 20 ? x2 : x1;
    //vertical label coordinate, testing for overflow
    var y = d3.event.clientY < 75 ? y2 : y1;

    d3.select(".infolabel")
        .style({
            "left": x + "px",
            "top": y + "px"
        });


};

})(); //last line of main.js
