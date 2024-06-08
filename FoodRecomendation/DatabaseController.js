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

	async getDishById(dishId) {
		try {
			const dishDocRef = doc(this.db, "Dish", dishId);
			const dishDoc = await getDoc(dishDocRef);
			if (dishDoc.exists()) {
				let dishData = dishDoc.data();
				return {
					...dishData,
					// Include the document ID if necessary
					id: dishDoc.id,
				};
			} else {
				// Handle the case where the document does not exist
				console.log(`Dish with ID ${dishId} not found.`);
				return null; // Or you might want to throw an error or return a specific value
			}
		} catch (error) {
			// Handle any errors that occurred during the getDoc call or elsewhere
			console.error(`Error fetching dish with ID ${dishId}:`, error);
			throw error; // Rethrow the error if you want calling code to handle it
			// Or return null or another specific value to indicate failure
		}
	}

	async getAllMenuWithoutRef() {
		const dishCol = collection(this.db, "Dish");
		const dishSnapshot = await getDocs(dishCol);
		const list = dishSnapshot.docs.map((doc) => {
			//parseHttpResponse
			const data = doc.data();
			return {
				name: data.name,
				type: data.type,
			};
		});
		return list;
	}

	async getAllMenu() {
		const dishCol = collection(this.db, "Dish");
		const dishSnapshot = await getDocs(dishCol);
		const list = dishSnapshot.docs.map((doc) => {
			//parseHttpResponse
			const data = doc.data();
			return {
				name: data.name,
				type: data.type,
				// If you need IDs from req1 or req2 but not the whole DocumentReference:
				req1Id: data.req1 ? data.req1.id : null, // assuming 'id' is what you need
				req2Id: data.req2 ? data.req2.id : null,
			};
		});
		return list;
	}

	
}

module.exports = { DatabaseController };
