import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { FirebaseService } from './firebase.service';
import * as firebase from 'firebase/app';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

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

    lookupUser(phone) {
        return this.http.post<any>(`${environment.API_URL}/lookupUser`, { phone: phone })
            .pipe(switchMap((respo: any) => {

                if (respo) {
                    let responseObject = { step: 'phone', message: 'user dosen\'t exists something', status: false }
                    return this.http.post(`${environment.API_URL}/authy/startVerify`, { phone })
                        .pipe(tap((res: any) => {
                            if (res.success) {
                                res = { step: 'code', message: 'Enter your verification code', status: true };
                            } else {
                                return responseObject
                            }
                        }, err => {
                            console.log('error on authy startverify', err);
                            return responseObject
                        }));
                } else {
                    return { step: 'login', message: 'Enter you pin', status: true };
                }
            }), catchError(err => {
                return err;
            }));

    }

    login(phone, password) {
        const headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this.http.post<any>(`${environment.API_URL}/startActivate`, { phone: Number(phone) }, { headers, responseType: 'text' })
            .pipe(tap(response => {
                // return response;
                console.log('response', response)
                this.firebaseService.getUserDetails(response)
                    .then(user => {
                        firebase.auth().signInWithEmailAndPassword(user.email, password)
                            .then(function (userObj: any) {

                                // Get current user profile
                                this.firebaseService.getCurrentUser(userObj.uid).then(function (profile) {
                                    return { step: 'phone', message: 'Enter your phone number', status: true }
                                    // this.navCtrl.navigateForward('experiences');
                                }).catch(async err => {
                                    console.log('service error1', err)
                                    return { step: 'phone', message: 'Enter your phone number', status: false }
                                });
                            }).catch(err => {
                                console.log('service error2', err)
                                return { step: 'phone', message: 'Enter your phone number', status: false }
                            })
                    })
                    .catch(function (err) {
                        console.log('service error3', err)
                        return { step: 'phone', message: 'Enter your phone number', status: false }
                    })
            }, error => {
                return { error, status: false };
            }));

        return this.http.post<any>(`${environment.API_URL}/startActivate`, { phone })
            .pipe(map(response => {
                console.log('response', response)
                return response;
                this.firebaseService.getUserDetails(response)
                    .then(user => {
                        firebase.auth().signInWithEmailAndPassword(user.email, password)
                            .then(function (userObj: any) {

                                // Get current user profile
                                this.firebaseService.getCurrentUser(userObj.uid).then(function (profile) {
                                    return { step: 'phone', message: 'Enter your phone number', status: true }
                                    // this.navCtrl.navigateForward('experiences');
                                }).catch(async err => {
                                    console.log('service error1', err)
                                    return { step: 'phone', message: 'Enter your phone number', status: false }
                                });
                            }).catch(err => {
                                console.log('service error2', err)
                                return { step: 'phone', message: 'Enter your phone number', status: false }
                            })
                    })
                    .catch(function (err) {
                        console.log('service error3', err)
                        return { step: 'phone', message: 'Enter your phone number', status: false }
                    })

            }, err => {

                console.log('service error4', err)
                return { step: 'phone', message: 'Enter your phone number', status: false }
            }))
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