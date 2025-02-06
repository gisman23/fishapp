import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonList, IonItem, IonLabel, IonTitle, IonGrid,
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
  imports: [IonHeader, IonTitle, IonLabel, IonCheckbox, IonGrid,
    IonItem, IonList, CommonModule, IonContent, IonButton],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FilterComponent {
  dataService = inject(DataBaseService)
  viewCtrl = inject(ModalController)

  species: any
  fishermen: any
  fishermenFilter = [];
  speciesFilter = [];
  yearFilter = [];
  yearBtn = ["outline", "outline", "outline", "outline"]


  constructor() {
    addIcons({ options });
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

  getSelectedFishermen(item: string) {
    if (this.fishermenFilter.includes(item)) {
      this.fishermenFilter = this.fishermenFilter.filter((value) => value != item);

    } else {
      this.fishermenFilter.push(item)
    }
    console.log(this.fishermenFilter)
  }

  getSelectedSpecies(item: string) {
    if (this.speciesFilter.includes(item)) {
      this.speciesFilter = this.speciesFilter.filter((value) => value != item);

    } else {
      this.speciesFilter.push(item)
    }
    console.log(this.speciesFilter)
  }

  filterDate(index: number, year: string) {
    if (this.yearBtn[index] == "outline") {
      this.yearBtn[index] = "solid"
    }
    else {
      this.yearBtn[index] = "outline"
    }

    if (this.yearFilter.includes(year)) {
      this.yearFilter = this.yearFilter.filter((value) => value != year);

    } else {
      this.yearFilter.push(year)
    }
    console.log(this.yearFilter)
  }

}