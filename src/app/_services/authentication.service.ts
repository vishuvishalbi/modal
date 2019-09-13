import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { FirebaseService } from './firebase.service';
import * as firebase from 'firebase/app';
import { resolve } from 'q';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public confirmationResult: any;

    constructor(
        private http: HttpClient,
        private firebaseService: FirebaseService,

    ) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    lookupUser(phone, appVerifier) {

        
        return new Promise((resolve, reject) => {

            this.http.post<any>(`${environment.API_URL}/lookupUser`, { phone: phone }).subscribe(result1 => {
                if (result1) {
                    console.log('service lookupUser', result1);
                    this.sendOtp(phone, appVerifier).then(result2 => {
                        return resolve(result2);
                    });
                }
                resolve({ step: 'login', text: 'Enter your password' })
            }, err => {
                console.error(err)
                reject(err)
                return { step: 'login', text: 'Enter your password' }
            });
        });
    }

    sendOtp(phone, appVerifier) {
        return new Promise((resolve, reject) => {

            firebase.auth().signInWithPhoneNumber(phone, appVerifier)
                .then(function (confirmationResult) {
                    // SMS sent. Prompt user to type the code from the message, then sign the
                    // user in with confirmationResult.confirm(code).
                    this.confirmationResult = confirmationResult;
                    resolve({ step: 'code', text: 'Please enter your pin' })
                }).catch(function (error) {
                    // Error; SMS not sent
                    // ...
                    console.error(error);
                    reject({ step: 'phone', text: 'Enter your phone' })
                });
        })
    }

    verifyOtp(otp) {

        this.confirmationResult.confirm(otp).then(result => {
            console.log(result);
        }).catch(err => {
            console.error(err)
        });
    }



    login(phone, password) {
        // const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return new Promise((resolve, reject) => {


            this.http.post<any>(`${environment.API_URL}/startActivate`, { phone: Number(phone) })
                .subscribe(response => {
                    // return response;
                    console.log('response', response)
                    this.firebaseService.getUserDetails(response)
                        .then(user => {
                            firebase.auth().signInWithEmailAndPassword(user.email, password)
                                .then(function (userObj: any) {

                                    // Get current user profile
                                    this.firebaseService.getCurrentUser(userObj.uid).then(function (profile) {
                                        return { step: 'phone', text: 'Enter your phone number', status: true }
                                        // this.navCtrl.navigateForward('experiences');
                                    }).catch(async err => {
                                        console.log('service error1', err)
                                        return { step: 'phone', text: 'Enter your phone number', status: false }
                                    });
                                }).catch(err => {
                                    console.log('service error2', err)
                                    return { step: 'phone', text: 'Enter your phone number', status: false }
                                })
                        })
                        .catch(function (err) {
                            console.log('service error3', err)
                            return { step: 'phone', text: 'Enter your phone number', status: false }
                        })
                }, error => {
                    return { error, status: false };
                });
        })
    }

    handleError(err) {
        console.log('handle error', err)
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }
}