
import { IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonLabel, IonItem
 } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DataBaseService } from 'src/app/services/Database.service';
import { CatchInfo } from 'src/app/models/catchInfo.model';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss'],
  imports: [CommonModule,IonHeader, IonToolbar, IonTitle, IonContent,
     IonList, IonLabel, IonItem
  ]
})
export class LogsPage {
    dataService = inject(DataBaseService)
    catches: CatchInfo[]
    
    constructor () {
      this.catches = this.dataService.catches()
      console.log(this.catches)
    }

}
