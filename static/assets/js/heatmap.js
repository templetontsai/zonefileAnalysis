function worldMap() {
    /*
    var width = 900,
        height = 500;

    var projection = d3.geo.mercator()
        .center([0, 5])
        .scale(200)
        .rotate([-180, 0]);

    var svg = d3.select("#map").append("svg")
        .attr("width", width)
        .attr("height", height);

    var path = d3.geo.path()
        .projection(projection);

    var g = svg.append("g");



    // load and display the World
    d3.json("worldmap", function(error, topology) {

        // load and display the cities
        d3.json("./data/cities.csv", function(error, data) {
             g.selectAll("circle")
                 .data(data)
                 .enter()
                 .append("a")
                 .attr("xlink:href", function(d) {
                     return "https://www.google.com/search?q=" + d.city;
                 })
                 .append("circle")
                 .attr("cx", function(d) {
                     return projection([d.lon, d.lat])[0];
                 })
                 .attr("cy", function(d) {
                     return projection([d.lon, d.lat])[1];
                 })
                 .attr("r", 5)
                 .style("fill", "red");
         });


        g.selectAll("path")
            .data(topojson.feature(topology, topology.objects.countries)
                .features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "white")
            .attr("stroke-width", "0.25")
            .attr("fill", "grey");
    });

    // zoom and pan
    var zoom = d3.behavior.zoom()
        .on("zoom", function() {
            g.attr("transform", "translate(" +
                d3.event.translate.join(",") + ")scale(" + d3.event.scale + ")");
            g.selectAll("circle")
                .attr("d", path.projection(projection));
            g.selectAll("path")
                .attr("d", path.projection(projection));

        });

    svg.call(zoom)
    */
}
