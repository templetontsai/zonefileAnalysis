function d3jsGrapth(numNodes) {
    //whoisLookup("88.208.252.9")
    var chartDiv = d3.select("#chart");
    chartDiv.selectAll("*").remove();
    var w = 1000,
        h = 1000;
    fill = d3.scale.category20();

    var vis = d3.select("#graphChart")
        .append("svg:svg")
        .attr("width", w)
        .attr("height", h);

    fileName = "/subgraph/";
    jsonSrc = fileName.concat(document.getElementById(numNodes).value);

    d3.json(jsonSrc, function(json) {
        var force = d3.layout.force()
            .charge(-1000)
            .linkDistance(50)
            .nodes(json.nodes)
            .links(json.links)
            .size([w, h])
            .on("tick", tick)
            .start();

        var drag = force.drag()
            .on("dragstart", dragstart);

        var link = vis.selectAll("line.link")
            .data(json.links)
            .enter().append("svg:line")
            .attr("class", "link")
            .style("stroke-width", function(d) {
                return Math.sqrt(d.value);
            })
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });


        var node = vis.selectAll(".node")
            .data(json.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("dblclick", dblclick)

        .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .call(drag);

        node.append("circle")
            .attr("r", 8)
            .style("fill", function(d) {
                if (d.color == "red")
                    return "red";
                else if (d.color == "blue")
                    return "blue";
            });

        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function(d) {
                return d.name;
            });





        force.on("tick", function() {
            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            /*node.attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });*/
            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        });

        function mouseover() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 16);

        }

        function mouseout() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 8);

            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .attr("dy", ".35em")

        }

        function tick() {
            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node.attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
        }

        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }
    });




}


function dnsLookup(domainName, domID) {

    var dnsLookupUrl = "http://localhost:5000/dig/" + domainName;

    $.ajax({
        type: "GET",
        url: dnsLookupUrl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(ip, status, jqXHR) {
            console.log(ip);
            $('#' + domID).text(function(i, oldText) {
                console.log(domID);
                return oldText + ", " + ip;
            });
            
        },

        error: function(jqXHR, status) {
            // error handler
        }
    });
}

