import { Component, EnvironmentInjector} from '@angular/core';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { options, camera, copy, globe } from 'ionicons/icons';

@Component({
  selector: 'app-tabs-page',
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.css'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel],
})
export class TabsPageComponent {
  constructor(public environmentInjector: EnvironmentInjector) {
    addIcons({ options, camera, copy, globe});
}
}
