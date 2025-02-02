import { Injectable, inject, signal, computed } from '@angular/core';
import { CatchInfo } from '../models/catchInfo.model';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { FirebaseConfig } from '../firebaseConfig';
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { BodyOfWater } from '../models/bodyOfWater.model';

@Injectable({
    providedIn: 'root',
})
export class DataBaseService {
    firestore = inject(Firestore);
    firebaseConfig = FirebaseConfig;
    catches = signal<CatchInfo[]>([])
    filteredItems = computed(() => {
        /* Unique CatchDate's */
        return this.catches().filter((obj, index, self) => {
          return index === self.findIndex(o => o["CatchDate"] === obj["CatchDate"]);
        }).sort((a, b) => b.CatchDate.localeCompare(a.CatchDate))
      });

    waters = signal<BodyOfWater[]>([])
    fishermen = signal([])
    species = signal([])
    db: Firestore

    constructor() {
        this.db = getFirestore(initializeApp(this.firebaseConfig));
        this.getFishEvents()
        this.getFishermen()
        this.getSpecies()


     //   this.getBodyOfWater()
    }

    async getFishermen() {
        const docRef = doc(this.db, "Fishermen", "Fishermen");
        await getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                this.fishermen.set(data['Name']);
            }
        })
    }

    async getSpecies() {
        const docRef = doc(this.db, "Species", "Species");
        await getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                this.species.set(data['Name']);
            }
        })
    }

    async getBodyOfWater() {
        const docRef = doc(this.db, "BodyOfWater", "BodyOfWater");
        await getDoc(docRef).then((docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                data['BodyOfWater'].forEach((doc: BodyOfWater) => {
    //                    console.log("X", doc)
                    this.waters.update(values => [...values, doc]);
                })
            }
        })
    }

    async getFishEvents() {
        await getDocs(collection(this.db, "FishEvents")).then(querySnapshot => 
            querySnapshot.docs.forEach( async doc => {
                this.catches.update(values => [...values, doc.data()]);
            })
        )
    };

    async getSelectedFishermen(fishermen: string) {
        const catches = this.catches()
        const results = catches.filter(((item) => item.Fishermen == fishermen))
        console.log(results)
    }
}


