var transTime = 1000;

// set the dimensions and margins of the graph
var get_width = parseInt(d3.select("#trendsChart").style("width"));
if (get_width>450) {
    var margin = { top: 5, bottom: 40, left: 20, right: 20};
} else {
    var margin = { top: 5, bottom: 40, left: 0, right: 0};
}

var width = get_width - margin.left - margin.right;

//var width = 800 - margin.left - margin.right;
var height = 240 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y-%m-%d");

var svg_media = d3
  .select("#chartMedia")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("id", "trendsChartSVG")
.append('g')
  .attr("transform", "translate(" + 0 + "," + margin.top + ")");

// set the ranges
var x_media = d3.scaleTime()
                .range([margin.left, width-margin.right]);
var xAxis_media = d3.axisBottom().scale(x_media);

var yl_media = d3.scaleLinear().range([height, 0]);
//var yl_media = d3.scaleLinear().range([height, 0]);
var yr_media = d3.scaleLog().clamp(true).range([height, 0]).nice();

var yAxisRight_media = d3.axisLeft().scale(yr_media);
var yAxisLeft_media  = d3.axisLeft().scale(yl_media);

svg_media.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class","XAxis_media")

if (get_width>480) {
  svg_media.append("g")
      .attr('transform', 'translate(' + (margin.left) + ',0)')
      .attr("class","YAxis_Left_media")
      .call(d3.axisLeft(yl_media).tickValues([1,10,100,1000]).tickArguments([5,".0s"]));
  svg_media.append("g")
      .attr("transform", "translate( " + (width-margin.right) + ", 0 )")
      .attr("class","YAxis_Right_media")
      .call(d3.axisRight(yr_media).tickArguments([5,".0s"]));
  var tick_size = 0;
 } else {
  svg_media.append("g")
      .attr('transform', 'translate(' + (margin.left+20) + ',0)')
      .attr("class","YAxis_Left_media")
      .call(d3.axisLeft(yl_media).tickValues([1,10,100,1000]).tickArguments([5,".0s"]));
  svg_media.append("g")
      .attr("transform", "translate( " + (width-margin.right-15) + ", 0 )")
      .attr("class","YAxis_Right_media")
      .call(d3.axisRight(yr_media).tickArguments([5,".0s"]));
  var tick_size = 0;
}

// Handmade legend
var legend_pos_y = 223;
svg_media.append("line").attr("x1",20).attr("y1",legend_pos_y).attr("x2",30).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "5px")
svg_media.append("line").attr("x1",165).attr("x2",175).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "2px").style("stroke-dasharray", ("3, 3"))
svg_media.append("text").attr("x", 40).attr("y", legend_pos_y).text("Articles de presse").style("font-size", "13px").attr("alignment-baseline","middle")
svg_media.append("text").attr("x",180).attr("y", legend_pos_y).text("Infections").style("font-size", "13px").attr("alignment-baseline","middle")


var data_trend;
d3.csv("data/MediasVsGTrendsVsTweetsVsCorona_filt.csv").then(function(_data) {
  data_trend = _data.map(function(d) {
        d.date = parseTime(d.date);

        d.Infections_CH  = +d.Infections_CH;
        d.Tweets_CH      = +d.Tweets_CH;
        d.Medias_CH      = +d.Medias_CH;
        d.GTrend_CH      = +d.GTrend_CH;
        d.Infections_DE  = +d.Infections_DE;
        d.Tweets_DE      = +d.Tweets_DE;
        d.Medias_DE      = +d.Medias_DE;
        d.GTrend_DE      = +d.GTrend_DE;
        d.Infections_FR  = +d.Infections_FR;
        d.Tweets_FR      = +d.Tweets_FR;
        d.Medias_FR      = +d.Medias_FR;
        d.GTrend_FR      = +d.GTrend_FR;
        d.Infections_IT  = +d.Infections_IT;
        d.Tweets_IT      = +d.Tweets_IT;
        d.Medias_IT      = +d.Medias_IT;
        d.GTrend_IT      = +d.GTrend_IT;
        return d 
  }) ;
  update_media_graph("CH");
})

function get_infections(country,d) {
     if      (country=="CH") return d.Infections_CH; 
     else if (country=="IT") return d.Infections_IT; 
     else if (country=="DE") return d.Infections_DE; 
     else if (country=="FR") return d.Infections_FR;
}
function get_medias(country,d) {
     if      (country=="CH") return d.Medias_CH; 
     else if (country=="IT") return d.Medias_IT; 
     else if (country=="DE") return d.Medias_DE; 
     else if (country=="FR") return d.Medias_FR;
}

function update_media_graph(country) {
  var u = svg_media.selectAll(".lineInfections")
    .data([data_trend], function(d){ return d.date });
  var um = svg_media.selectAll(".lineMedias")
    .data([data_trend], function(d){ return d.date });
  var umb = svg_media.selectAll(".lineMediasBehind")
    .data([data_trend], function(d){ return d.date });

   // Create the X axis:
  x_media.domain(d3.extent(data_trend, function(d) { return d.date; }));
  svg_media.selectAll(".XAxis_media").transition()
    .duration(transTime)
    .call(xAxis_media);

  // create the Y axis
  yr_media.domain([0.1, d3.max(data_trend, function(d) { return get_infections(country,d)  }) ]);
  svg_media.selectAll(".YAxis_Right_media")
    .transition()
    .duration(transTime)
    //.call(yAxisLeft_media); 
    .call(d3.axisRight(yr_media).tickValues([1,10,100,1000]).tickArguments([5,".0s"]).tickSize(tick_size));

  yl_media.domain([0, d3.max(data_trend, function(d) { return get_medias(country,d)  }) ]);
  svg_media.selectAll(".YAxis_Left_media")
    .transition()
    .duration(transTime)
    .call(yAxisLeft_media.tickSize(tick_size).tickFormat(d3.format(".0s")));

  // Updata the line
  u.enter()
   .append("path")
   .attr("class","lineInfections")
   .merge(u)
   .transition()
   .duration(transTime)
   .attr("d", d3.line()
     .x(function(d) { return x_media(d.date); })
     .y(function(d) { return yr_media(get_infections(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2.5)
     .style("stroke-dasharray", ("3, 3"))

  umb.enter()
   .append("path")
   .attr("class","lineMediasBehind")
   .merge(umb)
   .transition()
   .duration(transTime)
   .attr("d", d3.line().curve(d3.curveStepAfter)
     .x(function(d) { return x_media(d.date); })
     .y(function(d) { return yl_media(get_medias(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "white")
     .attr("stroke-width", 4)

  um.enter()
   .append("path")
   .attr("class","lineMedias")
   .merge(um)
   .transition()
   .duration(transTime)
   .attr("d", d3.line().curve(d3.curveStepAfter)
     .x(function(d) { return x_media(d.date); })
     .y(function(d) { return yl_media(get_medias(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "steelblue")
}
