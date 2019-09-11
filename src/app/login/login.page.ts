import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseService } from '../_services/firebase.service';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';
let { API_URL, START_VERIFY, START_ACTIVATE } = environment;

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
        private navCtrl: NavController,
        private firebase: FirebaseService,
        private alert: AlertController,
        private auth: AuthenticationService,
    ) {
        this.loginScreenChanges();
        this.firebase.getCurrentUser()
    }

    loginScreenChanges(opposite = false) {
        if (opposite) {
            //  enable menu
            this.menu.enable(true);
            // allow user rotate
            this.screenOrientation.unlock();
            return;
        }
        // get current
        console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'

        // set to landscape
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
        // detect orientation changes
        this.screenOrientation.onChange().subscribe(() => {
            console.log("Orientation Changed");
        });
        this.menu.enable(false);

    }

    clicked(number) {
        if (this.phone.length < 10) {
            this.phone += '' + number;
        }
    }

    delete() {
        if (this.phone.length < 10) {
            this.phone.substring(0, this.phone.length - 1);
        }
    }

    async lookupUser() {


        this.auth.lookupUser(this.phone).subscribe(result => {

            if (result) {
                this.auth.sendOtp(this.phone).subscribe(res => {
                    this.step = result.step;
                    this.text = result.text;
                });
            }
            console.log('looking up', result)
        }, err => {
            console.error('error', err)
        });
    }

    loginUser() {
        this.auth.login(this.phone, this.password)
            .subscribe(response => {
                console.log('getting response', response)
            }, console.log);
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

    hideLoader() {
        this.l.dismiss();
    }
}
