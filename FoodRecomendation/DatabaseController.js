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
require('dotenv').config();
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
