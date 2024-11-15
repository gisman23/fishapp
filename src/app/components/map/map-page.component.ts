import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-map-page',
  templateUrl: 'map-page.component.html',
  styleUrls: ['map-page.component.css'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class MapPageComponent {
  constructor() {}
}
