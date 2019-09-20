import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { ModalController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-contacts',
    templateUrl: './contacts.page.html',
    styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
    public users: any;
    public search: any;
    public close = false;
    public selectedContacts: any = {};
    private l: any;
    constructor(
        private contacts: Contacts,
        private modalCtrl: ModalController,
        private loadingController: LoadingController,
    ) { }

    ngOnInit() {
    }

    async updateContact() {
        let options = {
            filter: this.search,
            multiple: true,
            hasPhoneNumber: true,
        }
        this.users = await this.contacts.find(["*"], options);
        //console.log('users', this.users)
    }

    async ionViewDidEnter() {
        this.showloader();
        await this.updateContact()
        this.hideLoader();
    }

    selecteUser(phone, details) {
        if (this.selectedContacts.hasOwnProperty(phone)) {
            delete this.selectedContacts[phone];
            return;
        }
        this.selectedContacts[phone] = details;
    }

    dismissNow() {
        if (this.close == false) {
            this.close = (Object.keys(this.selectedContacts).length > 0);
        } else {
            this.dismiss();
        }
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss({
            selectedContacts: this.selectedContacts
        });
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
