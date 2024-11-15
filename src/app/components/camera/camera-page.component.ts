import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-camera-page',
  templateUrl: 'camera-page.component.html',
  styleUrls: ['camera-page.component.css'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class CameraPageComponent {
  constructor() {}
}
