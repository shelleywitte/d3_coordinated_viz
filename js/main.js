if (Boolean(props[expressed]) == true) {
    if (expressed == "all students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "male students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "female students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "white students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "black students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "Hispanic students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "Asian students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "American Indian/Alaska native students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "native Hawaiian/other Pacific islander students") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "students of two or more races") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "students eligible for National School Lunch Program") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>"
    } else if (expressed == "students not eligible for National School Lunch Program") {
        labelAttribute = "<h5> Average score: " + parseFloat(props[expressed]).toFixed(1) +
            "</h5><b>" + "</b>";
} else { //if no data associated with selection, display "No data"
    labelAttribute = "<h5> Average score: No Data </h5><b>" + "</b>"
}
};
