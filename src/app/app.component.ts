import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as L from "leaflet";
import { marker, tileLayer } from 'leaflet';
import { Coordinates } from './models/coordinates.model';
import { createClusterIcon, getMarkerIcon, getRandomArbitrary } from './utils/utils';
import { SuperClusterAlgorithm } from './algorithms/supercluster-algorithm';

export enum AlgorithmType {
  none = 0,
  supercluster = 1,
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cluster-algorithms';

  markersCountControl = new FormControl(100);

  map: L.Map | null = null;
  options: any = {
    maxZoom: 19,
    closePopupOnClick: false,
    zoom: 13,
    fadeAnimation: false,
    inertia: false,
    center: L.latLng(51.48320025111633, -0.07347106933593751)
  };

  geoJsonLayer: any;
  geoJsonMarkers: any[] = [];

  algorithmType: AlgorithmType = AlgorithmType.none;

  constructor(private superclusterAlgorithm: SuperClusterAlgorithm) {}

  public ngOnInit(): void {
  }

  public onZoomMap($event: L.LeafletEvent) {
    this.startAlgorithm();
  }

  public onMapClick($event: L.LeafletMouseEvent) {
    console.log($event);
  }

  public onMapReady(map: L.Map) {
    this.map = map;

    const tileServerUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    let baseLayer = tileLayer(tileServerUrl, {
        attribution: "",
        maxZoom: 30,
        tileSize: 512,
        zoomOffset: -1,
        detectRetina: true,
    });

    this.map?.addLayer(baseLayer);

    this.createGeoJsonLayer();
  }

  public onMapMoveEnd($event: L.LeafletEvent) {
    this.startAlgorithm();
  }

  public onClickGenerateMarkers() {
    this.geoJsonLayer.clearLayers();
    this.geoJsonMarkers = [];

    let markersCount = this.markersCountControl.value;
    if (!markersCount) return;

    for (let index = 0; index < markersCount; index++) {
      let lat = getRandomArbitrary(51.45, 51.52);
      let lng = getRandomArbitrary(-0.2, 0.05);

      this.geoJsonMarkers.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [lng, lat],
        },
        properties: {},
      });
    }

    this.startAlgorithm(true);
  }

  public onClickChangeAlgorithm(algorithm: AlgorithmType) {
    this.algorithmType = algorithm;
    this.startAlgorithm(true);
  }

  private createGeoJsonLayer() {
    this.geoJsonLayer = L.geoJson(undefined, {
      pointToLayer: createClusterIcon,
    }).addTo(this.map!)
  }

  private startAlgorithm(reload: boolean = false) {
    switch (this.algorithmType) {
      case AlgorithmType.supercluster: {
        if (reload) this.superclusterAlgorithm.load(this.geoJsonMarkers);

        let clustersMarkers = this.superclusterAlgorithm.getClusters(this.map!);

        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(clustersMarkers);

        return;
      }
      case AlgorithmType.none: {
        this.geoJsonLayer.clearLayers();
        this.geoJsonLayer.addData(this.geoJsonMarkers);

        return;
      }
    }
  }
}
