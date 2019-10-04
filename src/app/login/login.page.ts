import { Component, ViewEncapsulation } from '@angular/core';
import { MenuController, LoadingController, NavController, AlertController } from '@ionic/angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { FirebaseService } from '../_services/firebase.service';
import { AuthenticationService } from '../_services/authentication.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';

import * as firebase from "firebase/app";
import { UserService } from '../_services';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.css'],
    // encapsulation: ViewEncapsulation.None
})
export class LoginPage {

    public phone = '';
    public text = 'Enter your phone number';
    public code: any;
    public pin = '';
    public pinConfirm = '';
    public password = '';
    public step = 'phone';
    public newUser: any = {};
    public userObj = {};
    public usignout = false;
    private l: any;
    private recaptchaVerifier: any;
    private id: any;
    constructor(
        private menu: MenuController,
        private loader: LoadingController,
        private screenOrientation: ScreenOrientation,
        private navCtrl: NavController,
        private firebaseService: FirebaseService,
        private alert: AlertController,
        private auth: AuthenticationService,
        private fbn: FirebaseAuthentication,
        private userServices: UserService
    ) {
        this.loginScreenChanges();
        this.firebaseService.getCurrentUser();
        this.fbn.onAuthStateChanged()
            .subscribe(userInfo => {
                console.log('onAuthStateChanged > success', userInfo);
                if (userInfo) {
                    // user was signed in
                    console.log('user was signed in', userInfo);
                    this.loginScreenChanges(true);
                    this.navCtrl.navigateForward(['experiences']);
                } else if (!this.usignout) {
                    // this.signout();
                } else {
                    // user was signed out
                    console.log('user was signed out')
                }
            }, err => {
                console.log('onAuthStateChanged > error', err);

            });
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

    async lookupUser() {
        let x = await this.alert.create({
            header: 'Please wait!'
        });

        firebase
            .database()
            .ref('users')
            .orderByChild('phone')
            .equalTo(Number(this.phone))
            .on('value', async (result: any) => {
                this.userObj = result.val();
                console.log('this.userObj', this.userObj)
                if (this.userObj) {
                    this.newUser = this.userObj[Object.keys(this.userObj)[0]];
                    x.dismiss();
                    console.log(this.newUser, 'result', result.val())
                    if (['organizer', 'admin'].includes(this.newUser.role)) {
                        if (this.newUser.tmpPass) {
                            await this.sendOtp()
                            this.text = 'Enter your verification code';
                        } else {
                            this.step = "login";
                            this.text = "Enter your PIN!";
                        }

                    } else {
                        x.dismiss()
                        this.alert.create({
                            header: 'Opps!',
                            message: 'User not found!',
                            buttons: ['OK']
                        }).then(x => x.present());

                    }
                } else {
                    x.dismiss()
                    this.alert.create({
                        header: 'Opps!',
                        message: 'User not found!',
                        buttons: ['OK']
                    }).then(x => x.present());

                }

            })


    }

    async sendOtp() {
        let x = await this.alert.create({
            header: 'Sending Otp',
            message: 'please wait!'
        });
        x.present();
        console.log('sendOtp')
        this.fbn.verifyPhoneNumber("+1" + this.phone, 30000).then(id => {
            console.log('sendOtp > verifyPhoneNumber > then')
            this.id = id;
            this.text = 'Enter your verification code';
            console.log('verification id', id)
            this.step = "code";
            x.dismiss();
        }).catch(async err => {
            console.log('sendOtp > verifyPhoneNumber > catch')
            this.step = 'phone';
            this.text = 'Enter your phone number';
            x.dismiss();
            this.alert.create({
                header: 'Opps',
                message: 'please try again!',
                buttons: ['OK']
            }).then(x => x.present());
        })
    }

    async verify() {
        let x = await this.alert.create({
            header: 'Please wait!'
        });
        x.present();
        console.log('verify', this.id)
        this.fbn.signInWithVerificationId(this.id, Number(this.code)).then(result => {
            x.dismiss();
            console.log('verify > signInWithVerificationId > then')
            this.step = "pin";
            this.text = "Excellent! Now, Create your PIN"
        }).catch(async err => {
            console.log('verify > signInWithVerificationId > catch');
            console.log('error', err);
            x.dismiss();
            this.step = 'phone';
            this.text = 'Enter your phone number';
            this.alert.create({
                header: 'Verification code is incorrect',
                message: 'please try again!',
                buttons: ['OK']
            }).then(x => x.present());
        });
    }

    confirmPin() {
        this.step = "confirmPin";
        this.text = "Confirm your PIN";
    }

    async changePassword() {
        console.log('changesPassword')
        if (this.pin == this.pinConfirm) {
            console.log('changesPassword > validate')
            let key = Object.keys(this.userObj)[0];

            // firebase.database().ref('user/' + key).update({ tmpPass: null })
            //     .then(result => {
            //         this.password = this.pin;
            //         console.log('changesPassword > updatePassword > firebase > success');
            //         this.loginUser();
            //     }).catch(err => {
            //         console.log('changesPassword > updatePassword > firebase > err', err);
            //     })

            this.userServices.updatePassword({ uid: key, updates: { password: this.pin } }).subscribe(result => {
                console.log('changesPassword > updatePassword > subscribe')
                firebase.database().ref('users/' + key).update({ tmpPass: null })
                    .then(result => {
                        this.password = this.pin;
                        console.log('changesPassword > updatePassword > firebase > success');
                        this.loginUser();
                    }).catch(err => {
                        console.log('changesPassword > updatePassword > firebase > err', err);
                    })
            }, err => {
                console.log('changesPassword > updatePassword > error')
                this.alert.create({
                    header: 'Opps!',
                    message: 'please try again!',
                    buttons: ['OK']
                }).then(x => x.present());
            })
        } else {
            this.step = "pin";
            this.text = "Excellent! Now, Create your PIN"
            this.alert.create({
                header: 'PINs do not match',
                message: 'please try again!',
                buttons: ['OK']
            }).then(x => x.present());
        }
    }

    loginUser() {
        console.log('loginUser', this.newUser, this.password);

        this.fbn.signInWithEmailAndPassword(this.newUser.email, this.password)
            .then(result => {
                console.log('loginUser > signInWithEmailAndPassword > success');
                this.step = 'phone';
                this.text = 'Enter your phone number';
                this.phone = '';
                this.password = '';
                this.loginScreenChanges(true);
                this.navCtrl.navigateForward(['experiences']);
            })
            .catch(err => {
                console.log('loginUser > signInWithEmailAndPassword > err');
                console.log('err', err);
                this.alert.create({
                    header: 'Opps!',
                    message: 'please try again later!',
                    buttons: ['OK']
                }).then(x => x.present());
            })
    }

    async showLoader(options) {
        this.loader.create(options).then(l => {
            this.l = l;
            this.l.present();
        })
    }

    hideLoader() {
        this.l.dismiss();
    }

    signout() {
        this.fbn.signOut();
        this.usignout = true;
    }
}