function d3jsGrapthbyLabel(label) {



    var chartDiv = d3.select("#graphChart");
    chartDiv.selectAll("*").remove();
    var w = window.innerWidth + 30;
    h = window.innerHeight + 30;
    var viewBox = "0 0 ".concat(w).concat(" ").concat(h)
    var vis = d3.select("#graphChart")
        .append("svg:svg")
        //.attr("display", "inline-block")
        .attr("width", w)
        .attr("height", h)
        .attr("viewBox", viewBox)
        .attr("preserveAspectRatio", "xMidYMid meet");
    //.call(d3.behavior.zoom().on("zoom", rescale));

    var fileName = "/POIGraph/";
    var jsonSrc = fileName.concat(document.getElementById(label).value);

    d3.json(jsonSrc, function(json) {
        var force = d3.layout.force()
            .charge(-1000)
            .linkDistance(100)
            .size([w, h]);




        var link = vis.selectAll("link")
            .data(json.links)
            .enter().append("svg:line")
            .attr("class", "link")
            .attr("stroke-width", 1);



        var drag = d3.behavior.drag()
            .on("dragstart", dragstart)
            .on("drag", dragmove)
            .on("dragend", dragend);

        var node = vis.selectAll("node")
            .data(json.nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("dblclick", dblclick)
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .call(drag);

        var radius = 8;
        node.append("circle")
            .attr("r", radius - .75)
            .style("fill", function(d) {
                if (d.color == "red")
                    return "red";
                else if (d.color == "blue")
                    return "blue";
            });


        node.append("text")
            .attr("id", function(d, id) {
                return "text" + id;
            })
            .attr("dx", 12)
            .attr("dy", ".35em")
            .style("fill", function(d) {
                if (d.name == document.getElementById(label).value)
                    return "red";
                else
                    return "black";
            })
            .text(function(d, id) {
                if (d.color == "red") {
                    
                    dnsLookup(d.name + ".com", "text" + id);
                }

                return d.name;

            });


        force.nodes(json.nodes)
            .links(json.links)
            .on("tick", tick)
            .start();


        vis.style("opacity", 1e-6)
            .transition()
            .duration(1000)
            .style("opacity", 1);


        var linkedByIndex = {};
        json.links.forEach(function(d) {
            linkedByIndex[d.source.index + "," + d.target.index] = true;
        });

        function isConnected(a, b) {
            return isConnectedAsTarget(a, b) || isConnectedAsSource(a, b) || a.index == b.index;
        }

        function isConnectedAsSource(a, b) {
            return linkedByIndex[a.index + "," + b.index];
        }

        function isConnectedAsTarget(a, b) {
            return linkedByIndex[b.index + "," + a.index];
        }

        function mouseover(d) {
            d3.select(this).select("circle").transition()
                .duration(300)
                .attr("r", radius * 2);

            node
                .transition(500)
                .style("opacity", function(o) {
                    return isConnected(o, d) ? 1.0 : 0.2;
                });

            link.style('stroke-width', function(l) {
                if (d === l.source || d === l.target)
                    return 4;
                else
                    return 1;
            }).style('stroke', function(l) {
                if (d === l.source || d === l.target)
                    return "red";
                else
                    return "#999";
            });




        }

        function mouseout() {
            d3.select(this).select("circle").transition()
                .duration(300)
                .attr("r", radius);

            node
                .transition(500)
                .style("opacity", 0.2);

            link.style("stroke-width", 1)
                .style("stroke", "#999");


            /* d3.select(this).select("text").transition()
               .duration(750)
               .attr("x", 12)
               .attr("dy", ".35em")
               .text(function(d) { return d.name; });*/
        }

        function tick() {


            node.attr("transform", function(d) {

                d.x = Math.max(radius, Math.min(w - radius, d.x));
                d.y = Math.max(radius, Math.min(h - radius, d.y));
                return "translate(" + d.x + "," + d.y + ")"
            });

            link.attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });




        }

        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
            d3.event.sourceEvent.stopPropagation();
            force.stop();
        }

        function dragmove(d, i) {
            d.px += d3.event.dx;
            d.py += d3.event.dy;
            d.x += d3.event.dx;
            d.y += d3.event.dy;
            tick(); // this is the key to make it work together with updating both px,py,x,y on d !
        }

        function dragend(d, i) {
            d3.select(this).classed("fixed", d.fixed = true)
                //.select(".nodecircle").style("stroke", "#999");
            tick();
            force.resume();
        }

        resize();
        d3.select(window).on("resize", resize);

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            vis.attr("width", width).attr("height", height);
            //socle.attr('width', width).attr('height', height)

            force.size([width, height]).resume();
        }


    });
    //rescale g
    function rescale() {
        vis.attr("transform",
            "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }

    getPOIStats(label);
    getPOIbigrams(label);
}

function updateBigramsScore(data) {
    var chartDiv = d3.select("#bigramsScore");
    data = [{
        "name": "BigramScore",
        "value": data
    }];
    chartDiv.selectAll("*").remove();

    d3.select("#bigramsScore")
        .data(data)
        .append("p")
        .text(function(d) {
            return d.name + ": " + d.value;
        });

}

function tabulate(data, columns) {
    var table = d3.select("#statsBarChart").append("table")
    var thead = table.append("thead")
    var tbody = table.append("tbody");

    // append the header row
    thead.append("tr")
        .selectAll("th")
        .data(columns).enter()
        .append("th")
        .text(function(column) {
            return column;
        });

    // create a row for each object in the data
    var rows = tbody.selectAll("tr")
        .data(data)
        .enter()
        .append("tr");

    // create a cell in each row for each column
    var cells = rows.selectAll("td")
        .data(function(row) {
            return columns.map(function(column) {
                return { column: column, value: row[column] };
            });
        })
        .enter()
        .append("td")
        .text(function(d) {
            return d.value;
        });


}

function statsTable(statsData) {

    var chartDiv = d3.select("#statsBarChart");
    chartDiv.selectAll("*").remove();

    var data = [{
            "name": "NumNodes",
            "value": statsData.numNodes
        }, {
            "name": "NumEdges",
            "value": statsData.numEdges
        }, {
            "name": "Radius",
            "value": statsData.radius,
        }, {
            "name": "Diameter",
            "value": statsData.diameter
        }, {
            "name": "Density",
            "value": statsData.density
        }

    ];

    d3.select("#statsBarChart")
        .selectAll("p")
        .data(data)
        .enter()
        .append("p")
        .text(function(d) {
            return d.name + ": " + d.value;
        });
}

function statsBarChart(statsData) {



    var chartDiv = d3.select("#statsBarChart");
    chartDiv.selectAll("*").remove();



    var data = [statsData.numNodes, statsData.numEdges, statsData.radius, statsData.diameter, statsData.density];
    d3.select("#statsBarChart")
        .selectAll("div")
        .data(data)
        .enter().append("svg")
        .style("width", function(d) {
            return d * 10 + "px";
        })
        .text(function(d) {
            return d;
        });


}

function getPOIStats(label) {
    $('.numNodes').empty();
    var numNodesUrl = "http://localhost:5000/POIStats/".concat(document.getElementById(label).value);

    $.ajax({
        type: "GET",
        url: numNodesUrl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(statsData, status, jqXHR) {
            statsTable(statsData);
        },

        error: function(jqXHR, status) {
            // error handler
        }
    });
}

function getPOIbigrams(label) {

    var bigramsUrl = "http://localhost:5000/POIbigrams/".concat(document.getElementById(label).value);
    var bigramScore;
    $.ajax({
        type: "GET",
        url: bigramsUrl,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(data, status, jqXHR) {
            updateBigramsScore(data);
        },

        error: function(jqXHR, status) {
            // error handler
        }
    });


}
