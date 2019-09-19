import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from '../_services/firebase.service';
// import { GoogleMaps, GoogleMap, Environment } from "@ionic-native/google-maps/ngx";
import { Platform } from '@ionic/angular';
import { map } from 'rxjs/operators';
declare var google: any;

// import { GoogleMapOptions } from '@ionic-native/google-maps';
@Component({
    selector: 'app-detail',
    templateUrl: './detail.page.html',
    styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
    public orderId;

    // map: GoogleMap;
    private id: string;
    private order: any;
    public currentTab = 1;
    public map: any;
    public markers = [];
    public trip: any = { locations: [] };
    public bounds = new google.maps.LatLngBounds();
    public vehicle:any;
    constructor(
        private route: ActivatedRoute,
        private firebaseService: FirebaseService,
        private platform: Platform,
    ) {
        console.log('details pages');
    }

    async ngOnInit() {
        console.log('ngOnInit')
        this.id = location.pathname.split('/')[2];
        await this.platform.ready();
        this.firebaseService.getOrderById(this.id)
            .then(async result => {
                console.log('ngOnInit > activated route > order')
                console.log('order', result)
                this.order = result;
                if (result.assignedVehicle) {
                    this.firebaseService.getVehicleById(result.assignedVehicle)
                    .then(vehicles => {
                        this.vehicle = vehicles;
                    })
                    .catch(err => {
                        console.log('getVehicleById > catch')
                        console.log(err)
                    })
                }
                await this.loadMap();

            })
    }
    ionViewDidEnter() {

    }

    showOverview() {
        this.map.fitBounds(this.bounds);
        this.map.setCenter(this.bounds.getCenter());
        this.map.setZoom(8);
        this.map.setZoom(this.map.getZoom());
        google.maps.event.addListener(this.map, "idle", function () {
            google.maps.event.trigger(this.map, 'resize');
        });
    }

    clickEvent = function (id) {
        google.maps.event.trigger(this.markers[id], 'click');
    }

    smoothZoom(map, max, cnt) {
        if (cnt >= max) {
            return;
        } else {
            let z = google.maps.event.addListener(this.map, 'zoom_changed', function (event) {
                google.maps.event.removeListener(z);
                this.smoothZoom(map, max, cnt + 1);
            });
            setTimeout(function () { this.map.setZoom(cnt) }, 20); // 80ms is what I found to work well on my system -- it might not work well on all systems
        }
    }

    async loadMap() {


        console.log('loadMap', this.order)
        let locationList = this.order.locations
        let locationCoords = [];

        let geocoder;
        this.map = new google.maps.Map(document.getElementById('map_canvas'), {
            center: this.order.destinationAddress,
            zoom: 8,
            scaleControl: true,
            disableDefaultUI: true,
        });

        let marker, i;


        var vals = Object.keys(locationList).map(function (key) {
            return locationList[key];
        });

        for (let index in vals) {
            let result = vals[index];
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(result.destinationAddress.lat, result.destinationAddress.lng),
                map: this.map
            });

            this.markers.push(marker);

            var infowindow = new google.maps.InfoWindow();

            google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                    infowindow.setContent('<h5 style="margin: 0px;">' + result.name + '</h5><p>' + result.destinationAddress.formattedAddress);
                    infowindow.open(this.map, marker);
                    this.map.panTo(marker.position);
                    if (this.map.getZoom() !== 14) {
                        this.smoothZoom(this.map, 8, this.map.getZoom());
                    }
                }

            })(marker, i));

            this.bounds.extend(marker.getPosition());
            locationCoords.push({ lat: result.destinationAddress.lat, lng: result.destinationAddress.lat });

            this.trip.locations.push(result);
        };
        // this.trip.locations = this.trip.locations.pipe(map(arr => arr.sort((a, b) => a.pickupTime > b.pickupTime)))

        this.map.fitBounds(this.bounds);
        this.map.setCenter(this.bounds.getCenter());
        this.map.setZoom(this.map.getZoom() - 1);
        this.map.setZoom(this.map.getZoom());
        google.maps.event.addListener(this.map, "idle", function () {
            google.maps.event.trigger(this.map, 'resize');
        });

    }
}
