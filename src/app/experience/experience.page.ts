import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../_services/firebase.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.scss'],
})
export class ExperiencePage implements OnInit {

  public orders: any[];
  private l: any;
  constructor(
    private firebase: FirebaseService,
    private loadingController: LoadingController,

  ) {

  }

  async ngOnInit() {
    let user = await this.firebase.getCurrentUser()
    // console.log('ngOnInit', user)
    // this.firebase.getUserOrders('Uxw36VrYEOPYBucX0JvJMAx7dih2')
    this.firebase.getUserOrdersByUserId(user.uid)
      .then(res => {

        // console.log('getUserOrders ', { res })
        this.orders = res;
      })
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
