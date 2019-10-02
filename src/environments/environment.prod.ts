export const environment = {
  API_URL: 'http://booking.modal.me',
  START_VERIFY: '/authy/startVerify',
  START_ACTIVATE: '/startActivate',
  production: true,
  // firebase: {
  //   apiKey: "AIzaSyBah75AjrcGvkGIPZKHTjoo9jY1Zu8gDuc",
  //   authDomain: "modal-test-1539797601518.firebaseio.com",
  //   databaseURL: "modal-test-1539797601518.firebaseio.com",
  //   projectId: "modal-test-1539797601518",
  //   storageBucket: "modal-me.appspot.com",
  //   messagingSenderId: "88200261684"

  // }
  firebase: { //actual production credential
    apiKey: "AIzaSyDJ6_uoVKDWuJ5dyjNWGhRaPUCVEPkX9j0",
    authDomain: "modal-me.firebaseapp.com",
    databaseURL: "https://modal-me.firebaseio.com",
    projectId: "modal-me",
    storageBucket: "modal-me.appspot.com",
    messagingSenderId: "344401934196"

  }
};
