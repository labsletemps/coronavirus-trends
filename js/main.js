/*

Note de Paul:
Dans ce fichier, je peux créer une scène ImageMagick pour déclencher des effets de scroll.
Et on peut concaténer tous les scripts (avec webpack / CodeKit etc.), je peux le faire moi quand on passe en prod

*/


$( document ).ready(function() {

    media_graph("CH");
    trend_graph("CH");

  $('.nav  li').click(function(e) {
    if(!$(e.target).hasClass('active')) {
      if (e.target.id == "public-CH"){
        $("#chartTop").empty();
        trend_graph("CH");
      } else if (e.target.id == "public-IT"){
        $("#chartTop").empty();
        trend_graph("IT");
      } else if (e.target.id == "public-DE"){
        $("#chartTop").empty();
        trend_graph("DE");
      } else if (e.target.id == "public-FR"){
        $("#chartTop").empty();
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
