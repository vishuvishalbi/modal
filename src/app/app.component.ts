import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Your trips',
      url: '/experiences',
      icon: 'bookmark'
    },
    // {
    //   title: 'List',
    //   url: '/list',
    //   icon: 'list'
    // },
    // {
    //   title: 'Login',
    //   icon: 'list',
    //   url: '/login',
    // },
    // {
    //   title: 'Settings',
    //   icon: 'settings',
    //   url: '/profile',
    // },
    // {
    //   title: 'Experiences',
    //   icon: 'list',
    //   url: '/experiences',
    // },
    // {
    //   title: 'Trip Details',
    //   icon: 'list',
    //   url: "/experience/:orderId",
    // },
    // {
    //   title: 'guests',
    //   icon: 'list',
    //   url: "/guests",
    // },
    // {
    //   title: 'schedule',
    //   icon: 'list',
    //   url: "/schedule",
    // },
    // {
    //   title: 'wall',
    //   icon: 'list',
    //   url: "/wall",
    // },
    // {
    //   title: 'media',
    //   icon: 'list',
    //   url: "/media",
    // },
    // {
    //   title: '',
    //   icon: 'list',
    //   url: '/tickets',
    // },
    // {
    //   title: 'profile',
    //   icon: 'list',
    //   url: '/profile',
    // // },
    // {
    //   title: 'contacts',
    //   icon: 'contacts',
    //   url: '/contacts',
    // }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      }, 4000);
    });
  }
}
