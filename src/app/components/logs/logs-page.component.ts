import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';


@Component({
  selector: 'app-logs-page',
  templateUrl: 'logs-page.component.html',
  styleUrls: ['logs-page.component.css'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent]
})
export class LogsPageComponent {

  constructor() {}

}