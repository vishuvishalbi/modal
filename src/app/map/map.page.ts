import { Component, OnInit } from '@angular/core';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Environment
} from '@ionic-native/google-maps/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage {

  map: GoogleMap;

  constructor(private platform: Platform) {
    this.platform.ready().then(() => {
      Environment.setEnv({
        'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyDrhd4sM4iF6yfi02iwVngE6mZLRHbsG8o',
        'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyDrhd4sM4iF6yfi02iwVngE6mZLRHbsG8o'
      });
      this.loadmap();
    });
  }

  loadmap() {
    try {
      
  
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 43.0741704,
          lng: -89.3809802
        },
        zoom: 18,
        tilt: 30
      }
    });

    console.log('loadmap', this.map)

    // The `MAP_READY` event notifies the native map view is fully ready.
    this.map.one(GoogleMapsEvent.MAP_READY).then(this.onMapReady.bind(this));
    } catch (error) {
      console.log('something went wrong', error)
    }
  }

  onMapReady() {
    console.log('map is ready!');
  }
}