import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Platform, ModalController, ToastController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../_services/firebase.service';
import { ContactsPage } from '../contacts/contacts.page';
import { ThrowStmt } from '@angular/compiler';

@Component({
    selector: 'app-guests',
    templateUrl: './guests.page.html',
    styleUrls: ['./guests.page.scss'],
})
export class GuestsPage {

    public everybody: any;
    public currentTab = 1;
    public count: any;
    public id: any;
    public order: any;
    public organizer: any;
    public guests: any = {};
    public invited: any = [];
    public user: any;
    public selectedUsers: any;
    public selectedContacts: any = {};
    private l: any;

    constructor(
        private platform: Platform,
        public contacts: Contacts,
        public firebaseService: FirebaseService,
        private modalController: ModalController,
        private toastController: ToastController,
        private loadingController: LoadingController,
    ) {
        this.id = location.pathname.split('/')[2];
        this.init();
        this.platform.ready().then(() => {
        });

    }

    async showContacts() {
        const modal = await this.modalController.create({
            component: ContactsPage
        });
        await modal.present();
        let { data } = await modal.onDidDismiss();
        //console.log('data disimiss', data)

        if (Object.keys(data).length && data.hasOwnProperty('selectedContacts') && Object.keys(data.selectedContacts).length) {
            this.selectedContacts = data.selectedContacts;
            this.sendInvites();
        }
    }

    async init() {
        try {
            await this.showloader();
            //console.log('init')
            this.count = 0;
            this.order = await this.firebaseService.getOrderById(this.id);
            //console.log('init > getOrderById > then', this.order);
            this.organizer = await this.firebaseService.getUserDetails(this.order.createdBy);
            let passengers = await this.firebaseService.getPassengers(this.id);
            this.user = await this.firebaseService.getCurrentUser();
            //console.log('init > getPassengers > then', passengers, this.user)
            for (let i in passengers) {
                if (passengers[i].hasPaid) {
                    this.count++;
                }
            }
            this.guests = passengers;
            this.invited = [];
            for (const i in passengers) {
                const guest = passengers[i];
                if (guest.hasOwnProperty('invitedBy') && guest.invitedBy == this.organizer.uid) {
                    this.invited.push(guest);
                }
            }
            this.hideLoader();

        } catch (error) {
            //console.log('init error', error)
        }
    }

    extractPhone(phone) {
        let x = String(phone).replace(/\D+/g, '');
        return x.substr(x.length - 10, 10);
    }

    async sendInvites() {
        try {
            await this.showloader();
            for (var i in this.selectedContacts) {

                let passengerData = {
                    "hasPaid": false,
                    "hasViewed": false,
                    "invitedBy": this.user.uid,
                    "invitedAt": new Date().getTime(),
                    "orderId": this.id,
                    "name": this.selectedContacts[i].name.formatted || this.selectedContacts[i].name || '',
                    "firstName": this.selectedContacts[i].firstName || this.selectedContacts[i].name.givenName || '',
                    "lastName": this.selectedContacts[i].lastName || this.selectedContacts[i].name.familyName || '',
                    "phone": this.extractPhone(i),
                    "isOrganizer": false
                };
                if (this.id && this.user.uid) {
                    await this.firebaseService.setPassengers(passengerData)
                    this.toast('Contacts are invited!');
                    this.init();
                    this.hideLoader();
                }
            };
        } catch (error) {
            this.hideLoader();
            this.toast('Something went wrong!')
            console.error(error)
        }
    }

    async toast(message) {
        const toast = await this.toastController.create({
            message,
            duration: 2000
        });
        toast.present();
    }
    hideLoader() {
        try {
            this.l.disimiss();
        } catch (error) {
        }
    }
    async showloader() {
        this.l = await this.loadingController.create({
            //spinner: null,
            duration: 3500,
            message: 'Please wait...',
            translucent: true,
            cssClass: 'custom-class custom-loading'
        });
        return await this.l.present();
    }
}