import { Injectable } from "@angular/core";
// import Supercluster from "../../../node_modules/@types/supercluster";
// import Supercluster, { ClusterFeature } from "supercluster";
import Supercluster from 'supercluster';

@Injectable({providedIn: "root"})
export class SuperClusterAlgorithm {
  private supercluster: Supercluster;

  private radius: number = 200;
  private maxZoom: number = 19;

  constructor() {
    this.supercluster = new Supercluster({radius: this.radius, maxZoom: this.maxZoom});
  }

  public load(geoJsonMarkers: any[]) {
    this.supercluster.load(geoJsonMarkers);
  }

  public getClusters(map: L.Map) {
    const bounds = map.getBounds();
    const bbox = [
      bounds.getWest(),
      bounds.getSouth(),
      bounds.getEast(),
      bounds.getNorth(),
    ];

    return this.supercluster!.getClusters(bbox as GeoJSON.BBox, map.getZoom());
  }
}
