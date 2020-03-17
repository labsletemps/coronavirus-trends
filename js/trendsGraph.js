$( document ).ready(function() {
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
  var margin = { top: 40, bottom: 10, left: 124, right: 20 };

  var width = parseInt(d3.select("#chartTop").style("width")) - margin.left - margin.right;

  // var width = 800 - margin.left - margin.right;
  var height = 300 - margin.top - margin.bottom;
 
  // parse the date / time
  var parseTime = d3.timeParse("%Y-%m-%d");
  
  // set the ranges
  var x = d3.scaleTime()
    .range([0, width]);

  var y = d3.scaleLinear().range([height, 0]);
  
  var line_Deces_CH = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.Deces_CH); });

  var line_Tweets_CH = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.Tweets_CH); });

  var line_Tweets_DE = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.Tweets_DE); });

  var line_Tweets_FR = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.Tweets_FR); });

  var line_Tweets_IT = d3.line()
      .x(function(d) { return x(d.date); })
      .y(function(d) { return y(d.Tweets_IT); });
 
  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select("#chartTop")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "chartTopSVG");

  // Get the data
  d3.csv("data/GTrendsVsTweetsVsCorona.csv").then(function(data) {
  
    // format the data
    data.forEach(function(d) {
        d.date = parseTime(d.date);
        d.Deces_CH  = +d.Deces_CH;
        d.Tweets_CH = +d.Tweets_CH; 
        d.Tweets_DE = +d.Tweets_DE; 
        d.Tweets_FR = +d.Tweets_FR;
        d.Tweets_IT = +d.Tweets_IT;
    });
  
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.date; }));

    x.domain([new Date(2020,1,5),d3.max(data, function(d) {
  	  return Math.max(d.date); })])

    y.domain([0, d3.max(data, function(d) {
  	  return Math.max(d.Tweets_CH,d.Tweets_DE,d.Tweets_FR,d.Tweets_IT); })]);
  
    // Add the valueline path.
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#3498db") 
        .attr("d", line_Deces_CH);

    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px")
        .attr("d", line_Tweets_CH);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#3498db") 
        .attr("d", line_Tweets_CH);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px")
        .attr("d", line_Tweets_DE);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#e74c3c") 
        .attr("d", line_Tweets_DE);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px")
        .attr("d", line_Tweets_FR);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#2ecc71") 
        .attr("d", line_Tweets_FR);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#fff") 
        .style("stroke-width", "5px") 
        .attr("d", line_Tweets_IT);
    svg.append("path")
        .data([data])
        .attr("class", "line")
        .style("stroke", "#ff9214") 
        .attr("d", line_Tweets_IT);
 
    // Add the X Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
  
    // Add the Y Axis
    //svg.append("g")
    //    .call(d3.axisLeft(y));
 
    const annotations = [
      {
        note: {
          label: "Here is the annotation label",
        },
        color: ["#e83e8c"],
        x: 40,
        y: 230,
        dy: -70,
        dx: 0
      }
    ]
    
    // Add annotation to the chart
    const makeAnnotations = d3.annotation()
      .annotations(annotations)
    d3.select("#chartTopSVG")
      .append("g")
      .call(makeAnnotations)

  });
  
});

