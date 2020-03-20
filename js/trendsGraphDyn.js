var locale = {
  "dateTime": "%A %e %B %Y",
  "date": "%d/%m/%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
  "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
  "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  "shortMonths": ["jan.", "fév.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
}
d3.timeFormatDefaultLocale(locale);

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

var svg_tr = d3
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
var xAxis = d3.axisBottom().scale(x).tickFormat(d3.timeFormat("%d %b"));

var yr = d3.scaleLinear().range([height, 0]);
var yl = d3.scaleLinear().range([height, 0]);

var yAxisRight = d3.axisLeft().scale(yr);
var yAxisLeft  = d3.axisLeft().scale(yl);

svg_tr.append("g")
  .attr("transform", "translate(0," + height + ")")
  .attr("class","XAxis")

if (get_width>480) {
  svg_tr.append("g")
      .attr('transform', 'translate(' + (margin.left) + ',0)')
      .attr("class","YAxisLeft")
      .call(d3.axisLeft(yl));
  svg_tr.append("g")
      .attr("transform", "translate( " + (width-margin.right) + ", 0 )")
      .attr("class","YAxisRight")
      .call(d3.axisRight(yr));
  var tick_size = 0;
} else {
  svg_tr.append("g")
      .attr('transform', 'translate(' + (margin.left+20) + ',0)')
      .attr("class","YAxisLeft")
      .call(d3.axisLeft(yl));
  svg_tr.append("g")
      .attr("transform", "translate( " + (width-margin.right-15) + ", 0 )")
      .attr("class","YAxisRight")
      .call(d3.axisRight(yr) );
  var tick_size = 0;
}

// Handmade legend
var legend_pos_y = 223;
svg_tr.append("line").attr("x1",20).attr("y1",legend_pos_y).attr("x2",30).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "5px")
svg_tr.append("line").attr("x1",100).attr("x2",110).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#e74c3c").style("stroke-width", "5px")
svg_tr.append("text").attr("x", 40).attr("y", legend_pos_y).text("Tweets").style("font-size", "13px").attr("alignment-baseline","middle")
svg_tr.append("text").attr("x", 120).attr("y", legend_pos_y).text("Google Trends").style("font-size", "13px").attr("alignment-baseline","middle")

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
  var u = svg_tr.selectAll(".lineTweet")
    .data([data_trend], function(d){ return d.date });
  var ut = svg_tr.selectAll(".lineTrends")
    .data([data_trend], function(d){ return d.date });
  var ub = svg_tr.selectAll(".lineTweetBehind")
    .data([data_trend], function(d){ return d.date });
  var utb = svg_tr.selectAll(".lineTrendsBehind")
    .data([data_trend], function(d){ return d.date });

   // Create the X axis:
  x.domain(d3.extent(data_trend, function(d) { return d.date; }));
  svg_tr.selectAll(".XAxis").transition()
    .duration(transTime)
    .call(xAxis);

  // create the Y axis
  yr.domain([0, d3.max(data_trend, function(d) { return get_tweet(country,d)  }) ]);
  svg_tr.selectAll(".YAxisRight")
    .transition()
    .duration(transTime)
    .call(yAxisRight.tickSize(tick_size).tickArguments([5,".0s"]));
  yl.domain([0, d3.max(data_trend, function(d) { return get_trend(country,d) }) ]);
  svg_tr.selectAll(".YAxisLeft")
    .transition()
    .duration(transTime)
    .call(yAxisLeft.tickSize(tick_size));

  // Updata the line
  ub.enter()
   .append("path")
   .attr("class","lineTweetBehind")
   .merge(ub)
   .transition()
   .duration(transTime)
   .attr("d", d3.line()
     .x(function(d) { return x(d.date); })
     .y(function(d) { return yr(get_tweet(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "steelblue")
     .attr("stroke-width", 2.5)
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

  utb.enter()
   .append("path")
   .attr("class","lineTrendsBehind")
   .merge(utb)
   .transition()
   .duration(transTime)
   .attr("d", d3.line()
     .x(function(d) { return x(d.date); })
     .y(function(d) { return yl(get_trend(country,d))}))
     .attr("fill", "none")
     .attr("stroke", "white")
     .attr("stroke-width", 4)
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

  $( ".annotations" ).remove();
  if(country=="CH") {
    const annotations = [
      {
        note: {
          label: "1er cas, Suisse",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,1,25)),
        y: 200,
        dy: -140,
        dx: -1
      },
      {
        note: {
          label: "Wuhan confinée",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,0,23)),
        y: 200,
        dy: -110,
        dx: 0
      },
      {
        note: {
          label: "1er cas, Italie",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,0,31)),
        y: 200,
        dy: -60,
        dx: 0
      },

    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#trendsChartSVG")
      .append("g")
      .call(makeAnnotations)
  } else if (country=="IT") {
      var annotations = [
      {
        note: {
          label: "1er cas",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,0,31)),
        y: 200,
        dy: -90,
        dx: -1
      },
      {
        note: {
          label: "16 cas, Lombardie",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,1,21)),
        y: 200,
        dy: -110,
        dx: -1
      }
    ]
    if (get_width>480) {
        annotations.push({
        note: {
          label: "Piazzapulita",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,2,5)),
        y: 200,
        dy: -140,
        dx: -1
      });
    }

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#trendsChartSVG")
      .append("g")
      .call(makeAnnotations)
  } else if (country=="DE") {
      const annotations = [
      {
        note: {
          label: "1er cas, Allemagne",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,0,27)),
        y: 200,
        dy: -140,
        dx: 0
      }
    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#trendsChartSVG")
      .append("g")
      .call(makeAnnotations)
  } else if (country=="FR") {
       const annotations = [
      {
        note: {
          label: "1er cas, France",
        },
        color: ["#e83e8c"],
        x: x(new Date(2020,0,24)),
        y: 200,
        dy: -140,
        dx: 0
      }
    ]

    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#trendsChartSVG")
      .append("g")
      .call(makeAnnotations)
  }
}
