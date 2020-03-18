/*

Note de Paul:
Dans ce fichier, je peux créer une scène ImageMagick pour déclencher des effets de scroll.
Et on peut concaténer tous les scripts (avec webpack / CodeKit etc.), je peux le faire moi quand on passe en prod

*/


$( document ).ready(function() {

    media_graph("FR");
    trend_graph("FR");

    d3.select("#country-option").on("change", change)
    function change() {
      $("#chartTop").empty();
      console.log(this.selectedIndex);
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
});
