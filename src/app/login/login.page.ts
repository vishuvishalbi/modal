import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController, NavController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    // encapsulation: ViewEncapsulation.None
})
export class LoginPage {

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
        private screenOrientation: ScreenOrientation,
        private navCtrl:NavController,
    ) {
        // get current
        console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

        // set to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);

        // detect orientation changes
        this.screenOrientation.onChange().subscribe(
            () => {
                console.log("Orientation Changed");
            }
        );
        this.menu.enable(false);

    }

    clicked(number) {
        this.phone += '' + number;
    }

    delete() {
        this.phone.substring(0, this.phone.length - 1);
    }

    async lookupUser() {
        await this.showLoader('Please wait!');
        setTimeout(()=> {
            // allow menu
            this.menu.enable(true);
            // allow user rotate
            this.screenOrientation.unlock();
            this.hideLoader();
            this.navCtrl.navigateForward('home');
        },4000)
    }

    loginUser() {

    }

    endVerify() {

    }

    confirmPin() {

    }

    changePassword() {
            
    }

    async showLoader(message) {
        this.l = await this.loader.create({
            message
        });
        this.l.present();

    }

    hideLoader(){
        this.l.dismiss();
    }
}
