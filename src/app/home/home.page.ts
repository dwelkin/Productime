import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterContentInit,
} from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RoundProgressComponent } from "angular-svg-round-progressbar";
import { NavController, ModalController } from "@ionic/angular";
import { viewClassName } from "@angular/compiler";
import { IonSlides } from "@ionic/angular";
import { CharacterService } from "../character.service";
import { KeyValuePipe } from "@angular/common";
import { SettingsPage } from "../settings/settings.page";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  display_time: BehaviorSubject<string> = new BehaviorSubject("00:00");
  timer: number; // in seconds
  resting: boolean = false;
  timerID: any;
  RESTTIME: number = 5;
  WORKTIME: number = 25;
  activity: string = "homework";
  time_state: boolean = false;
  maxTime: number = this.WORKTIME * 60;
  clipsPlayed: number = -1;
  clipTimes: number[] = [0];
  splashArt: string;
  clipSrcs: any[];
  chosenClip: number = 0;

  @ViewChild("videoPlayer") videoPlayer: ElementRef;
  @ViewChild("mainSlides", { read: IonSlides }) mainSlides: IonSlides;

  startTimer(duration_minutes: number): void {
    this.time_state = true;
    if (this.timerID) {
      // timer already running, stop it first
      clearInterval(this.timerID);
    }
    this.timer = duration_minutes * 60;
    this.updateTime();
    this.timerID = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  startWork(): void {
    this.clipsPlayed = -1;
    this.startTimer(this.WORKTIME);
    let count = 0;
    while (count < this.maxTime) {
      count += Math.floor(Math.random() * 40) + 280; // every 280-320 seconds video should play
      this.clipTimes.push(count);
    }
    console.log("play times are: ", this.clipTimes);
  }

  stopTimer(): void {
    clearInterval(this.timerID);
    this.display_time.next("00:00");
    this.time_state = false;
  }

  updateTime(): void {
    let minutes: number = Math.floor(this.timer / 60);
    let seconds: number = this.timer % 60;

    let result_string =
      String("0" + minutes).slice(-2) + ":" + String("0" + seconds).slice(-2);
    this.display_time.next(result_string);

    this.requestVideo(this.display_time.getValue());

    if (!--this.timer) {
      this.resting = !this.resting;
      if (this.resting) {
        // rest time
        this.maxTime = this.RESTTIME * 60;
        this.startTimer(this.RESTTIME);
      } else {
        this.maxTime = this.WORKTIME * 60;
        this.stopTimer();
      }
    }
  }

  changeSource(index): void {
    console.log(`Current index: ${1}, video: ${this.clipSrcs[index].src}`);
    this.videoPlayer.nativeElement.src = this.clipSrcs[index].src;
    this.videoPlayer.nativeElement.load();
  }

  async playVideo(): Promise<void> {
    console.log(this.chosenClip);
    this.chosenClip = this.dataSvce.getRandomClipId();
    this.changeSource(this.chosenClip);
    await this.mainSlides.lockSwipes(false);
    await this.mainSlides.slideNext();
    await this.mainSlides.lockSwipes(true);
    this.videoPlayer.nativeElement.play();
  }

  endVideo(): void {
    this.mainSlides.lockSwipes(false);
    this.mainSlides.slidePrev();
    this.mainSlides.lockSwipes(true);
    console.log("event listened to yo");
  }

  requestVideo(currTime: string): void {
    console.log(this.maxTime, this.timer, this.clipsPlayed);
    if (this.resting) {
      this.playVideo();
    } else if (
      this.maxTime - this.timer >=
      this.clipTimes[this.clipsPlayed + 1]
    ) {
      this.playVideo();
      this.clipsPlayed++;
    }
  }

  /*goSettings() {
    this.navCtrl.navigateForward(["/settings"]);
  }*/

  async goSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
    let data = (await modal.onWillDismiss()).data;
    if (data.saveData) {
      this.dataSvce.firstInit = false;
      this.ngOnInit();
    }
  }

  async ngOnInit() {
    console.log("Home page loaded");
    if (this.dataSvce.firstInit) await this.goSettings();
    this.clipSrcs = this.dataSvce.getAllClips();
    this.splashArt = this.dataSvce.getSelectedSplash();
    this.activity = this.dataSvce.getActivity();
    this.display_time.subscribe(this.requestVideo);
  }

  ngAfterContentInit() {
    setTimeout(() => {
      this.mainSlides.lockSwipes(true);
      this.videoPlayer.nativeElement.addEventListener("ended", this.endVideo);
      //this.changeSource(0);
    }, 300);
  }

  constructor(
    private navCtrl: NavController,
    private dataSvce: CharacterService,
    private modalCtrl: ModalController
  ) {
    console.log("I am up to date");
  }
}
