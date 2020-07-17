var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(url, function(data){
   
    createFeatures(data.features)
})

function createFeatures(earthquakeData) {
   
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: function (feature, layer){
          layer.bindPopup("<h3>" + feature.properties.place +
           "<br> Magnitude: " + feature.properties.mag +
          "</h3><hr><p>" + new Date(feature.properties.time)
           + "</p>");
        },
        pointToLayer: function (feature, latlng) {
          return new L.circle(latlng,{
              radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: 0.75,
              stroke: true,
              color: "#777",
              weight: 0.75
          })
        }
    })

    createMap(earthquakes)
}

function createMap(earthquakes) {
    
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: 'mapbox/light-v10',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: api_key
    })

    var overlapMaps = {
        Earthquakes: earthquakes
    }

    var map = L.map("map", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

   
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

   
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) +
             '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] +
             '<br>' : '+');
    }
    return div;
  };

  legend.addTo(map);

}

function chooseColor(magnitude) {

    if (magnitude > 5) {
       return "#ff5900";
   } else if (magnitude > 4) {
       return "#ff8c00";
   } else if (magnitude > 3) {
       return "#ffb700";
   } else if (magnitude > 2) {
       return "#ffdd00";
   } else if (magnitude > 1) {
       return "#ccff00";
   } else {
       return "#95ff00";
   }
}
