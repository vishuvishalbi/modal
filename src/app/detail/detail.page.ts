import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../_services/firebase.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  private id: string;
  private order: any;
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService
  ) {
    this.route.paramMap.subscribe(param => {
      console.log('ngOnInit > activated route')
      this.id = param.get('id');
      this.firebaseService.getOrderById(this.id).then(result => {
        console.log('ngOnInit > activated route > order')
        console.log('order', result)
        this.order = result;
      })

    })
  }

  ngOnInit() {
    console.log('ngOnInit')

  }

}
