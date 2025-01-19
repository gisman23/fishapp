import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, computed, ViewChild, ElementRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonGrid, IonRow,  IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader } from '@ionic/angular/standalone';
import { DataBaseService } from 'src/app/services/Database.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { CatchInfo } from 'src/app/models/catchInfo.model';
import { ModalController } from '@ionic/angular/standalone';
import { FilterComponent } from '../filter/filter.component';
import { addIcons } from 'ionicons';
import { options, removeOutline } from 'ionicons/icons';
import { BoundingBox } from 'src/app/models/boundingBox';
import Multimap from 'multimap';


@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  imports: [IonGrid, IonRow,   IonToolbar, IonTitle, IonContent, 
    IonCard, IonCardHeader, IonContent, GoogleMapsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class MapPage implements OnInit {
  @ViewChild('log_modal') sheetElement!: ElementRef;
  dataService = inject(DataBaseService)
  modalCtrl = inject(ModalController)

  boundingBox = signal<BoundingBox>({ "minLat": 0, "maxLat": 0, "minLng": 0, "maxLng": 0 });
  filteredItems = computed(() => {
    /* Unique CatchDate's */
    return this.dataService.catches().filter((obj, index, self) => {
      return index === self.findIndex(o => o["CatchDate"] === obj["CatchDate"]);
    }).sort((a, b) => b.CatchDate.localeCompare(a.CatchDate))
  });

  catches: CatchInfo[]

  species: any
  fishermen: any

  map: any;
  markers: google.maps.marker.AdvancedMarkerElement[] = []

  previousInfoWindow = null;
  previousSelectedItem = null;
  markerMap = new Multimap();
  log_modal: any;

  constructor() {
    addIcons({ options, removeOutline });
    this.getSpecies()
    this.getFishermen()
  }

  ngOnInit(): void {
    this.createMap();
  }

  async onMapInitialized() {
    await this.dataService.getFishermen()
    this.DisplayCatches(this.dataService.catches())
  }

  async createMap() {
    await this.dataService.getFishEvents()
    this.catches = this.dataService.catches()
    const { Map } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;

    this.map = new Map(document.getElementById('map'), {
      center: { lat: 42.5, lng: -97.8 },
      streetViewControl: false,
      zoom: 3,
      mapId: 'DEMO_MAP_ID',
    });
    this.map.addListener('MapInitialized', this.onMapInitialized())
    this.map.addListener('bounds_changed', () => {
      const bounds = this.map.getBounds()
      if (bounds) {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        this.boundingBox.set({
          "minLat": southWest.lat(), "maxLat": northEast.lat(),
          "minLng": southWest.lng(), "maxLng": northEast.lng()
        })
      }
    });
  }

  public async DisplayCatches(catches: CatchInfo[]) {
    const { InfoWindow } = (await google.maps.importLibrary('maps')) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary('marker')) as google.maps.MarkerLibrary;

    this.markers = [];

    catches.forEach((x) => {
      const dateStr =
        String(x.CatchDate).substring(5, 7) +
        '/' +
        String(x.CatchDate).substring(8, 10) +
        '/' +
        String(x.CatchDate).substring(0, 4);
      var popupContent =
        '<div style="color:blue;  id="infoText">' +
        '<b>' +
        String(dateStr) +
        '</b> - ' +
        String(x.CatchTime) +
        '<br/> ' +
        '<b> Fishermen:  </b> ' +
        String(x.Fishermen) +
        '<br/>' +
        '<b> Type Fish:  </b>' +
        String(x.Species) +
        '<br/>' +
        '<b> Air Temp:  </b>' +
        String(x.AirTemp) +
        '<br/>' +
        '<b> Water Temp:  </b>' + String(x.WaterTemp) + '<br/>';
      if (x.LowTideOffset > 0) {
        popupContent +=
          '<b> Low Tide Offset:  </b>' + String(x.LowTideOffset) + ' mins<br/>';
      }
      if (x.HighTideOffset > 0) {
        popupContent +=
          '<b> High Tide Offset:  </b>' + String(x.HighTideOffset) + ' mins<br/>';
      }
      popupContent +=
        '<br>' + '<img src=' + x.Picture + ' width="128" height="128"></div>';

      const infoWindow = new InfoWindow({
        content: popupContent,
      });
      const map = this.map;
      const position = new google.maps.LatLng(x.Location[1], x.Location[0]);
      const pin = new google.maps.marker.PinElement({});
      const marker = new AdvancedMarkerElement({
        map,
        position,
        content: pin.element
      });
      this.markerMap.set(x.CatchDate, marker)

      marker.addListener('click', () => {
        if (this.previousInfoWindow != null) {
          this.previousInfoWindow.close()
        }
        this.previousInfoWindow = infoWindow;
        infoWindow.open({ map, anchor: marker });
      });
      this.markers.push(marker);
    });
    const map = this.map;
    new MarkerClusterer({ map, markers: this.markers });

  }

  async presentFilterModal() {
    const modal = await this.modalCtrl.create({
      component: FilterComponent,
    });
    modal.present();
  }


  async getSpecies() {
    await this.dataService.getSpecies()
    this.species = this.dataService.species().sort()
  }

  async getFishermen() {
    await this.dataService.getFishermen()
    this.fishermen = this.dataService.fishermen().sort()
  }

  public currentSelected: Number = null;
  selectDate(index, item) {
    this.currentSelected = index === this.currentSelected ? null : index;
    item.selected = !item.selected;
    if (this.previousSelectedItem != null) {
      const prevmarkers = this.markerMap.get(this.previousSelectedItem.CatchDate)
      prevmarkers.forEach(marker => {
        const pin = new google.maps.marker.PinElement({
          background: "red",
        });
        marker.content = pin.element
      });
    }

    var bounds = new google.maps.LatLngBounds();

    const selectedMarkers = this.markerMap.get(item.CatchDate)
    selectedMarkers.forEach(marker => {
      bounds.extend(marker.position) // your marker position, must be a LatLng instance
      const pin = new google.maps.marker.PinElement({
        background: "yellow",
      });
      marker.content = pin.element
    });
    this.map.fitBounds(bounds); // map should be your map class
    this.previousSelectedItem = item
    const { nativeElement } = this.sheetElement;
    if (!nativeElement) {
      return;
    }
    nativeElement.setCurrentBreakpoint(0.15);
  }

}