/*

Note de Paul:
Dans ce fichier, je peux créer une scène ImageMagick pour déclencher des effets de scroll.
Et on peut concaténer tous les scripts (avec webpack / CodeKit etc.), je peux le faire moi quand on passe en prod

*/


$( document ).ready(function() {

//  media_graph("CH");
//  trend_graph("CH");
//
//  var controller = new ScrollMagic.Controller();
//
//  var chartTrendScene = new ScrollMagic.Scene({triggerElement: "#trendsChart", duration: 1000})
//    .setClassToggle("#trendsChart", "bounce")
//    .addTo(controller)
//    .addIndicators({'name': 'chart-1'}) // debug
//    .on("enter", function(){
//      console.log('enter')
//      $("#trendsChart").empty();
//      //trend_graph("IT");
//      $('#public-IT').click();
//    })
//    .on("leave", function(){
//      console.log('leave')
//      // chart1.unload(['Apple Watch**']);
//    });


  $('.nav  li').click(function(e) {
    if(!$(e.target).hasClass('active')) {
      if (e.target.id == "public-CH"){
        update_trend_graph("CH");
      } else if (e.target.id == "public-IT"){
        update_trend_graph("IT");
      } else if (e.target.id == "public-DE"){
        update_trend_graph("DE");
      } else if (e.target.id == "public-FR"){
        update_trend_graph("FR");
      } else if (e.target.id == "media-CH"){
        media_graph("CH");
      } else if (e.target.id == "media-IT"){
        media_graph("IT");
      } else if (e.target.id == "media-DE"){
        media_graph("DE");
      } else if (e.target.id == "media-FR"){
        media_graph("FR");
      }
    }
  });
});
