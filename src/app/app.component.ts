import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {
  scripts: any;
  apiKey = environment.GOOGLE_MAPS_API_KEY;

ngOnInit() {
//this.loadScript('https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&libraries=places,drawing&callback=initMap').then(() => {
 // console.log('Success')
}
}
/*
  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = name;
      document.getElementsByTagName('head')[0].appendChild(script);
      console.log('Script Loaded');
      resolve(null)
    });
  } */

