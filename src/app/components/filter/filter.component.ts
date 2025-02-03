import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList, IonItem, IonLabel, IonTitle,
  IonHeader, IonContent, IonCheckbox, IonButton
} from '@ionic/angular/standalone';
import { DataBaseService } from 'src/app/services/Database.service';
import { ModalController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { options } from 'ionicons/icons';


@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonLabel, IonCheckbox,
    IonItem, IonList, CommonModule, IonContent,IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilterComponent {
  dataService = inject(DataBaseService)
  viewCtrl = inject(ModalController)

  species: any
  fishermen: any


  constructor() {
    addIcons({ options});
    this.getSpecies()
    this.getFishermen()
  }

  async getSpecies() {
    await this.dataService.getSpecies()
    this.species = this.dataService.species().sort()
  }

  async getFishermen() {
    await this.dataService.getFishermen()
    this.fishermen = this.dataService.fishermen().sort()
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  getValue(event:any)
  {
    console.log(event)
    this.dataService.getSelectedFishermen(event)
  }
}