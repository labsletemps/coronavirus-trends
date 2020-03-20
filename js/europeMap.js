/*
 * Bubble Map
 * Author: Francois Quellec
 * Implementation based on official template from https://www.d3-graph-gallery.com/graph/bubblemap_template.html,  Yan Holtz
*/

// The svg
 var svg = d3.select("#map")
   // Container class to make it responsive.
   .classed("svg-container", true)
   .append("svg")
   // Responsive SVG needs these 2 attributes and no width and height attr.
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 1000 500")
   // Class to make it responsive.
   .classed("svg-content-responsive", true)
   // Fill with a rectangle for visualization.
   .append("g")
   .attr("width", 1000)
   .attr("height", 500);

width = svg.attr('width');
height = svg.attr('height');

// Map and projection/Zoom
var projection = d3.geoMercator()
    .center([10,48])
    .scale(1000)
    .translate([ width/2, height/2 ])

Promise.all([d3.json("data/world_countries.json"), d3.csv("data/geo_tweets_by_week.csv"), d3.csv("data/coronavirus_2020-03-18.csv")]).then(function(data) {
  var dataGeo = data[0];
  var dataTweets = data[1];
  var dataCorona = data[2];

  var formatDateIntoDay = d3.timeFormat("%d/%m");
  var parseDate = d3.timeFormat("%Y-%m-%d");

  var currentDate = null;
  var currentCountry = null;

  // Initialize datasets map and filter variables
  var newDataTweets = []
  var tweetsMap = d3.map();

  var newDataCorona = []
  var dataMap = d3.map();

  var countries = {'ABW': 'Aruba',
 'AFG': 'Afghanistan',
 'AGO': 'Angola',
 'ALB': 'Albanie',
 'AND': 'Andorre',
 'ARB': 'Le monde arabe',
 'ARE': 'Émirats arabes unis',
 'ARG': 'Argentine',
 'ARM': 'Arménie',
 'ASM': 'Samoa américaines',
 'ATG': 'Antigua-et-Barbuda',
 'AUS': 'Australie',
 'AUT': 'Autriche',
 'AZE': 'Azerbaïdjan',
 'BDI': 'Burundi',
 'BEL': 'Belgique',
 'BEN': 'Bénin',
 'BFA': 'Burkina Faso',
 'BGD': 'Bangladesh',
 'BGR': 'Bulgarie',
 'BHR': 'Bahreïn',
 'BHS': 'Bahamas',
 'BIH': 'Bosnie-Herzégovine',
 'BLR': 'Bélarus',
 'BLZ': 'Belize',
 'BMU': 'Bermudes',
 'BOL': 'Bolivie',
 'BRA': 'Brésil',
 'BRB': 'Barbade',
 'BRN': 'Brunéi Darussalam',
 'BTN': 'Bhoutan',
 'BWA': 'Botswana',
 'CAF': 'République centrafricaine',
 'CAN': 'Canada',
 'CEB': 'Europe centrale et les pays baltes',
 'CHE': 'Suisse',
 'CHI': 'Îles Anglo-Normandes',
 'CHL': 'Chili',
 'CHN': 'Chine',
 'CIV': "Côte d'Ivoire",
 'CMR': 'Cameroun',
 'COD': 'Congo, République démocratique du',
 'COG': 'Congo, République du',
 'COL': 'Colombie',
 'COM': 'Comores',
 'CPV': 'Cabo Verde',
 'CRI': 'Costa Rica',
 'CSS': 'Petits états des Caraïbes',
 'CUB': 'Cuba',
 'CUW': 'Curacao',
 'CYM': 'Îles Caïmans',
 'CYP': 'Chypre',
 'CZE': 'République tchèque',
 'DEU': 'Allemagne',
 'DJI': 'Djibouti',
 'DMA': 'Dominique',
 'DNK': 'Danemark',
 'DOM': 'République dominicaine',
 'DZA': 'Algérie',
 'EAP': 'Asie de l’Est et Pacifique (hors revenu élevé)',
 'EAR': 'de dividende précoce démographique',
 'EAS': 'Asie de l’Est et Pacifique',
 'ECA': 'Europe et Asie centrale (hors revenu élevé)',
 'ECS': 'Europe et Asie centrale',
 'ECU': 'Équateur',
 'EGY': 'Égypte, République arabe d’',
 'EMU': 'Zone euro',
 'ERI': 'Érythrée',
 'ESP': 'Espagne',
 'EST': 'Estonie',
 'ETH': 'Éthiopie',
 'EUU': 'Union européenne',
 'FCS': 'Fragile et les situations de conflit touchées',
 'FIN': 'Finlande',
 'FJI': 'Fidji',
 'FRA': 'France',
 'FRO': 'Îles Féroé',
 'FSM': 'Micronésie, États fédérés de',
 'GAB': 'Gabon',
 'GBR': 'Royaume-Uni',
 'GEO': 'Géorgie',
 'GHA': 'Ghana',
 'GIB': 'Gibraltar',
 'GIN': 'Guinée',
 'GMB': 'Gambie',
 'GNB': 'Guinée-Bissau',
 'GNQ': 'Guinée équatoriale',
 'GRC': 'Grèce',
 'GRD': 'Grenade',
 'GRL': 'Groenland',
 'GTM': 'Guatemala',
 'GUM': 'Guam',
 'GUY': 'Guyane',
 'HIC': 'Revenu élevé',
 'HKG': 'Chine, RAS de Hong Kong',
 'HND': 'Honduras',
 'HPC': 'Pays pauvres très endettés (PPTE)',
 'HRV': 'Croatie',
 'HTI': 'Haïti',
 'HUN': 'Hongrie',
 'IBD': 'BIRD seulement',
 'IBT': 'BIRD et IDA',
 'IDA': 'IDA totale',
 'IDB': 'IDA mélange',
 'IDN': 'Indonésie',
 'IDX': 'IDA seulement',
 'IMN': 'Île de Man',
 'IND': 'Inde',
 'INX': 'Non classifié',
 'IRL': 'Irlande',
 'IRN': 'Iran, République islamique d’',
 'IRQ': 'Iraq',
 'ISL': 'Islande',
 'ISR': 'Israël',
 'ITA': 'Italie',
 'JAM': 'Jamaïque',
 'JOR': 'Jordanie',
 'JPN': 'Japon',
 'KAZ': 'Kazakhstan',
 'KEN': 'Kenya',
 'KGZ': 'République kirghize',
 'KHM': 'Cambodge',
 'KIR': 'Kiribati',
 'KNA': 'Saint-Kitts-et-Nevis',
 'KOR': 'Corée, République de',
 'KWT': 'Koweït',
 'LAC': 'Amérique latine et Caraïbes (hors revenu élevé)',
 'LAO': 'République démocratique populaire lao',
 'LBN': 'Liban',
 'LBR': 'Libéria',
 'LBY': 'Libye',
 'LCA': 'Sainte-Lucie',
 'LCN': 'Amérique latine et Caraïbes',
 'LDC': 'Pays les moins avancés\xa0: classement de l’ONU',
 'LIC': 'Faible revenu',
 'LIE': 'Liechtenstein',
 'LKA': 'Sri Lanka',
 'LMC': 'Revenu intermédiaire, tranche inférieure',
 'LMY': 'Revenu faible et intermédiaire',
 'LSO': 'Lesotho',
 'LTE': 'de dividende tardif démographique',
 'LTU': 'Lituanie',
 'LUX': 'Luxembourg',
 'LVA': 'Lettonie',
 'MAC': 'Région administrative spéciale de Macao, Chine',
 'MAF': 'Saint-Martin (fr)',
 'MAR': 'Maroc',
 'MCO': 'Monaco',
 'MDA': 'Moldovie',
 'MDG': 'Madagascar',
 'MDV': 'Maldives',
 'MEA': 'Afrique du Nord et Moyen-Orient',
 'MEX': 'Mexique',
 'MHL': 'Îles Marshall',
 'MIC': 'Revenu intermédiaire',
 'MKD': 'Macédoine du Nord',
 'MLI': 'Mali',
 'MLT': 'Malte',
 'MMR': 'Myanmar',
 'MNA': 'Afrique du Nord et Moyen-Orient (hors revenu élevé)',
 'MNE': 'Monténégro',
 'MNG': 'Mongolie',
 'MNP': 'Mariannes',
 'MOZ': 'Mozambique',
 'MRT': 'Mauritanie',
 'MUS': 'Maurice',
 'MWI': 'Malawi',
 'MYS': 'Malaisie',
 'NAC': 'Amérique du Nord',
 'NAM': 'Namibie',
 'NCL': 'Nouvelle-Calédonie',
 'NER': 'Niger',
 'NGA': 'Nigéria',
 'NIC': 'Nicaragua',
 'NLD': 'Pays-Bas',
 'NOR': 'Norvège',
 'NPL': 'Népal',
 'NRU': 'Nauru',
 'NZL': 'Nouvelle-Zélande',
 'OED': "Pays membres de l'OCDE",
 'OMN': 'Oman',
 'OSS': 'Autres petits états',
 'PAK': 'Pakistan',
 'PAN': 'Panama',
 'PER': 'Pérou',
 'PHL': 'Philippines',
 'PLW': 'Palaos',
 'PNG': 'Papouasie-Nouvelle-Guinée',
 'POL': 'Pologne',
 'PRE': 'de Pré-dividende démographique',
 'PRI': 'Porto Rico',
 'PRK': 'Corée, République démocratique de',
 'PRT': 'Portugal',
 'PRY': 'Paraguay',
 'PSE': 'Cisjordanie et Gaza',
 'PSS': 'Petits états insulaires du Pacifique',
 'PST': 'de Post-dividende démographique',
 'PYF': 'Polynésie française',
 'QAT': 'Qatar',
 'ROU': 'Roumanie',
 'RUS': 'Fédération de Russie',
 'RWA': 'Rwanda',
 'SAS': 'Asie du Sud',
 'SAU': 'Arabie saoudite',
 'SDN': 'Soudan',
 'SEN': 'Sénégal',
 'SGP': 'Singapour',
 'SLB': 'Îles Salomon',
 'SLE': 'Sierra Leone',
 'SLV': 'El Salvador',
 'SMR': 'Saint-Marin',
 'SOM': 'Somalie',
 'SRB': 'Serbie',
 'SSA': 'Afrique subsaharienne (hors revenu élevé)',
 'SSD': 'Soudan du Sud',
 'SSF': 'Afrique subsaharienne',
 'SST': 'Petits états',
 'STP': 'Sao Tomé-et-Principe',
 'SUR': 'Suriname',
 'SVK': 'République slovaque',
 'SVN': 'Slovénie',
 'SWE': 'Suède',
 'SWZ': 'Eswatini',
 'SXM': 'Sint Maarten (Dutch part)',
 'SYC': 'Seychelles',
 'SYR': 'République arabe syrienne',
 'TCA': 'Îles Turques-et-Caïques',
 'TCD': 'Tchad',
 'TEA': 'Asie de l’Est et Pacifique (BIRD et IDA)',
 'TEC': 'Europe et Asie centrale (BIRD et IDA)',
 'TGO': 'Togo',
 'THA': 'Thaïlande',
 'TJK': 'Tadjikistan',
 'TKM': 'Turkménistan',
 'TLA': 'Amérique latine et Caraïbes (BIRD et IDA)',
 'TLS': 'Timor-Leste',
 'TMN': 'Afrique du Nord et Moyen-Orient (BIRD et IDA)',
 'TON': 'Tonga',
 'TSA': 'Asie du Sud (BIRD et IDA)',
 'TSS': 'Afrique subsaharienne (BIRD et IDA)',
 'TTO': 'Trinité-et-Tobago',
 'TUN': 'Tunisie',
 'TUR': 'Turquie',
 'TUV': 'Tuvalu',
 'TZA': 'Tanzanie',
 'UGA': 'Ouganda',
 'UKR': 'Ukraine',
 'UMC': 'Revenu intermédiaire, tranche supérieure',
 'URY': 'Uruguay',
 'USA': 'États-Unis',
 'UZB': 'Ouzbékistan',
 'VCT': 'Saint-Vincent-et-les Grenadines',
 'VEN': 'Venezuela',
 'VGB': 'Îles Vierges britanniques',
 'VIR': 'Îles Vierges (EU)',
 'VNM': 'Viet Nam',
 'VUT': 'Vanuatu',
 'WLD': 'Monde',
 'WSM': 'Samoa',
 'XKX': 'Kosovo',
 'YEM': 'Yémen, Rép. du',
 'ZAF': 'Afrique du Sud',
 'ZMB': 'Zambie',
 'ZWE': 'Zimbabwe'};

  ///////////////////////////////////////////
  ////////////////////MAP////////////////////
  ///////////////////////////////////////////

  // Color scales
  colorScaleCorona = d3.scalePow()
    .exponent(0.5)
    .domain([0, 100])
    .range(["#ececec", "red"]);

  // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(dataGeo.features)
    .enter()
    .append("path")
    .attr("fill", function (d) {
    return colorScaleCorona(1);
    })
    .attr("d", d3.geoPath()
        .projection(projection)
    )
    .style("stroke", "#abb7b7")
    .style("stroke-width", "1px")
    .on('mouseover', function(d) {
      d3.select(this).style('stroke', 'black');
      d3.event.preventDefault();
      displayDetail(d);
    }).on('mouseout', function(d) {
      d3.select(this).style('stroke', '#abb7b7');
    }).on("click", function(d) {
      displayDetail(d);
    })
    .style("opacity", .6)
    .exit()
    .transition().duration(200)
    .attr("r",1)
    .remove();

  // Display Infos by country
  function displayDetail(d) {


    currentCountry = d;
    d3.select(".map-details")
    .html(function() {
      var location = d.properties.name;
      var infos = d3.map(dataMap.get(d.id)) || d3.map();

      return `<h4>${countries[d.id]}</h4>
        <p><span class="stats">Nombre total de tweets geolocalisés par semaine</span> ${tweetsMap.get(d.id) || 0}</p>
        <p><span class="stats">Cas confirmés par million d'habitants</span> ${Math.round(infos.get('ConfirmedRatio') * 100) / 100 || 0  }</p>
        <p><span class="stats">Cas confirmés cumulés</span> ${infos.get('Confirmed') || 0  }</p>
        <p><span class="stats">Décès</span> ${infos.get('Deaths') || 0  }</p>
        <p><span class="stats">Date</span> ${formatDateIntoDay(currentDate)}</p>
      `;})
      .style('opacity', 1);
    }

  // Update the map
  var displayMap = function(data){
    svg.selectAll("path").attr("fill", function (d) {
      var infos = d3.map(data.get(d.id));
      d.total = infos.get('ConfirmedRatio') || 0;
        return colorScaleCorona(d.total);
      })
      .attr("d", d3.geoPath()
      .projection(projection))

  }

  ///////////////////////////////////////////
  ///////////////////BUBLES//////////////////
  ///////////////////////////////////////////

  // Color Scale
  var colorScaleTweets = d3.scaleLinear().domain([0,10000])
    .range(["#b8b8b8", "blue"]);

   // Add a scale for bubble size
  var valueExtent = d3.extent(dataTweets, function(d) { return +d.count; })
  var size = d3.scaleSqrt()
    .domain(valueExtent)
    .range([ 1, 50])  // Size in pixel

  // Add/Update circles:
  var displayCircles = function(data) {
    svg.selectAll(".circles").remove();

    var circles = svg.selectAll(".circle")
          .data(data.sort(function(a,b) { return +b.count - +a.count }).filter(function(d,i){ return i<1000 }));
    circles
      .enter()
        .append("g")
          .attr("class", "circles")
        .append("circle")
          .attr("class", "circles")
          .attr("cx", function(d){ return projection([+d.lon, +d.lat])[0] })
          .attr("cy", function(d){ return projection([+d.lon, +d.lat])[1] })
          //.attr("r", 1)
          //  .transition().duration(200)
          .attr("r", function(d){ return size(+d.count)})
        .style("fill", function(d){ return "#67809f"})//colorScaleTweets(d.count) })
          .attr("stroke", function(d){ if(d.count>100){return "black"}else{return "none"}  })
          .attr("stroke-width", 1)
          .attr("stroke-opacity", 0.7)
          .attr("fill-opacity", 0.4);
    /*circles
      .exit()
        .transition(d3.transition().duration(750))
          .attr("r", 1e-6)
        .remove();
      */
  };


  ///////////////////////////////////////////
  /////////////////SELECTOR//////////////////
  ///////////////////////////////////////////

  var dates = ['19/02/20', '26/02/20', '04/03/20', '11/03/20']

  var idBtn_1  =  'date-1';
  var idBtn_2  =  'date-2';
  var idBtn_3  =  'date-3';
  var idBtn_4  =  'date-4';

  var date1Button = d3.select("#" + idBtn_1).style('top', '20%').html(dates[0]);
  var date2Button = d3.select("#" + idBtn_2).style('top', '20%').html(dates[1]);
  var date3Button = d3.select("#" + idBtn_3).style('top', '20%').html(dates[2]);
  var date4Button = d3.select("#" + idBtn_4).style('top', '20%').html(dates[3]);

  var parser = d3.timeParse("%d/%m/%y");

  document.getElementById(idBtn_1).onclick = function() {update(parser(dates[0]))};
  document.getElementById(idBtn_2).onclick = function() {update(parser(dates[1]))};
  document.getElementById(idBtn_3).onclick = function() {update(parser(dates[2]))};
  document.getElementById(idBtn_4).onclick = function() {update(parser(dates[3]))};

  document.getElementById(idBtn_1).click();

  function updateDatasets(h){
      currentDate = h;
      // filter data set and draw map and bubbles
      newDataTweets = dataTweets.filter(function(d) {
        return d.date == parseDate(h)

      })

      tweetsMap = {}
      newDataTweets.forEach(function(d){
        if (d['alpha-3'] in tweetsMap){
          tweetsMap[d['alpha-3']] = parseInt(tweetsMap[d['alpha-3']]) + parseInt(d.count);
        }
        else{
          tweetsMap[d['alpha-3']] = parseInt(d.count);
        }
      });
      tweetsMap = d3.map(tweetsMap);
      newDataCorona = dataCorona.filter(function(d) {
        return d.date == parseDate(h);
      })

    dataMap = {};
    newDataCorona.forEach(function(d){
      dataMap[d['alpha-3']] = {}
      dataMap[d['alpha-3']]['Date'] = d.date;
      dataMap[d['alpha-3']]['Confirmed'] = d.cumsum_cases;
      dataMap[d['alpha-3']]['Name'] = d.country;
      dataMap[d['alpha-3']]['Deaths'] = d.cumsum_deaths;
      dataMap[d['alpha-3']]['ConfirmedRatio'] = d.cases_by_million;
    });

    dataMap = d3.map(dataMap)
  }

  function update(h) {
    updateDatasets(h);
    displayMap(dataMap);
    displayCircles(newDataTweets);
    if(currentCountry != null)
      displayDetail(currentCountry)
  }


///////////////////////////////////////////
//////////////////LEGEND///////////////////
///////////////////////////////////////////

// Legend: from Bubblemap Template by Yan Holtz
// https://www.d3-graph-gallery.com/graph/bubble_legend.html
// https://www.d3-graph-gallery.com/graph/bubblemap_template.html

  var labels = [0.5, 1, 10, 100]
  var size_l = 20
  var distance_from_top = (height - 50)
  // Legend title
  svg
    .append("text")
      .style("fill", "black")
      .attr("x", 20)
      .attr("y", distance_from_top - labels.length*(size_l+5) + (size_l/2))
      .attr("width", 90)
      .html("Cas confirmés/Mio. d'habitants")
      .style("font-size", 12)

  // Add one dot in the legend for each name.

  svg.selectAll("mydots")
    .data(labels)
    .enter()
    .append("rect")
      .attr("x", 20)
      .attr("y", function(d,i){ return distance_from_top - i*(size_l+5)}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size_l)
      .attr("height", size_l)
      .style("fill", function(d){ return colorScaleCorona(d)})

  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
    .data(labels)
    .enter()
    .append("text")
      .attr("x", 20 + size_l*1.2)
      .attr("y", function(d,i){ return distance_from_top - i*(size_l+5) + (size_l/2)}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d){ return colorScaleCorona(d)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")

  var valuesToShow = [500, 10000, 30000]
  var xCircle = width - 80
  var xLabel = xCircle - 80;
  var yCircle = height - 40;
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("cx", xCircle)
      .attr("cy", function(d){ return yCircle - size(d) } )
      .attr("r", function(d){ return size(d) })
      .style("fill", "none")
      .attr("stroke", "black")
  // Add legend: segments
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr('x1', function(d){ return xCircle - size(d) } )
      .attr('x2', xLabel + 10)
      .attr('y1', function(d){ return yCircle - size(d) } )
      .attr('y2', function(d){ return yCircle - size(d) } )
      .attr('stroke', 'black')
      .style('stroke-dasharray', ('2,2'))
  // Add legend: labels
  svg
    .selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("text")
      .attr('x', xLabel)
      .attr('y', function(d){ return yCircle - size(d) } )
      .text( function(d){
        return d + ' tweets'
      } )
      .style("font-size", 12)
      .attr('alignment-baseline', 'middle')
      .attr('text-anchor', 'end')
});
