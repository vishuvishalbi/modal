import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { AngularFireAuth } from '@angular/fire/auth';
import { isNull } from 'util';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private snapshotChangesSubscription: any;
  private userNames: any = {};
  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth
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

  getUserOrders(id) {
    return new Promise<any>((resolve, reject) => {
      firebase.database().ref(`orders/`).orderByChild('createdBy').equalTo(id).on('value', (resp) => {
        let result = this.snapshotToObject(resp);
        let orders = []
        let t = { user: {}, key :'' };

        Object.keys(result).map((v) => {
          if (typeof result[v] != 'object') {
            return;
          }
          t = Object.assign({ user: {}, key:'' }, result[v]);
          t.user = this.getUserName(result[v].createdBy);
          t.key = v;
          orders.push(result[v]);
        });
        console.log({ orders })
        resolve(orders);
      });
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
    item.key = snapshot.key;
    return item;
  }


  // getTasks() {
  //   return new Promise<any>((resolve, reject) => {
  //     this.afAuth.user.subscribe(currentUser => {
  //       if (currentUser) {
  //         this.snapshotChangesSubscription = this.afs.collection('people').doc(currentUser.uid).collection('tasks').snapshotChanges();
  //         resolve(this.snapshotChangesSubscription);
  //       }
  //     })
  //   })
  // }

  // getTask(taskId) {
  //   return new Promise<any>((resolve, reject) => {
  //     this.afAuth.user.subscribe(currentUser => {
  //       if (currentUser) {
  //         this.snapshotChangesSubscription = this.afs.doc<any>('people/' + currentUser.uid + '/tasks/' + taskId).valueChanges()
  //           .subscribe(snapshots => {
  //             resolve(snapshots);
  //           }, err => {
  //             reject(err)
  //           })
  //       }
  //     })
  //   });
  // }

  unsubscribeOnLogOut() {
    //remember to unsubscribe from the snapshotChanges
    this.snapshotChangesSubscription.unsubscribe();
  }

  // updateTask(taskKey, value) {
  //   return new Promise<any>((resolve, reject) => {
  //     let currentUser = firebase.auth().currentUser;
  //     this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).set(value)
  //       .then(
  //         res => resolve(res),
  //         err => reject(err)
  //       )
  //   })
  // }

  // deleteTask(taskKey) {
  //   return new Promise<any>((resolve, reject) => {
  //     let currentUser = firebase.auth().currentUser;
  //     this.afs.collection('people').doc(currentUser.uid).collection('tasks').doc(taskKey).delete()
  //       .then(
  //         res => resolve(res),
  //         err => reject(err)
  //       )
  //   })
  // }

  // creaß

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
}
