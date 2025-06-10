import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyB6B4qwTyQIs-HOTmdn8kwPMAAle79J3y0",
  authDomain: "chats-fd917.firebaseapp.com",
  databaseURL: "https://chats-fd917-default-rtdb.firebaseio.com",
  projectId: "chats-fd917",
  storageBucket: "chats-fd917.firebasestorage.app",
  messagingSenderId: "174728471714",
  appId: "1:174728471714:web:3f274e7d5d3a91767923fb",
  measurementId: "G-QWL52R699N"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

  
export { database };

