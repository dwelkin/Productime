import { Component, OnInit } from "@angular/core";

import { CharacterService } from "../character.service";
import { NavController, ModalController } from "@ionic/angular";

interface CharacterData {
  id: number;
  name: string;
  folder: string;
  splash: string;
  no_cuts: number;
}

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"],
})
export class SettingsPage implements OnInit {
  charData: CharacterData[];
  activity: string;
  characterName: string;

  submit() {
    console.log("form submitted");
    console.log(this.characterName, this.activity);
    this.dataSvc.setSelectedCharByName(this.characterName);
    this.dataSvc.setActivity(this.activity);
    this.dismiss(true);
  }

  selectionChange() {}

  dismiss(save = false) {
    this.modalCtrl.dismiss({
      saveData: save,
    });
  }

  constructor(
    private router: NavController,
    private dataSvc: CharacterService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    console.log("I am up to datsade");
    this.charData = this.dataSvc.getAllCharData();
  }
}
