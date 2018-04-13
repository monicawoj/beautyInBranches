import firebase from 'firebase'
const config = {
    apiKey: "AIzaSyBeSC5Jl57LD1M4b_KG80Rifta8QYUdGkM",
    authDomain: "beauty-in-branches.firebaseapp.com",
    databaseURL: "https://beauty-in-branches.firebaseio.com",
    projectId: "beauty-in-branches",
    storageBucket: "",
    messagingSenderId: "638205423881"
};
firebase.initializeApp(config);
export default firebase;