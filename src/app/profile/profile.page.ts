import { Component, OnInit } from '@angular/core';
import * as firebase from "firebase/app";
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx'
import { NavController, AlertController } from '@ionic/angular';
// import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
// import { FilestackService } from "@filestack/angular";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage  {
    private edit = false;
    private card = {
        "object": "card"
    };
    public user: any ={
        name:'',
        email:'',
        phone:'',
    };
    private touchIdVal: any = { checked: false };
    private data: any;
    private tab = 'general';

    constructor(
        private fbn: FirebaseAuthentication,
        private navigate: NavController,
        private alert: AlertController,
        // private camera: Camera,
        // private filestackService: FilestackService
    ) {
        // this.filestackService.init('AsY2bRazJS3SAeMrDOclaz')
        this.fbn.onAuthStateChanged()
            .subscribe(userInfo => {
                if (userInfo && userInfo.hasOwnProperty('role')) {
                    this.user = userInfo;
                    // user was signed in
                    console.log('user was signed in', userInfo);
                } else {
                    // user was signed out
                    this.navigate.navigateForward('/login');
                    console.log('user was signed out')
                }
            });

        if (localStorage.getItem('savedUser')) {
            this.touchIdVal = { checked: true };
        }
    }

    ionicViewEnter() {
        // this.user = $rootScope.user;
    }



    toggleEdit() {
        this.edit = !this.edit;
    }


    selectTab(input) {
        this.tab = input;
    }

    touchIdtouchId(val) {
        setTimeout(() => {
            if (this.touchIdVal.checked === true) {
                this.showPopup();
            } else {
                localStorage.setItem('savedUser', 'false');
            }
        }, 0);
    }

    showPopup() {
        this.data = {};

        // An elaborate, custom popup
        this.alert.create({
            header: 'Enter Your Password',
            message: 'Please enter your password',
            inputs: [
                {
                    type: 'password',
                    name: 'password'
                }
            ],
            buttons: [
                { text: 'Cancel' },
                {
                    text: '<b>Save</b>',
                    handler: (data) => {
                        // this.data.userPassword;
                        localStorage.setItem('savedUser', JSON.stringify({
                            "identifier": this.user.phone,
                            "password": data.password
                        }));
                    }
                }
            ]
        }).then(popup => popup.present());
    };

    profilePhoto() {
        this.alert.create({
            header: 'Modal',
            message: 'Modal needs access to your photos so you can include them in your profile.',
            buttons: [
                {
                    text: '<b>Camera</b>',
                    handler: () => {
                        this.addPhotos();
                    }
                },
                {
                    text: '<b>Library</b>',
                    handler: () => {
                        this.addPhotosFromLibrary();
                    }
                }
            ]
        });
    }

    addPhotos() {
        // let options: CameraOptions = {
        //     quality: 85,
        //     destinationType: this.camera.DestinationType.DATA_URL,
        //     sourceType: this.camera.PictureSourceType.CAMERA,
        //     allowEdit: true,
        //     encodingType: this.camera.EncodingType.JPEG,
        //     targetWidth: 100,
        //     targetHeight: 100,
        //     saveToPhotoAlbum: false,
        //     correctOrientation: true
        // };
        // let uuid = this.guid();
        // this.camera.getPicture(options).then((imageData) => {
        //     let filestackOptions = {
        //         imageQuality: 85,
        //         mimetype: 'image/*',
        //         filename: uuid + '.jpg',
        //         base64decode: true
        //     }
        //     // this.filestackService.upload(imageData).subscribe((fileData:any) => {
        //     //     console.log('Image uploaded', fileData);
        //     //     var newMediaKey = firebase.database().ref().child('media').push().key;
        //     //     var updates = {};
        //     //     updates['media/profiles/' + this.user.uid + '/' + newMediaKey + '/url/'] = fileData.url;
        //     //     updates['users/' + this.user.id + '/profileImgUrl'] = fileData.url;
        //     //     firebase.database().ref().update(updates).then(function (x) {
        //     //         console.log('Image uploaded successfully');
        //     //         this.user.profileImgUrl = fileData.url;
        //     //     });
        //     // }
        //     // );
        // }, function (err) {
        //     // error
        // });
    }

    updateName(name) {
        var updates = {};
        updates['users/' + this.user.id + '/name'] = name;
        // updates['users/-KSmYyOSzKh5b2sDmmC5/name'] = name;
        firebase.database().ref().update(updates).then(function () {
            console.log('Updated name to: ' + name);
        });
    }

    addPhotosFromLibrary() {
        // var options = {
        //     quality: 50,
        //     destinationType: this.camera.DestinationType.DATA_URL,
        //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        //     allowEdit: true,
        //     encodingType: this.camera.EncodingType.JPEG,
        //     // popoverOptions: ,
        //     saveToPhotoAlbum: false,
        //     correctOrientation: true
        // };

        // this.camera.getPicture(options).then(function (imageData) {

        //     var uuid = this.guid();
        //     // this.filestackService.upload(
        //     //     imageData, {
        //     //     imageQuality: 85,
        //     //     mimetype: 'image/*',
        //     //     filename: uuid + '.jpg',
        //     //     base64decode: true
        //     // },
        //     //     function (new_blob) {
        //     //         console.log('Image uploaded', new_blob);
        //     //         var newMediaKey = firebase.database().ref().child('media').push().key;

        //     //         var updates = {};
        //     //         updates['media/profiles/' + this.user.uid + '/' + newMediaKey + '/url/'] = new_blob.url;
        //     //         updates['users/' + this.user.id + '/profileImgUrl'] = new_blob.url;
        //     //         firebase.database().ref().update(updates).then(function (x) {
        //     //             console.log('Image uploaded successfully');
        //     //             this.user.profileImgUrl = new_blob.url;

        //     //             var passengersRef = firebase.database().ref('passengers');
        //     //             var passengersQuery = passengersRef.orderByChild('phone').equalTo(this.user.phone)
        //     //             // var passengersArray = $firebaseArray(passengersQuery);

        //     //             // passengersArray.$loaded().then(function () {
        //     //             //     setTimeout(function () {
        //     //             //         passengersArray.forEach(function (i, e) {
        //     //             //             var passengerUpdates = {};
        //     //             //             passengerUpdates['/passengers/' + i.$id + '/profileImgUrl'] = new_blob.url;
        //     //             //             firebase.database().ref().update(passengerUpdates).then(function (x) {
        //     //             //                 console.log('Updated profile photo');
        //     //             //             });
        //     //             //         });
        //     //             //     });
        //     //             // });
        //     //         });
        //     //     }
        //     // );
        // }, function (err) {
        //     // error
        // });
    }



    // showCardModal(index) {
    //     this.cardIndex = index;
    //     this.cardModal.show();
    // }

    // closeCardModal() {
    //     this.cardModal.hide();
    // }

    // showChargesModal() {
    //     this.getCharges();
    //     this.chargesModal.show();
    // }

    // closeChargesModal() {
    //     this.chargesModal.hide();
    // }

    showModal() {
        // this.modal.show();
        // $(function () {
        //     $('#ccNum').payment('formatCardNumber');
        //     $('#ccCvc').payment('formatCardCVC');
        //     $('#ccExp').payment('formatCardExpiry');
        // });
    }

    addCard(card) {

        // var expiration = $('#ccExp').payment('cardExpiryVal');

        // $http({
        //     method: 'POST',
        //     url: 'http://159.203.97.57/api/stripe/createCard',
        //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //     transformRequest: function (obj) {
        //         var str = [];
        //         for (var p in obj) {
        //             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        //         }
        //         return str.join("&");
        //     },
        //     data: { "customerId": this.user.customerId, "number": card.number, "exp_year": (expiration.year || 0), "exp_month": (expiration.month || 0), "cvc": $('#ccCvc').val() }
        // }).then(function (res) {
        //     console.log(res);
        //     this.modal.hide();
        // }).catch(function (data) {
        //     console.log(data);
        // });
    }

    removeCard(cardId) {
        // var confirmPopup = $ionicPopup.confirm({
        //     title: 'Remove card',
        //     template: 'Are you sure you want to remove this card?'
        // });

        // confirmPopup.then(function (res) {
        //     if (res) {

        //         $http({
        //             method: 'POST',
        //             url: 'http://159.203.97.57/api/stripe/removeCard',
        //             headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        //             transformRequest: function (obj) {
        //                 var str = [];
        //                 for (var p in obj) {
        //                     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        //                 }
        //                 return str.join("&");
        //             },
        //             data: { "customerId": this.user.sCustomerId, "cardId": cardId }
        //         }).then(function (res) {
        //             console.log(res);
        //             this.cardModal.hide();
        //         }).catch(function (data) {
        //             console.log(data);
        //         });
        //     } else {
        //         this.cardModal.hide();
        //     }
        // });
    }

    closeModal() {
        // this.selectedContacts = [];
        // this.modal.hide();
    };

    getCharges() {

        // if (this.user.customerId) {
        //     $http({
        //         method: 'POST',
        //         url: $rootScope.apiUrl + '/stripe/customerCharges',
        //         headers: { 'Content-Type': 'application/json' },
        //         data: {
        //             customerId: this.user.customerId
        //         }
        //     }).then(function (res) {

        //         var charges = res.data.data;

        //         this.charges = [];

        //         for (var i = 0; i < charges.length; i++) {

        //             var charge = charges[i];

        //             orders.getOrderById(charges[i].metadata.order_id).then(function (orderObj) {
        //                 var obj = {
        //                     "charge": charge,
        //                     "order": orderObj
        //                 }
        //                 this.charges.push(obj);
        //                 console.log(this.charges);
        //             });
        //         }



        //     }).catch(function (data) {
        //         console.log(data);
        //     });
        // }
    }

    s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    guid() {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
    }
}
