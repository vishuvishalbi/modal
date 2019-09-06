import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';

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
    this.firebase.getUserOrders('Uxw36VrYEOPYBucX0JvJMAx7dih2')
    .then(res => {
      console.log({res})
      this.orders = res;
    })
  }

  ngOnInit() {
  }

}
