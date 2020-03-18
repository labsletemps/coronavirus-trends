/*

Note de Paul:
Dans ce fichier, je peux créer une scène ImageMagick pour déclencher des effets de scroll.
Et on peut concaténer tous les scripts (avec webpack / CodeKit etc.), je peux le faire moi quand on passe en prod

*/


$( document ).ready(function() {

    media_graph("CH");
    trend_graph("CH");

    d3.select("#country-option-public").on("change", change_public)
    function change_public() {
      $("#chartTop").empty();
      if (this.selectedIndex == 0){
        trend_graph("CH");
      } else if (this.selectedIndex == 1){
        trend_graph("IT");
      } else if (this.selectedIndex == 2){
        trend_graph("DE");
      } else if (this.selectedIndex == 3){
        trend_graph("FR");
      }
    }

    d3.select("#country-option-media").on("change", change_media)
    function change_media() {
      $("#chartMedia").empty();
      if (this.selectedIndex == 0){
        media_graph("CH");
      } else if (this.selectedIndex == 1){
        media_graph("IT");
      } else if (this.selectedIndex == 2){
        media_graph("DE");
      } else if (this.selectedIndex == 3){
        media_graph("FR");
      }
    }

});
