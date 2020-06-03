import { Injectable } from "@angular/core";
import data from "../assets/charactersinfo.json";

interface CharacterData {
  id: number;
  name: string;
  folder: string;
  splash: string;
  no_cuts: number;
}

interface AppState {
  selectedChar: string;
  activity: string;
  language: null | Language; // TO-DO: implement multiple languages
}

interface Language {
  name: string;
  appTexts: string[];
}

@Injectable({
  providedIn: "root",
})
export class CharacterService {
  public firstInit: Boolean = true;
  private rawCharData: CharacterData[] = data;
  private selectedChar: CharacterData = this.rawCharData[0];
  private appState: AppState = {
    selectedChar: "Yu Matsumoto",
    activity: "Homework",
    language: null,
  };

  public setActivity(activity: string) {
    this.appState.activity = activity;
  }

  public getActivity(): string {
    return this.appState.activity;
  }

  public getAllCharData() {
    return this.rawCharData;
  }

  public getSelectedCharData() {
    return this.selectedChar;
  }

  public setSelectedCharByName(name: string) {
    for (let character of this.rawCharData) {
      if (character.name == name) this.selectedChar = character;
    }
  }

  public setSelectedCharById(id: number) {
    for (let character of this.rawCharData) {
      if (character.id == id) this.selectedChar = character;
    }
  }

  public getSelectedSplash() {
    return (
      "../assets/characters/" +
      this.selectedChar.folder +
      "/" +
      this.selectedChar.splash +
      ".png"
    );
  }

  public getRandomClipId(): number {
    return Math.floor(Math.random() * this.selectedChar.no_cuts);
  }

  public getAllClips() {
    let clipSrcs: any[] = [];
    for (let i = 1; i <= this.selectedChar.no_cuts; i++) {
      clipSrcs.push({
        id: i - 1,
        src:
          "../assets/characters/" +
          this.selectedChar.folder +
          "/cuts/cut" +
          i +
          ".mp4",
      });
    }
    return clipSrcs;
  }

  constructor() {}
}
