import { apiKey } from "./config";

import { geosearch, arcgisOnlineProvider } from "esri-leaflet-geocoder";

export const theSearchInput = geosearch({
  position: "topright",
  placeholder: "Enter address, city, or zip code",
  useMapBounds: false,
  title: "Search",
  providers: [
    arcgisOnlineProvider({
      apikey: apiKey,
    }),
  ],
});
