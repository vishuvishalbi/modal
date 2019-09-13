import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseService } from '../_services/firebase.service';
import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services/authentication.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
let { API_URL, START_VERIFY, START_ACTIVATE } = environment;
import * as firebase from "firebase/app";

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
    public password:number;
    public step = 'phone';
    public newUser = {};
    public userObj = {};
    public step1 = true;
    private l: any;
    private recaptchaVerifier: any;
    private id:any;
    constructor(
        private menu: MenuController,
        private loader: LoadingController,
        private screenOrientation: ScreenOrientation,
        private navCtrl: NavController,
        private firebaseService: FirebaseService,
        private alert: AlertController,
        private auth: AuthenticationService,
        private fbn: FirebaseAuthentication
    ) {
        this.loginScreenChanges();
        // this.firebaseService.getCurrentUser();
        // setTimeout(() => {

        //     this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
        //         'size': 'invisible',
        //         'callback': function (response) {
        //             console.log('recaptcha', response)
        //             // reCAPTCHA solved, allow signInWithPhoneNumber.
        //         }
        //     });
        // }, 1000);
        // this.fbn.verifyPhoneNumber('+91'+ this.phone,3000).then(console.log).catch(console.error);
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
        this.fbn.verifyPhoneNumber("+91"+this.phone,2).then(id => {
            this.id = id;
            this.step = "code";
            this.text = 'enter otp';
        }).catch(console.log)

    }

    verify() {

        this.fbn.signInWithVerificationId(this.id,this.password).then(result=> {
            this.step="confirmPin";
            this.text="Please enter new pin"
        })
        .catch(err => {

        });
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
