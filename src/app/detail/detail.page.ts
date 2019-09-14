import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../_services/firebase.service';
import { GoogleMaps, GoogleMap, Environment } from "@ionic-native/google-maps/ngx";
import { Platform } from '@ionic/angular';
import { GoogleMapOptions } from '@ionic-native/google-maps';
@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  map: GoogleMap;
  private id: string;
  private order: any;
  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private platform: Platform
  ) {

  }

  async ngOnInit() {
    console.log('ngOnInit')
    await this.platform.ready();
    this.route.paramMap.subscribe(param => {
      console.log('ngOnInit > activated route')
      this.id = param.get('id');
      this.firebaseService.getOrderById(this.id).then(async result => {
        console.log('ngOnInit > activated route > order')
        console.log('order', result)
        this.order = result;
        await this.loadMap();
      })

    })
  }


  async loadMap() {
    Environment.setEnv({
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDrhd4sM4iF6yfi02iwVngE6mZLRHbsG8o',
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDrhd4sM4iF6yfi02iwVngE6mZLRHbsG8o'
    });

    console.log('loadMap', this.order)
    let locationList = this.order.locations
    let firstLocation = locationList[Object.keys(locationList)[0]];
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.0741904,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.addMarker({
      title: firstLocation.name,
      icon: 'blue',
      animation: 'drop',
      position: {
        lat: this.order.destinationAddress.lat,
        lng: this.order.destinationAddress.lng
      }
    });
  }
}
