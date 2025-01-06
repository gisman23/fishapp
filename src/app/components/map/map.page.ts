import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { DataBaseService } from 'src/app/services/Database.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { CatchInfo } from 'src/app/models/catchInfo.model';
import { ModalController } from '@ionic/angular/standalone';
import { FilterComponent } from '../filter/filter.component';
import { addIcons } from 'ionicons';
import { options, removeOutline } from 'ionicons/icons';
import { LogsPage } from '../logs/logs.page';
import { BboxFilterPipe } from 'src/app/pipes/bbox-filter.pipe';
import { BoundingBox } from 'src/app/models/boundingBox';


@Component({
  selector: 'app-map',
  templateUrl: 'map.page.html',
  styleUrls: ['map.page.scss'],
  imports: [ IonButton, IonToolbar, IonTitle, IonContent, GoogleMapsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class MapPage implements OnInit {

  dataService = inject(DataBaseService)
  modalCtrl = inject(ModalController)
  catches: CatchInfo[]
  name:any

  species: any
  fishermen:any

  boundingBox = signal<BoundingBox>({"minLat":0, "maxLat":0, "minLng":0, "maxLng":0});
  filteredItems = computed(() => {
    const bboxPipe = new BboxFilterPipe();
    return bboxPipe.transform(this.dataService.catches(), this.boundingBox());
  });

  message = "testing modal"
  dateStr = '';
  map: any;

  markers: google.maps.marker.AdvancedMarkerElement[] = []


  constructor() {
    addIcons({ options, removeOutline});
    this.getSpecies()
    this.getFishermen()
  }

  ngOnInit(): void {
   this.createMap();
  }

  async onMapInitialized() {
 //   await this.dataService.getFishEvents()
 //   this.catches = this.dataService.catches()
    await this.dataService.getFishermen()
  //  console.log(this.dataService.fishermen())
   // await this.dataService.getFishEvents()
    this.DisplayCatches(this.dataService.catches())
    // Do your actions here, e.g., add markers, overlays, etc.
  }

  async createMap() {
    await this.dataService.getFishEvents()
    this.catches = this.dataService.catches()
    const { Map } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;

    this.map = new Map(document.getElementById('map'), {
      center: { lat: 39.066, lng: -76.511 },
      zoom: 12,
      mapId: 'DEMO_MAP_ID',
    });
    this.map.addListener('MapInitialized', this.onMapInitialized())
    this.map.addListener('bounds_changed', () => {
      const bounds = this.map.getBounds()
      if (bounds) {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        this.boundingBox.set({"minLat": southWest.lat(), "maxLat": northEast.lat(),
                              "minLng": southWest.lng(), "maxLng": northEast.lng()})
      }
    }); 
  }

  public async DisplayCatches(catches:CatchInfo[]) {
    const { InfoWindow } = (await google.maps.importLibrary(
      'maps'
    )) as google.maps.MapsLibrary;
    const { AdvancedMarkerElement } = (await google.maps.importLibrary(
      'marker'
    )) as google.maps.MarkerLibrary;

    this.markers = [];

    //   this.featureGroup.clearLayers();
    catches.forEach( (x) => {
      this.dateStr =
        String(x.CatchDate).substring(5, 7) +
        '/' +
        String(x.CatchDate).substring(8, 10) +
        '/' +
        String(x.CatchDate).substring(0, 4);
      var popupContent =
        '<div style="color:blue;  id="infoText">' +
        '<b>' +
        String(this.dateStr) +
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
          '<br>' + '<img src=' + x.Picture+ ' width="128" height="128"></div>';

      const infoWindow = new InfoWindow({
        content: popupContent,
      });
      const map = this.map;
      const position = new google.maps.LatLng(x.Location[1], x.Location[0]);
      const marker = new AdvancedMarkerElement({
        map,
        position,
      });

      marker.addListener('click', () => {
        infoWindow.open({ map, anchor: marker });
      });
      this.markers.push(marker);
    });
    const map = this.map;
    var mkl = this.markers;
    new MarkerClusterer({ map, markers: mkl });
  }

  async presentFilterModal() {
      const modal = await this.modalCtrl.create({
        component: FilterComponent,
      });
      modal.present(); 
  }
  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: LogsPage,
      breakpoints: [0, 0.3, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }

  async getSpecies(){
    await this.dataService.getSpecies()
    this.species = this.dataService.species().sort()
  }

  async getFishermen(){
    await this.dataService.getFishermen()
    this.fishermen = this.dataService.fishermen().sort()
  }
}


