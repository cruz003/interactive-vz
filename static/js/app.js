
function makePlot(subjID) {
    d3.json("./data/samples.json").then(function (data) {
        // console.log(data);

        // Convert Object into separate data arrays
        const { names } = data;
        const { samples } = data;
        const { metadata } = data;
        // console.log(names);
        // console.log(samples);
        // console.log(metadata);

        var selValue = subjID.toString();
        // console.log(selValue);

        // Filter data based on dropdown selection
        var filteredData = samples.filter(sample => sample.id === selValue);
        // console.log(samples);
        // console.log(filteredData);

        var sample_values = filteredData[0].sample_values;
        var otu_ids = filteredData[0].otu_ids;
        var otu_labels = filteredData[0].otu_labels;
        var f_sample_values = filteredData[0].sample_values.slice(0, 10).reverse();
        var f_otu_ids = filteredData[0].otu_ids.slice(0, 10).map(d => "OTU" + d).reverse();
        var f_otu_labels = filteredData[0].otu_labels.slice(0, 10).reverse();


        // Create Bar Chart
        var barTrace = {
            x: f_sample_values,
            y: f_otu_ids,
            text: f_otu_ids,
            marker: {
                color: 'blue'
            },
            type: "bar",
            orientation: "h",
        };

        var barTrace1 = [barTrace];

        Plotly.newPlot("bar", barTrace1);

        // Create Bubble Chart
        var bubbleTrace = {
            x: otu_ids,
            y: sample_values,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids
            },
            text: otu_labels

        };

        var bubbleTrace1 = [bubbleTrace];

        Plotly.newPlot("bubble", bubbleTrace1);
    });
}

function optionChanged(subjID) {
    d3.json("./data/samples.json").then(function (meta) {
        const { names } = meta;
        const { metadata } = meta;
        // console.log(subjID);
        // console.log(metadata);

        // filter for demographic data
        var filteredMetaData = metadata.filter(meta => meta.id == subjID);
        // console.log(filteredMetaData);

        // Select demographic panel from HTML to put data
        var demographicData = d3.select("#sample-metadata");

        // delete contents of demographic panel before each load
        demographicData.html("");

        // Capture each key, value pair in Object and write to html
        Object.entries(filteredMetaData[0]).forEach(([key, value]) => {
            //Capitalize first letter of each key value
            var withLower = key;
            var withUpper = withLower.charAt(0).toUpperCase() + withLower.substring(1);
            // console.log(key);
            // console.log(value);
            
            //Append key, value pair to Demgraphic info in HTML
            demographicData.append("h5").text(withUpper + ": " + value + "\n");
        });

        //Call function to build charts passing selected value
        makePlot(subjID);

    });
}


//Populate dropdown on page load
d3.json("./data/samples.json").then(function (data) {
    const { names } = data;
    for (i = 0; i < names.length; i++) {
        d3.select("#selDataset")
            .append("option")
            .text(names[i])
            .property("value", names[i]);
    }
});

optionChanged(940);
