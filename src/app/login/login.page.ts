import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseService } from '../services/firebase.service';
import { HTTP } from '@ionic-native/http/ngx';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
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
        private http: HTTP,
        private alert: AlertController,
        private auth: AuthService,
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
        await this.showLoader('Please wait!');
        this.http.post(API_URL, { phone: this.phone }, {}).then(response => {
            console.log({ response })
            if (response.data === true) {
                this.showLoader({ message: 'Looking up, please wait!' })
                this.http.post(API_URL + START_VERIFY, { phone: this.phone }, {}).then(function (response) {
                    this.hideLoader();
                    this.text = 'Enter your verification code';
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                this.step = 'login';
                this.text = 'Enter your PIN';
                this.hideLoader();
            }
        }).catch(async err => {
            await this.alert.create({
                header: 'User does not exist',
                message: 'This is an alert messagePlease try again.',
                buttons: ['OK']
            });

        })

        setTimeout(() => {
            // allow menu
            this.loginScreenChanges(true);
            this.hideLoader();
            this.navCtrl.navigateForward('home');
        }, 4000)
    }

    loginUser() {
        this.showLoader({ message: 'Please wait!' })

        // Get user UID
        this.http.post(API_URL + START_ACTIVATE, { phone: this.phone }, {})
            .then((response) => {
                console.log({ response });

                this.firebase.getUserDetails(response.data).then(user => {
                    this.auth.doLogin({ email: user.email, password: this.password }).then(function (userObj) {

                        // Get current user profile
                        this.firebase.getCurrentUser(userObj.uid).then(function (profile) {
                            this.step = 'phone';
                            this.text = 'Enter your phone number';
                            this.phone = '';
                            this.password = '';

                            // $rootScope.user = profile;
                            this.hideLoader();
                            this.navCtrl.navigateForward('experiences');

                        }).catch(async err => {
                            console.log(err);
                            this.hideLoader();
                            await this.alert.create({
                                header: 'Issue getting your profile',
                                message: 'Please try again.'
                            });
                        });
                    }).catch(async err => {
                        console.log(err);
                        this.hideLoader();
                        await this.alert.create({
                            header: 'PIN is incorrect',
                            message: 'Please try again.'
                        });
                    })
                })
                    .catch(function (err) {
                        console.log(err);
                    })

            }).catch(function (err) {
                console.log(err);
            });
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
