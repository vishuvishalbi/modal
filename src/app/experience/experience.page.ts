import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../_services/firebase.service';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.page.html',
  styleUrls: ['./experience.page.scss'],
})
export class ExperiencePage implements OnInit {
  
  public orders:any[];
  constructor(
    private firebase:FirebaseService
  ) { 
    
  }

  async ngOnInit() {
    let user = await this.firebase.getCurrentUser()
    console.log('ngOnInit', user)
    // this.firebase.getUserOrders('Uxw36VrYEOPYBucX0JvJMAx7dih2')
    this.firebase.getUserOrdersByUserId(user.uid)
      .then(res => {

        console.log('getUserOrders ', { res })
        this.orders = res;
      })
  }

}
