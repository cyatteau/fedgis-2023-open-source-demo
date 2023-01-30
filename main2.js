import { map, currentMarkers } from "./main";
import { apiKey } from "./config";
import { geocode } from "esri-leaflet-geocoder";

export function showPlaces() {
  let position;
  geocode({
    apikey: apiKey,
  })
    .category("Hotel")
    .nearby(map.getCenter(), 1)
    .run(function(err, response) {
      for (const result of response.results) {
        position = new L.LatLng(result.latlng.lat, result.latlng.lng);
        currentMarkers.push(
          new L.marker(position).addTo(map).bindTooltip(() => {
            return L.Util.template(
              `<div style="background:#EBECF0; border:solid 1px #BEBEBE;  border-radius:3px; padding:10px;font-size:14px;"><b>${result.properties.PlaceName}</b><br/>
              ${result.properties.Place_addr}<br/>
              `
            );
          })
        );
      }
    });
  map.setView(position, 15);
}

// ${result.properties.Phone}<br/>
// ${result.properties.URL}</div>