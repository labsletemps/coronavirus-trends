function trend_graph(country="CH") {
  // localisation
  var locale = {
    "dateTime": "%A %e %B %Y",
    "date": "%d/%m/%Y",
    "time": "%H:%M:%S",
    "periods": ["AM", "PM"],
    "days": ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
    "shortDays": ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
    "months": ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
    "shortMonths": ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."]
  }
  //d3.timeFormatDefaultLocale(locale);

  // set the dimensions and margins of the graph
  var get_width = parseInt(d3.select("#chartTop").style("width"));
  if (get_width>450) {
      var margin = { top: 40, bottom: 10, left: 20, right: 20};
  } else {
      var margin = { top: 40, bottom: 10, left: 0, right: 0};
  }

  var width = get_width - margin.left - margin.right;

  //var width = 800 - margin.left - margin.right;
  var height = 240 - margin.top - margin.bottom;
 
  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");
  
  // set the ranges
  var x = d3.scaleTime()
    .range([margin.left, width-margin.right]);

  var yr = d3.scaleLinear().range([height, 0]);
  var yl = d3.scaleLinear().range([height, 0]);

  if (country=="CH") {
      //var line_Infections = d3.line()
      //    .x(function(d) { return x(d.date); })
      //    .y(function(d) { return yl(d.Infections_CH); });

      var line_Tweets = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Tweets_CH,); });

      var line_Medias = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Medias_CH); });

      var line_GTrend = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yl(d.GTrend_CH); });
  } else if (country=="DE") {
      //var line_Infections = d3.line()
      //    .x(function(d) { return x(d.date); })
      //    .y(function(d) { return yl(d.Infections_DE); });

      var line_Tweets = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Tweets_DE,); });

      var line_Medias = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Medias_DE); });

      var line_GTrend = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yl(d.GTrend_DE); });
  } else if (country=="FR") {
      //var line_Infections = d3.line()
      //    .x(function(d) { return x(d.date); })
      //    .y(function(d) { return yl(d.Infections_FR); });

      var line_Tweets = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Tweets_FR,); });

      var line_Medias = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Medias_FR); });

      var line_GTrend = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yl(d.GTrend_FR); });
  } else if (country=="IT"){
      //var line_Infections = d3.line()
      //    .x(function(d) { return x(d.date); })
      //    .y(function(d) { return yl(d.Infections_IT); });

      var line_Tweets = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Tweets_IT,); });

      var line_Medias = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yr(d.Medias_IT); });

      var line_GTrend = d3.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return yl(d.GTrend_IT); });
  } else {
  } 

  var svg = d3
    .select("#chartTop")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "chartTopSVG");

  // Get the data
  d3.csv("data/MediasVsGTrendsVsTweetsVsCorona_filt.csv").then(function(data) {
  
    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);

        if (country=="CH") {
            d.Infections  = +d.Infections_CH;
            d.Tweets = +d.Tweets_CH; 
            d.Medias = +d.Medias_CH; 
            d.GTrend = +d.GTrend_CH;
        } else if (country=="DE") {
            d.Infections  = +d.Infections_DE;
            d.Tweets = +d.Tweets_DE; 
            d.Medias = +d.Medias_DE; 
            d.GTrend = +d.GTrend_DE;
        } else if (country=="FR") {
            d.Infections  = +d.Infections_FR;
            d.Tweets = +d.Tweets_FR; 
            d.Medias = +d.Medias_FR; 
            d.GTrend = +d.GTrend_FR;
        } else if (country=="IT"){
            d.Infections  = +d.Infections_IT;
            d.Tweets = +d.Tweets_IT; 
            d.Medias = +d.Medias_IT; 
            d.GTrend = +d.GTrend_IT;
        }
    });
  
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));
    //x.domain([,d3.max(data, function(d) {
  	//  return d.date; })])

    yl.domain([0, d3.max(data, function(d) { 
  	  return d.GTrend; })]);
    yr.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.Tweets,d.Medias); })]);

    // Add the valueline path.
    //svg.append("path")
    //    .data([data])
    //    .attr("class", "line")
    //    .style("stroke", "#3498db")
    //    .style("stroke-dasharray", ("3, 3"))
    //    .style("stroke-width", "2px")
    //    .attr("d", line_Infections);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px")
        .attr("d", line_Tweets);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#3498db") 
        .attr("d", line_Tweets);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px")
        .attr("d", line_GTrend);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#e74c3c") 
        .attr("d", line_GTrend);
    //svg.append("path")
    //    .data([data])
    //    .attr("class", "line")
    //    .style("stroke", "#fff") 
    //    .style("stroke-width", "5px")
    //    .attr("d", line_Medias);
    //svg.append("path")
    //    .data([data])
    //    .attr("class", "line")
    //    .style("stroke", "#2ecc71") 
    //    .attr("d", line_Medias);
 
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
    // Add the Y Axis
    svg.append("g")
        .attr('transform', 'translate(' + (margin.left) + ',0)')
        .call(d3.axisLeft(yl));
    svg.append("g")
        .attr("transform", "translate( " + (width-margin.right) + ", 0 )")
        .call(d3.axisRight(yr));

    if (country=="CH") {
        var date_first_case = x(new Date(2020,1,25));
        var label_first_case = "1er cas";
        var dx_dir = -1;
    } else if (country=="DE") {
        var date_first_case = x(new Date(2020,0,27));
        var label_first_case = "1er cas";
        var dx_dir = 0;
    } else if (country=="FR") {
        var date_first_case = x(new Date(2020,0,24));
        var label_first_case = "1er cas";
        var dx_dir = 0;
    } else if (country=="IT"){
        var date_first_case  = x(new Date(2020,0,31));
        var label_first_case = "1er cas";
        var dx_dir = -1;
    }

    const annotations = [
      {
        note: {
          label: label_first_case,
        },
        color: ["#e83e8c"],
        x: date_first_case,
        y: height,
        dy: -140,
        dx: dx_dir
      }
    ]
    
    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#chartTopSVG")
      .append("g")
      .call(makeAnnotations)

    // Handmade legend
    var legend_pos_y = 220; 
    svg.append("line").attr("x1",20).attr("y1",legend_pos_y).attr("x2",30).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "5px")
    svg.append("line").attr("x1",100).attr("x2",110).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#e74c3c").style("stroke-width", "5px")
    //svg.append("line").attr("x1",230).attr("x2",240).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#2ecc71").style("stroke-width", "5px")
    //svg.append("line").attr("x1",310).attr("x2",320).attr("y1",legend_pos_y).attr("y2",legend_pos_y).style("stroke", "#3498db").style("stroke-width", "2px").style("stroke-dasharray", ("3, 3"))
    svg.append("text").attr("x", 40).attr("y", legend_pos_y).text("Tweets").style("font-size", "13px").attr("alignment-baseline","middle")
    svg.append("text").attr("x", 120).attr("y", legend_pos_y).text("Google Trends").style("font-size", "13px").attr("alignment-baseline","middle")
    //svg.append("text").attr("x", 250).attr("y", legend_pos_y).text("Medias").style("font-size", "13px").attr("alignment-baseline","middle")
    //svg.append("text").attr("x",330).attr("y", legend_pos_y).text("Infections").style("font-size", "13px").attr("alignment-baseline","middle")

  });
  
}

