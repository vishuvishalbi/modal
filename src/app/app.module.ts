import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { Contacts } from '@ionic-native/contacts';
// import { Camera } from '@ionic-native/camera/ngx';
// import { FilestackModule } from '@filestack/angular';

import { HTTP } from '@ionic-native/http/ngx';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BasicAuthInterceptor, ErrorInterceptor } from './_helpers';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
// import { GoogleMaps } from "@ionic-native/google-maps";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase), // imports firebase/app
    AngularFirestoreModule, // imports firebase/firestore
    AngularFireAuthModule, // imports firebase/auth
    AngularFireStorageModule, // imports firebase/storage
    AngularFireDatabaseModule,
    // FilestackModule, //Filestack
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    Contacts,
    FirebaseAuthentication,
    // Camera,
    HTTP
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
