import * as firebase from 'firebase'
require('@firebase/firestore')

// Looks like you guys have an alibi... The slippery criminal is still on the lose

var firebaseConfig = {
    apiKey: "AIzaSyA42KIDYAoM9uQUUWrzozQ1_EPpORAvU4U",
    authDomain: "lynxy-library.firebaseapp.com",
    projectId: "lynxy-library",
    storageBucket: "lynxy-library.appspot.com",
    messagingSenderId: "708256387532",
    appId: "1:708256387532:web:12c9f82fa5c80413cf8d69"
};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();