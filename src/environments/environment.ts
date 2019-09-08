// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    API_URL: 'http://alpha.modal.me',
    START_VERIFY: '/authy/startVerify',
    START_ACTIVATE: '/startActivate',
    production: false,
    firebase: {
        apiKey: "AIzaSyBah75AjrcGvkGIPZKHTjoo9jY1Zu8gDuc",
        authDomain: "modal-test-1539797601518.firebaseio.com",
        databaseURL: "modal-test-1539797601518.firebaseio.com",
        projectId: "modal-test-1539797601518",
        storageBucket: "modal-me.appspot.com",
        messagingSenderId: "88200261684"
        
    }
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
