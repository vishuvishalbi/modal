import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
@Injectable({
    providedIn: 'root'
})
export class FirebaseService {
    public orders = {};
    private snapshotChangesSubscription: any;
    private userNames: any = {};
    private currentOrder: any;
    constructor(
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        public fbn: FirebaseAuthentication
    ) { }

    getUsers() {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref('users').on('value', (resp) => {
                console.log({ users: resp })
                resolve(this.snapshotToObject(resp));
            });
        })
    }

    getUserDetails(id) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(`users/${id}`).on('value', (resp) => {
                resolve(this.snapshotToObject(resp));
            });
        })
    }

    getUserByPhone(phone) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref('users')
                .orderByChild('phone')
                .equalTo(phone)
                .on('value', userSnapshot => {
                    let user = userSnapshot.val();
                    if (user) {
                        resolve(user);
                    } else {
                        reject('User not found');
                    }
                    console.log('user', user)
                })
        })
    }

    getOrders() {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref('orders').on('value', (resp) => {
                resolve(this.snapshotToObject(resp));
            });
        })
    }

    getOrderDetails(id) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(`orders/${id}`).on('value', (resp) => {
                resolve(this.snapshotToObject(resp));
            });
        })
    }

    getUserOrdersByUserId(id) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(`orders/`).orderByChild('createdBy').equalTo(id).on('value', (resp) => {
                let result = this.snapshotToObject(resp);
                let t = { user: {}, key: '' };

                Object.keys(result).map((v) => {
                    if (typeof result[v] != 'object') {
                        return;
                    }

                    t = Object.assign({ user: {}, key: '' }, result[v]);
                    console.log('track', t)
                    t.user = this.getUserName(result[v].createdBy);
                    t.key = v;
                    this.orders[t.key] = t;
                });
                resolve(this.orders);
            })
        })
    }

    getUserName(id) {
        if (!!this.userNames[id]) {
            return this.userNames[id];
        }
        this.getUserDetails(id).then(user => {
            this.userNames[id] = user;
            return user;
        })

    }

    snapshotToObject(snapshot) {
        let item = snapshot.val();
        console.log('item', item)
        console.log('snapshot', snapshot)
        if (typeof snapshot == 'object' && snapshot.hasOwnProperty('key')){
            item.key = snapshot.key;
        }
        return item;
    }


    unsubscribeOnLogOut() {
        //remember to unsubscribe from the snapshotChanges
        this.snapshotChangesSubscription.unsubscribe();
    }

    encodeImageUri(imageUri, callback) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            var aux: any = this;
            c.width = aux.width;
            c.height = aux.height;
            ctx.drawImage(img, 0, 0);
            var dataURL = c.toDataURL("image/jpeg");
            callback(dataURL);
        };
        img.src = imageUri;
    };

    uploadImage(imageURI, randomId) {
        return new Promise<any>((resolve, reject) => {
            let storageRef = firebase.storage().ref();
            let imageRef = storageRef.child('image').child(randomId);
            this.encodeImageUri(imageURI, function (image64) {
                imageRef.putString(image64, 'data_url')
                    .then(snapshot => {
                        snapshot.ref.getDownloadURL()
                            .then(res => resolve(res))
                    }, err => {
                        reject(err);
                    })
            })
        })
    }

    async getCurrentUser() {
        return new Promise<any>((resolve, reject) => {
            this.fbn.onAuthStateChanged().subscribe(user => {
                if (user) {
                    console.log('user ', user);
                    resolve(user);
                    return;
                }
                reject('User not found!');
            }, err => {
                console.log('error', err);
                reject('User not found!');
            })
        })
    }

    async getOrderById(id) {
        console.log('getOrderbyId', id, this.orders)
        if (this.orders.hasOwnProperty(id)) {
            this.currentOrder = this.orders[id];
            return this.currentOrder;
        }

        let order = await this.getOrderDetails(id);
        console.log('found order', order);
        return order;
    }

    async getCurrentOrder() {
        return this.currentOrder;
    }

    async getCurrentOrders() {
        return this.orders;
    }

    async getVehicleById(id) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(`vehicles/${id}`).on('value', (resp) => {
                resolve(this.snapshotToObject(resp));
            });
        })
    }

    async getPassengers(id) {
        return new Promise<any>((resolve, reject) => {
            firebase.database().ref(`passengers/`).orderByChild('orderId').equalTo(id).on('value', (resp) => {
                resolve(this.snapshotToObject(resp));
            });
        })
    }

    async setPassengers(passengerData) {
        return new Promise<any>((resolve, reject) => {
            var newPassengerKey = firebase.database().ref().child('passengers').push().key;
            var passengerUpdates = {};
            passengerUpdates['/passengers/' + newPassengerKey] = passengerData;

            firebase.database().ref().update(passengerUpdates).then(function (x) {
                console.log('Added contact');
                resolve(x)
            });

        })
    }
}
