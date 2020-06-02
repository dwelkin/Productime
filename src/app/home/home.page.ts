import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { RoundProgressComponent } from "angular-svg-round-progressbar";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
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

  playVideo(): void {
    console.log("i am not working");
  }

  requestVideo(currTime: string): void {
    let clipInterval: number = Math.floor(this.timer / 300);
    if (this.resting) {
      this.playVideo();
    } else if (clipInterval > this.clipsPlayed) {
    }
  }
  constructor() {
    this.display_time.subscribe(this.requestVideo);
    console.log("I am up to date");
  }
}
