(function(){

//***GLOBAL VARIABLES***

// variables for data join
var attrArray = ["all students", "male students", "female students", "white students", "black students", "Hispanic students", "Asian students", "American Indian/Alaska native students", "native Hawaiian/other Pacific islander students", "students of two or more races", "students eligible for National School Lunch Program", "students not eligible for National School Lunch Program"]; //list of attributes

// data that is expressed on the map
var expressed = attrArray[0]; //initial attribute

var mapWidth = 730,
    mapHeight = 480;

// dimensions of the chart frame
var chartWidth = 700,
    chartHeight = 300,
    leftPadding = 35,
    rightPadding = 10,
    topBottomPadding = 10,
    chartInnerWidth = chartWidth - leftPadding - rightPadding
    chartInnerHeight = chartHeight - topBottomPadding * 2,
    translate = "translate(" + leftPadding + "," + topBottomPadding + ")";

//creates a text element for the chart title
var chartTitle = d3.select("body")
    .append("text")
    .attr("class", "chartTitle")
    .attr("text-anchor", "middle")
    .text("Average science scores for ");

// scale used to set the range of the y-axis scale and bar height in the chart
var yScale = d3.scale.linear()
    .range([chartHeight - 20, 0])
    .domain([0, 200])


// sets up when the browser laods
window.onload = setMap();

// creates map and other page elements; also loads data
function setMap() {
    // adds map to the body of the page; assigns width and hight properties
    var map = d3.select("body")
        .append("svg")
        .attr("class", "map")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

    // microscope image = SCIENCE!
    var microscope = d3.select("body")
        .append("img")
        .attr("class", "microscope")
        .attr("src", "/css/microscope.png")
        .attr("width", 70)
        .attr("height", 70)

    // page title
    var pageTitle = d3.select("body")
        .append("text")
        .attr("class", "pageTitle")
        .attr("text-anchor", "left")
        .html("Minding the (Achievement) Gap")

    //Albers USA projection to include scaled AK and HI
    var projection = d3.geo.albersUsa()
        .scale(950)
        .translate([mapWidth / 2, mapHeight / 2]);

    // achievement gap title and subsequent description
    var agTitle = d3.select("body")
        .append("text")
        .attr("class", "agTitle")
        .attr("text-anchor", "left")
        .html("<h2> What is the achievement gap?</h2>")

    var agText = d3.select("body")
        .append("text")
        .attr("class", "agText")
        .attr("text-anchor", "left")
        .html("<p>An achievement gap is the disparity in educational performance between two or more groups of students. This disparity is typically seen between particular demographics of students such as gender, race/ethnicity, and socioeconomic status. Often, in the United States, measures of educational achievement gaps are used to highlight the disparity between white students and their black or Hispanic peers as well as the potential long-term, societal consequences those gaps have on these particular groups.</p>")

    var measTitle = d3.select("body")
        .append("text")
        .attr("class", "measTitle")
        .attr("text-anchor", "left")
        .html("<h2>Measuring the Achievement Gap</h2>")

    var measText = d3.select("body")
        .append("text")
        .attr("class", "measText")
        .attr("text-anchor", "left")
        .html("<p>There are a variety of measures of educational achievement including student grade-point average, high school graduation rates, national standardized test scores, and college enrollment and completion rates.<br><br> This map shows the average <b><u>science assessment scores for 8th grade students</b></u> by state, for 2011. The National Assessment of Education Progress (NAEP) is the largest nationally representative assessment of student knowledge in mutiple subject areas. The tests are given at critical junctures in academic achievement, specifically grades 4, 8, and 12. <br><br>Scores and proficiency levels for the NAEP tests are particular to one subject and grade combination and cannot be compared across grades or subjects. The score breakdown for 8th grade science assessment is: <br><br><i>Basic </i>:  141 <br><i>Proficient </i>:  170 <br><i>Advanced </i>:  215 </p>")

    var sources = d3.select("body")
		.append("text")
		.attr("class", "sources")
		.html("<h3>Sources & Links:</h3><h4><a href='http://nces.ed.gov/nationsreportcard/about/'>National Assessment of Education Progress overview</a> <br> <a href='http://www.nationsreportcard.gov/science_2011/about_science.aspx'>About the NAEP Science Assessment</a> <br> <a href='http://nces.ed.gov/nationsreportcard/science/achieve.aspx'>NAEP Science Achievement Levels</a> <br> <a href='http://nces.ed.gov/nationsreportcard/naepdata/'>NAEP NAEP Data Explorer <i>(source of data)</i> </a> </h4>")



// attempt at adding dropshadow to United States map
    // var svg = d3.select("body")
    //     .append("svg")
    //     .attr("width", width)
    //     .attr("height", height);
    //
    // var filter = svg.append("defs")
    //     .append("filter")
    //     .attr("id", "drop-shadow")
    //     .attr("height", "110%");
    //
    // filter.append("feGaussianBlur")
    //     .attr("in", "SourceAlpha")
    //     .attr("stdDeviation", 1)
    //     .attr("result", "blur");
    //
    // filter.append("feOffset")
    //     .attr("in", "blur")
    //     .attr("dx", 1)
    //     .attr("dy", 1)
    //     .attr("result", "offsetBlur");
    //
    // var feMerge = filter.append("feMerge");
    //
    // feMerge.append("feMergeNode")
    //     .attr("in", "offsetBlur")
    // feMerge.append("feMergeNode")
    //     .attr("in", "SourceGraphic");
    //
    // var gradient = svg.append("svg:defs")
    //   .append("svg:linearGradient")
    //     .attr("id", "gradient")
    //     .attr("x1", "0%")
    //     .attr("y1", "0%")
    //     .attr("x2", "0%")
    //     .attr("y2", "100%")
    //     .attr("spreadMethod", "pad");
    //
    // gradient.append("svg:stop")
    //     .attr("offset", "0%")
    //     .attr("stop-color", "#0F3871")
    //     .attr("stop-opacity", 1);
    //
    // gradient.append("svg:stop")
    //     .attr("offset", "100%")
    //     .attr("stop-color", "#175BA8")
    //     .attr("stop-opacity", 1);

    // projects map
    var path = d3.geo.path()
        .projection(projection);

    // loading data files
    d3_queue.queue()
        .defer(d3.csv, "data/8th_grade_science_achievement_gap.csv")
        .defer(d3.json, "data/US_shapefile.topojson")
        .await(callback);

    // callback function that loads the data; data waits to be called
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

// sets up the state boundaries and event listeners for hover highlighting
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
            // select the paths of the state borders and sort them
            map.selectAll("path").sort(function (a, b) {
                // a is not the mouseover element, send "a" to the back
                if (a != d) return -1;
                // a is the mouseover element, bring "a" to the front
                else return 1;
            });
        })
        .on("mouseout", function(d){
            dehighlight(d.properties);
        })
        .on("mousemove", moveLabel);

    // original properties for state boundaries (for mousemove)
    var desc = states.append("desc")
        .text('{"stroke": "#ccc", "stroke-width": "1.0px"}');
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

    // builds array of all values of the expressed attribute
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
        .attr("width", chartInnerWidth / csvData.length - 2)
        .on("mouseover", highlight)
        .on("mouseout", dehighlight)
        .on("mousemove", moveLabel);

    var desc = bars.append("desc")
        .text('{"stroke": "none", "stroke-width": "0px"}');

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

    var chartText = chart.append("text")
        .attr("class", "chartText")
        .attr("text-anchor", "right")
        .attr("x", 483)
        .attr("y", 27)
        .text("Overall National Average: 151.73");

    updateChart(bars, csvData.length, colorScale);
};

