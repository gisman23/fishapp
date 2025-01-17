
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonGrid, IonCard, IonRow, IonCol, IonCardHeader, IonCardTitle
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { DataBaseService } from 'src/app/services/Database.service';
import { CatchInfo } from 'src/app/models/catchInfo.model';

@Component({
  selector: 'app-logs',
  templateUrl: 'logs.page.html',
  styleUrls: ['logs.page.scss'],
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonGrid, IonCard, IonRow, IonCol, IonCardHeader, IonCardTitle
  ]
})
export class LogsPage {
  dataService = inject(DataBaseService)
  catches: CatchInfo[]
  public currentSelected: Number = null;


  filteredItems = computed(() => {
    /* Unique CatchDate's */
    return this.dataService.catches().filter((obj, index, self) => {
      return index === self.findIndex(o => o["CatchDate"] === obj["CatchDate"]);
    }).sort((a, b) => b.CatchDate.localeCompare(a.CatchDate))
  });

  constructor() {
    this.catches = this.dataService.catches()
    console.log(this.catches)
  }

}
