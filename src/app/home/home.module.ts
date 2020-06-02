import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";
import { HomePage } from "./home.page";
import { RoundProgressModule } from "angular-svg-round-progressbar";

import { HomePageRoutingModule } from "./home-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    RoundProgressModule,
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