// creates dropdown menu for changing attributes
function createDropdown(csvData){
    //adds select element
    var dropdown = d3.select("body")
        .append("select")
        .attr("class", "dropdown")
        .on("change", function(){
            changeAttribute(this.value, csvData)
        });

    //adds initial option
    var titleOption = dropdown.append("option")
        .attr("class", "titleOption")
        .attr("disabled", "true")
        .text("Select student group (demographics)");

    //adds attribute name options (what you see when the menu opens; i.e. attribute names)
    var attrOptions = dropdown.selectAll("attrOptions")
        .data(attrArray)
        .enter()
        .append("option")
        .attr("value", function(d){ return d })
        .text(function(d){ return d });
};

// function that sets what happens to the map and chart when you change an attribute via the dropdown
function changeAttribute(attribute, csvData){
    //changes the expressed attribute
    expressed = attribute;

    //recreates the color scale
    var colorScale = makeColorScale(csvData);

    //recolors enumeration units
    var states = d3.selectAll(".states")
        .transition()
        .duration(1000)
        .style("fill", function(d){
            return choropleth(d.properties, colorScale)
        });

    var bars = d3.selectAll(".bar")
        //re-sorts bars after attribute change
        .sort(function(a, b){
            return b[expressed] - a[expressed];
        })
        .transition()
        .delay(function(d, i) {
            return i * 20
        })
        .duration(500);

    // sending these changes to the updateChart function
    updateChart(bars, csvData.length, colorScale);
};

// function that actually updates the chart and map when attributes change
function updateChart(bars, n, colorScale) {
    bars.attr("x", function(d, i){
            return i * (chartInnerWidth / n) + leftPadding;
        })
        .attr("height", function(d, i){
            return 279 - yScale(parseFloat(d[expressed]));
        })
        .attr("y", function(d, i){
            return yScale(parseFloat(d[expressed])) + topBottomPadding;
        })
        .style("fill", function(d){
            return choropleth(d, colorScale);
        })

        var chartTitle = d3.select(".chartTitle")
        .text("Average science scores for ");
};

// function that defines what happens when you hover over a state
function highlight(props) {
    var selected = d3.selectAll("." + props.adm1_code)
        .style({
            "stroke": "#0E3378",
            "stroke-width": "2.5",
            "fill-opacity": "1.0"
        });
    setLabel(props);
};

// retores pre-hover style properties upon mouseout
function dehighlight(props) {
    var selected = d3.selectAll("." + props.adm1_code)
        .style({
            "stroke": function(){
                return getStyle(this, "stroke")
            },
            "stroke-width": function(){
                return getStyle(this, "stroke-width")
            },
            "fill-opacity": function(){
                return getStyle(this, "fill-opacity")
            }
        });

    // retrieves the information stored in the desc element  for the oririnal style
    function getStyle(element, styleName){
        var styleText = d3.select(element)
            .select("desc")
            .text();

        var styleObject = JSON.parse(styleText);

        return styleObject[styleName];
    };

    // removes the map hover label upon mousemove
    d3.select(".infolabel")
        .remove();
};

// sets up the label that retrieves state name and score for selected attribute
function setLabel(props) {

    //pop-up content for each state
    var labelAttribute = props[expressed]

    if (Boolean(props[expressed]) == true) {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) + "</h5><b>" + "</b>"
      } else {
        labelAttribute = "No data"
      };


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
        .html(props.name)

};
// creates dynamic label that changes with mouseover on the map
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
