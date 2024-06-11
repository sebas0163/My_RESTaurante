const {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  updateDoc,
} = require("firebase/firestore");
const firebase = require("firebase/app");
const moment = require("moment");
const firebaseApp = require("firebase/app");
const firestore = require("firebase/firestore");
require("dotenv").config();
const Timestamp = firestore.Timestamp;
class DatabaseController {
  constructor() {
    this.firebaseApp_ = firebaseApp.initializeApp({
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      storageBucket: process.env.storageBucket,
      messagingSenderId: process.env.messagingSenderId,
      appId: process.env.appId,
      measurementId: process.env.measurementId,
    });
    this.db = firestore.getFirestore("myrestaurant");
  }
  async get_available_schedule() {
    const timeCollection = collection(this.db, "Time");

    const q = query(timeCollection, where("slots", ">", 0));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }

    // Convert query results to Moment.js objects
    const times = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Assuming 'timestamp' is stored as a Firestore Timestamp object
      return {
        datetime: moment(data.time.toDate()),
        cupos: data.slots,
        id: doc.id,
      };
    });

    return times;
  }
  async getScheduleByLocal(local) {
    const time_collection = collection(this.db, "Time");
    const q = query(time_collection, where("local", "==", local));
    const timeQuerySnapshot = await getDocs(q);
    if (timeQuerySnapshot.empty) {
      console.log("No existe ningun tiempo con el local asociado");
      return 1;
    }
    const times = timeQuerySnapshot.docs.map((doc) => {
      const data = doc.data();
      // Assuming 'timestamp' is stored as a Firestore Timestamp object
      return {
        datetime: moment(data.time.toDate()),
        cupos: data.slots,
        id: doc.id,
      };
    });

    return times;
  }
  async newTime(time, slots, local) {
    try {
      const docRef = await addDoc(collection(this.db, "Time"), {
        local: local,
        slots: slots,
        time: Timestamp.fromDate(new Date(time)),
      });
      console.log("Documento escrito con ID: ", docRef.id);
    } catch (e) {
      console.error("Error agregando documento: ", e);
      throw e;
    }
  }
}

module.exports = { DatabaseController };
