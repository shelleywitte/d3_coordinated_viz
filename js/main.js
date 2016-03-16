window.onload = setMap();

function setMap() {

    var q = d3_queue.queue();

    q
        .defer(d3.csv, "data/8th_grade_science_achievement_gap.csv")
        .defer(d3.json, "data/choropleth_map.topojson")
        .await(callback);

    function callback(error, csvData, unitedStates) {
        var us = topojson.feature(unitedStates, unitedStates.objects.choropleth_map).features;

        console.log(unitedStates);
    };
};
