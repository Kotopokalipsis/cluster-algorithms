import * as L from "leaflet";

export function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function getMarkerIcon(): L.Icon<L.IconOptions> {
  return L.icon({
    iconUrl: "assets/building-icon.png",
    iconAnchor: [14, 14],
  });
}

export function createClusterIcon(feature: any, latlng: L.LatLng) {
  if (!feature.properties.cluster)
    return L.marker(latlng, {
      icon: getMarkerIcon(),
    });

  const count = feature.properties.point_count;
  const size = count < 100 ? "small" : count < 1000 ? "medium" : "large";
  const icon = L.divIcon({
    html: `<div><span>${feature.properties.point_count_abbreviated}</span></div>`,
    className: `marker-cluster marker-cluster-${size} d-flex justify-content-center align-items-center`,
    iconSize: L.point(40, 40),
  });

  return L.marker(latlng, { icon });
}
