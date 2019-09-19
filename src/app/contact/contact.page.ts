import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Platform } from '@ionic/angular';
import { FirebaseService } from '../_services/firebase.service';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.page.html',
    styleUrls: ['./contact.page.scss'],
})
export class ContactPage {

    public everybody: any;
    public currentTab = 1;
    public count: any;
    public id: any;
    public order: any;
    public organizer: any;
    public guests: any = {};
    public invited: any = [];

    constructor(
        private platform: Platform,
        public contacts: Contacts,
        public firebaseService: FirebaseService
    ) {
        this.id = location.pathname.split('/')[2];
        this.init();
        this.platform.ready().then(() => {
        });

    }


    async init() {
        try {

            console.log('init')
            this.count = 0;
            this.order = await this.firebaseService.getOrderById(this.id);
            console.log('init > getOrderById > then', this.order);
            this.organizer  = await this.firebaseService.getUserDetails(this.order.createdBy);
            let passengers = await this.firebaseService.getPassengers(this.id);
            console.log('init > getPassengers > then', passengers)
            for(let i in passengers) {
                if (passengers[i].hasPaid) {
                    this.count++;
                }
            }
            this.guests = passengers;
            for (const i in passengers) {
                const guest = passengers[i];
                if (guest.hasOwnProperty('invitedBy') && guest.invitedBy == this.organizer.uid) {
                    this.invited.push(guest);
                }
            }

        } catch (error) {

        }
    }

}
