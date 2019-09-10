import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { FirebaseService } from './firebase.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebaseService: FirebaseService,
    public afAuth: AngularFireAuth
  ) { }

  doRegister(value) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  doLogin({ email, password }) {
    return new Promise<any>((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(
          res => resolve(res),
          err => reject(err))
    })
  }

  // loginUser() {
  //   this.showLoader({ message: 'Please wait!' })

  //   // Get user UID
  //   this.http.post(API_URL + START_ACTIVATE, { phone: this.phone }, {})
  //     .then((response) => {
  //       console.log({ response });

  //       this.firebase.getUserDetails(response.data).then(user => {
  //         this.auth.doLogin({ email: user.email, password: this.password }).then(function (userObj) {

  //           // Get current user profile
  //           this.firebase.getCurrentUser(userObj.uid).then(function (profile) {
  //             this.step = 'phone';
  //             this.text = 'Enter your phone number';
  //             this.phone = '';
  //             this.password = '';

  //             // $rootScope.user = profile;
  //             this.hideLoader();
  //             this.navCtrl.navigateForward('experiences');

  //           }).catch(async err => {
  //             console.log(err);
  //             this.hideLoader();
  //             await this.alert.create({
  //               header: 'Issue getting your profile',
  //               message: 'Please try again.'
  //             });
  //           });
  //         }).catch(async err => {
  //           console.log(err);
  //           this.hideLoader();
  //           await this.alert.create({
  //             header: 'PIN is incorrect',
  //             message: 'Please try again.'
  //           });
  //         })
  //       })
  //         .catch(function (err) {
  //           console.log(err);
  //         })

  //     }).catch(function (err) {
  //       console.log(err);
  //     });
  // }


  doLogout() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signOut()
        .then(() => {
          this.firebaseService.unsubscribeOnLogOut();
          resolve();
        }).catch((error) => {
          console.log(error);
          reject();
        });
    })
  }
}
