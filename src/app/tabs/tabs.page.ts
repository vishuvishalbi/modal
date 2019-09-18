import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../_services/firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  public order:any;
  public id:any;
  constructor(
    private firebaseService:FirebaseService,
    private route:ActivatedRoute
  ) { 

    this.id = this.route.snapshot.paramMap.get('id');
    console.log('Tabs page', this.id)
  }
  
  async ngOnInit() {
    // await this.firebaseService.getOrderById(this.id);
    this.order = await this.firebaseService.getOrderById(this.id);
  }

}
