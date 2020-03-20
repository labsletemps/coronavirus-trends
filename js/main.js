/*

Note de Paul:
Dans ce fichier, je peux créer une scène ImageMagick pour déclencher des effets de scroll.
Et on peut concaténer tous les scripts (avec webpack / CodeKit etc.), je peux le faire moi quand on passe en prod

*/


$( document ).ready(function() {


  var controller = new ScrollMagic.Controller();
  var slideCounter = 0;

  var chartTrendScene = new ScrollMagic.Scene({triggerElement: "#trendsChart", duration: 300})
    .setClassToggle("#trendsChart", "bounce")
    .addTo(controller)
    // .addIndicators({'name': 'chart-1'}) // debug
    .on("enter", function(){
      // console.log('enter')
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
      if(event.progress == 0){
        $('#public-CH').trigger('click');
      }
    });

    var chartMediaScene = new ScrollMagic.Scene({triggerElement: "#chartMedia", duration: 300})
      .setClassToggle("#chartMedia", "bounce")
      .addTo(controller)
      // .addIndicators({'name': 'chart-2'}) // debug
      .on("enter", function(){
        // console.log('enter')
      })
      .on("progress", function (event) {
        if(event.progress > 0.8){
          $('#media-FR').trigger('click');
        }else if(event.progress > 0.4){
          $('#media-DE').trigger('click');
        }else if(event.progress > 0){
          $('#media-IT').trigger('click');
        }
      })
      .on("leave", function(event){
        if(event.progress == 0){
          $('#media-CH').trigger('click');
        }
      });

    var mapScene = new ScrollMagic.Scene({triggerElement: "#mapTrigger", duration: "50%", offset: 300})
      .setPin('#mapContainer')
      .addTo(controller)
      // .addIndicators({'name': 'map'}) // debug
      .on("enter", function(){
        // console.log('enter map')
      })
      .on("progress", function (event) {
        // console.log(event.progress)
        if(event.progress > 0.8){
          if(slideCounter != 4){
            // console.log('Slide 4')
            $('#date-4').trigger('click');
            slideCounter = 4;
          }
        }else if(event.progress > 0.4){
          if(slideCounter != 3){
            // console.log('Slide 3')
            $('#date-3').trigger('click');
            slideCounter = 3;
          }
        }else if(event.progress > 0){
          if(slideCounter != 2){
            // console.log('Slide 2')
            $('#date-2').trigger('click');
            slideCounter = 2;
          }
        }
      })
      .on("leave", function(event){
        if(event.progress == 0  && slideCounter != 1){
          $('#date-1').trigger('click');
           slideCounter = 1;
        }
      });

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
        update_media_graph("CH");
      } else if (e.target.id == "media-IT"){
        update_media_graph("IT");
      } else if (e.target.id == "media-DE"){
        update_media_graph("DE");
      } else if (e.target.id == "media-FR"){
        update_media_graph("FR");
      }
    }
  });
});
