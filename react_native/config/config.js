import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';


// const firebaseConfig = {
//   apiKey: "AIzaSyB6B4qwTyQIs-HOTmdn8kwPMAAle79J3y0",
//   authDomain: "chats-fd917.firebaseapp.com",
//   databaseURL: "https://chats-fd917-default-rtdb.firebaseio.com",
//   projectId: "chats-fd917",
//   storageBucket: "chats-fd917.firebasestorage.app",
//   messagingSenderId: "174728471714",
//   appId: "1:174728471714:web:3f274e7d5d3a91767923fb",
//   measurementId: "G-QWL52R699N"
// };

const firebaseConfig = {
	apiKey: process.env.EXPO_PUBLIC_FIREBASE_API,
	authDomain: process.env.EXPO_PUBLIC_FIREBASE_DOMAIN,
	databaseURL: process.env.EXPO_PUBLIC_FIREBASE_URL,
	projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORE_BUCKET,
	messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_SENDER_ID,
	appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
	measurementId: process.env.EXPO_PUBLIC_FIREBASE_MESURE_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

  
export { database };

