/*

Note de Paul:
Dans ce fichier, je peux créer une scène ImageMagick pour déclencher des effets de scroll.
Et on peut concaténer tous les scripts (avec webpack / CodeKit etc.), je peux le faire moi quand on passe en prod

*/


$( document ).ready(function() {

  var controller = new ScrollMagic.Controller();

  var chartTrendScene = new ScrollMagic.Scene({triggerElement: "#trendsChart", duration: 300})
    .setClassToggle("#trendsChart", "bounce")
    .addTo(controller)
    .addIndicators({'name': 'chart-1'}) // debug
    .on("enter", function(){
      console.log('enter')
    })
    .on("progress", function (event) {
      if(event.progress > 0.8){
        $('#public-FR').trigger('click');
      }else if(event.progress > 0.4){
        $('#public-DE').trigger('click');
      }else if(event.progress > 0){
        $('#public-IT').trigger('click');
      }
    })
    .on("leave", function(event){
      if(event.progress == 0{
        $('#public-CH').trigger('click');
      }
    });

    var mapScene = new ScrollMagic.Scene({triggerElement: "#mapTrigger", duration: "50%", offset: 300})
      .setPin('#mapContainer')
      .addTo(controller)
      .addIndicators({'name': 'map'}) // debug
      .on("enter", function(){
        console.log('enter map')
      })
      .on("progress", function (event) {
        console.log(event.progress)
        if(event.progress > 0.8){
          $('#date-4').trigger('click');
        }else if(event.progress > 0.6){
          $('#date-3').trigger('click');
        }else if(event.progress > 0.4){
          $('#date-2').trigger('click');
        }else if(event.progress > 0.2){
          $('#date-1').trigger('click');
        }
      });
      .on("leave", function(event){
        if(event.progress == 0{
          $('#date-1').trigger('click');
        }
      });


    media_graph("CH");
    trend_graph("CH");

  $('.nav  li').click(function(e) {
    if(!$(e.target).hasClass('active')) {
      if (e.target.id == "public-CH"){
        $("#trendsChart").empty();
        trend_graph("CH");
      } else if (e.target.id == "public-IT"){
        $("#trendsChart").empty();
        trend_graph("IT");
      } else if (e.target.id == "public-DE"){
        $("#trendsChart").empty();
        trend_graph("DE");
      } else if (e.target.id == "public-FR"){
        $("#trendsChart").empty();
        trend_graph("FR");
      } else if (e.target.id == "media-CH"){
        $("#chartMedia").empty();
        media_graph("CH");
      } else if (e.target.id == "media-IT"){
        $("#chartMedia").empty();
        media_graph("IT");
      } else if (e.target.id == "media-DE"){
        $("#chartMedia").empty();
        media_graph("DE");
      } else if (e.target.id == "media-FR"){
        $("#chartMedia").empty();
        media_graph("FR");
      }
    }
  });
});
