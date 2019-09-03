import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    encapsulation: ViewEncapsulation.None
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
