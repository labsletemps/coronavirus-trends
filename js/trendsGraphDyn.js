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

var svg = d3
  .select("#trendsChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("id", "trendsChartSVG")
.append('g')
  .attr("transform", "translate(" + 0 + "," + margin.top + ")");

// set the ranges
var x = d3.scaleTime()
          .range([margin.left, width-margin.right]);
var xAxis = d3.axisBottom().scale(x);

var yr = d3.scaleLinear().range([height, 0]);
var yl = d3.scaleLinear().range([height, 0]);

var yAxisRight = d3.axisLeft().scale(yr);
var yAxisLeft  = d3.axisLeft().scale(yl);

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class","XAxis")

if (get_width>480) {
  svg.append("g")
      .attr('transform', 'translate(' + (margin.left) + ',0)')
      .attr("class","YAxisLeft")
      .call(d3.axisLeft(yl));
  svg.append("g")
      .attr("transform", "translate( " + (width-margin.right) + ", 0 )")
      .attr("class","YAxisRight")
      .call(d3.axisRight(yr));
} else {
  svg.append("g")
      .attr('transform', 'translate(' + (margin.left+20) + ',0)')
      .attr("class","YAxisLeft")
      .call(d3.axisLeft(yl));
  svg.append("g")
      .attr("transform", "translate( " + (width-margin.right-35) + ", 0 )")
      .attr("class","YAxisRight")
      .call(d3.axisRight(yr));
}

// Handmade legend
var legend_pos_y = 223;
svg.append("line").attr("x1",20).attr("y1",legend_pos_y).attr("x2",30).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "5px")
svg.append("line").attr("x1",100).attr("x2",110).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#e74c3c").style("stroke-width", "5px")
svg.append("text").attr("x", 40).attr("y", legend_pos_y).text("Tweets").style("font-size", "13px").attr("alignment-baseline","middle")
svg.append("text").attr("x", 120).attr("y", legend_pos_y).text("Google Trends").style("font-size", "13px").attr("alignment-baseline","middle")

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
  update_trend_graph("CH");
})

function get_trend(country,d) {
     if      (country=="CH") return d.GTrend_CH; 
     else if (country=="IT") return d.GTrend_IT; 
     else if (country=="DE") return d.GTrend_DE; 
     else if (country=="FR") return d.GTrend_FR;
}
function get_tweet(country,d) {
     if      (country=="CH") return d.Tweets_CH; 
     else if (country=="IT") return d.Tweets_IT; 
     else if (country=="DE") return d.Tweets_DE; 
     else if (country=="FR") return d.Tweets_FR;
}

function update_trend_graph(country) {
  var u = svg.selectAll(".lineTweet")
    .data([data_trend], function(d){ return d.date });
  var ut = svg.selectAll(".lineTrends")
    .data([data_trend], function(d){ return d.date });

   // Create the X axis:
  x.domain(d3.extent(data_trend, function(d) { return d.date; }));
  svg.selectAll(".XAxis").transition()
    .duration(transTime)
    .call(xAxis);

  // create the Y axis
  yr.domain([0, d3.max(data_trend, function(d) { return get_tweet(country,d)  }) ]);
  svg.selectAll(".YAxisRight")
    .transition()
    .duration(transTime)
    .call(yAxisRight);
  yl.domain([0, d3.max(data_trend, function(d) { return get_trend(country,d) }) ]);
  svg.selectAll(".YAxisLeft")
    .transition()
    .duration(transTime)
    .call(yAxisLeft);

  // Updata the line
  u.enter()
   .append("path")
   .attr("class","lineTweet")
   .merge(u)
   .transition()
   .duration(transTime)
   .attr("d", d3.line()
     .x(function(d) { return x(d.date); })
     .y(function(d) { return yr(get_tweet(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2.5)

  ut.enter()
   .append("path")
   .attr("class","lineTrends")
   .merge(ut)
   .transition()
   .duration(transTime)
   .attr("d", d3.line()
     .x(function(d) { return x(d.date); })
     .y(function(d) { return yl(get_trend(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "red")
     .attr("stroke-width", 2.5)

}
