// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyB6B4qwTyQIs-HOTmdn8kwPMAAle79J3y0",
    authDomain: "chats-fd917.firebaseapp.com",
    databaseURL: "https://chats-fd917-default-rtdb.firebaseio.com",
    projectId: "chats-fd917",
    storageBucket: "chats-fd917.firebasestorage.app",
    messagingSenderId: "174728471714",
    appId: "1:174728471714:web:59edbad76a45a12e7923fb",
    measurementId: "G-ND9N1YSRZ5"
};

const app = initializeApp(firebaseConfig);



const db = getDatabase(app);

export { db };

