const {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	addDoc,
	deleteDoc,
	updateDoc
} = require("firebase/firestore");
const firebase = require("firebase/app");
const moment = require("moment");
const firebaseApp = require("firebase/app");
const firestore = require("firebase/firestore");

class DatabaseController {
	constructor() {
		this.firebaseApp_ = firebaseApp.initializeApp({
			apiKey: "AIzaSyAGqShV0l2hfX2eO8hYzgXnXDmpO5F0xsI",
			authDomain: "silken-tenure-419721.firebaseapp.com",
			projectId: "silken-tenure-419721",
			storageBucket: "silken-tenure-419721.appspot.com",
			messagingSenderId: "245250661585",
			appId: "1:245250661585:web:194d2c6ccce99dd6aab9f0",
			measurementId: "G-L0BFNM9LDG",
		});
		this.db = firestore.getFirestore("myrestaurant");
	}
    async get_available_schedule() {
        const timeCollection = collection(this.db, "Time");
    
        const q = query(
            timeCollection,
            where("slots", ">", 0)
        );
        const snapshot = await getDocs(q);
    
        if (snapshot.empty) {
            console.log("No matching documents.");
            return [];
        }
    
        // Convert query results to Moment.js objects
        const times = snapshot.docs.map((doc) => {
            const data = doc.data();
            // Assuming 'timestamp' is stored as a Firestore Timestamp object
            return {datetime: moment(data.time.toDate()), cupos:data.slots}
        });
    
        return times;
    }
	async getScheduleByLocal(local){
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
            return {datetime: moment(data.time.toDate()), cupos:data.slots}
        });
    
        return times;
	}
}

module.exports = { DatabaseController };


