import { Component, OnInit } from '@angular/core';
import { Contacts } from '@ionic-native/contacts';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  public everybody:any;
  constructor(
    private platform: Platform,
    public contacts: Contacts

  ) { 
    this.initializeApp();
  }
  
  ngOnInit() {
    this.everybody = this.contacts.find(["*"]);
  }
  
  initializeApp() {
    console.log('initialize')
    this.platform.ready().then(() => {
    });
  }

}
