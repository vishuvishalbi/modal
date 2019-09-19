import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../_services/firebase.service';
import { Platform } from '@ionic/angular';
declare var jQuery: any;
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.page.html',
  styleUrls: ['./ticket.page.scss'],
})
export class TicketPage implements OnInit {
  public id: any;
  public order: any;
  public user: any;
  constructor(
    private firebaseService: FirebaseService,
    private platform: Platform
  ) {

    this.id = location.pathname.split('/')[2];

    this.firebaseService.getOrderById(this.id).then(order => {
      console.log('got order')
      this.order = order;
      this.firebaseService.getCurrentUser().then(user => {
        console.log({ user });
        this.user = user;
        this.generateQr();
      }).catch(console.log)
    });
  }

  ngOnInit() {
  }

  generateQr() {
    let w = this.platform.width();
    let h = this.platform.height();
    let width = w - (w * 0.2);
    let height = width;
    jQuery('#qrcode').qrcode({ width: width, height: height, text: this.user.phoneNumber, fill: '#000' });

  }
}
