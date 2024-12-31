import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList, IonItem, IonLabel, IonTitle,
  IonHeader, IonContent
} from '@ionic/angular/standalone';
import { DataBaseService } from 'src/app/services/Database.service';
import { ModalController } from '@ionic/angular/standalone';


@Component({
  selector: 'app-filter',
  templateUrl: 'filter.component.html',
  styleUrls: ['filter.component.css'],
  standalone: true,
  imports: [IonHeader, IonTitle, IonLabel,
    IonItem, IonList, CommonModule, IonContent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilterComponent {
  dataService = inject(DataBaseService)
 // viewCtrl = inject(ModalController)

  species: any
  fishermen: any


  constructor() {
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
  //  this.viewCtrl.dismiss();
  }
}