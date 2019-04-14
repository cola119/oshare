import firebase from 'firebase';
import { firebaseConfig } from './config';

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firebaseDB = firebaseApp.database();
export const firebaseStorage = firebaseApp.storage();

export default firebase;