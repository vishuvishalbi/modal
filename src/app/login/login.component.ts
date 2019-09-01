import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  public phone = '';
  public text = 'Enter your phone number';
  public code = '';
  public pin = '';
  public pinConfirm = '';
  public password = '';
  public step = 'phone';
  public newUser = {};
  public userObj = {};
  public step1 = true;
  private l: any;

  constructor(
    private menu: MenuController,
    private loader: LoadingController,
    private screenOrientation: ScreenOrientation
  ) {
    // get current
    console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);

    // allow user rotate
    // this.screenOrientation.unlock();

    // detect orientation changes
    this.screenOrientation.onChange().subscribe(
      () => {
        console.log("Orientation Changed");
      }
    );
    this.menu.enable(false);
    this.initiateLoader();

    // $('li').click(function () {
    //   console.log("clicked");

    //   if ($(this).hasClass('hide')) {
    //     return false;
    //   }

    //   if (this.step === 'code') {

    //     if (!$(this).text()) {
    //       this.code = this.code.substring(0, this.code.length - 1);
    //     }
    //     if (this.code.length < 4) {
    //       this.code = this.code + $(this).text();
    //       this.$apply();
    //     }

    //   } else if (this.step === 'phone') {

    //     if (!$(this).text()) {
    //       this.phone = this.phone.substring(0, this.phone.length - 1);
    //     }
    //     if (this.phone.length < 10) {
    //       this.phone = this.phone + $(this).text();
    //       this.$apply();
    //     }
    //   } else if (this.step === 'pin') {

    //     if (!$(this).text()) {
    //       this.pin = this.pin.substring(0, this.pin.length - 1);
    //     }
    //     if (this.pin.length < 6) {
    //       this.pin = this.pin + $(this).text();
    //       this.$apply();
    //     }
    //   } else if (this.step === 'confirmPin') {

    //     if (!$(this).text()) {
    //       this.pinConfirm = this.pinConfirm.substring(0, this.pinConfirm.length - 1);
    //     }
    //     if (this.pinConfirm.length < 6) {
    //       this.pinConfirm = this.pinConfirm + $(this).text();
    //       this.$apply();
    //     }
    //   } else if (this.step === 'login') {

    //     if (!$(this).text()) {
    //       this.password = this.password.substring(0, this.password.length - 1);
    //     }
    //     if (this.password.length < 6) {
    //       this.password = this.password + $(this).text();
    //       this.$apply();
    //     }
    //   }

    // });
  }

  clicked(number) {
    this.phone += '' + number;
  }

  delete() {
    this.phone.substring(0, this.phone.length - 1);
  }

  lookupUser() {
    this.l.present();
  }

  async initiateLoader() {
    this.l = await this.loader.create({
      message: 'Please wait'
    })

  }
}
