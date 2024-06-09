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
	async occupy_slot(timeId) {
		const entryRef = doc(this.db, "Time", timeId);
		const docSnap = await getDoc(entryRef);
		if(docSnap.exists()) {
			const currentSlots = docSnap.data().slots;

			if (currentSlots <= 0)
				throw new RangeError(`Document with id: ${timeId}, has no slots available`);

			await updateDoc(entryRef, {slots: currentSlots-1})
			console.log("Decremented slots!");
		} else {
			console.log(`Document with id: ${timeId} not found`);
			throw new ReferenceError(`Document with id: ${timeId} not found`);
		}
	}
	//HERE STARTS RESERVARTION CONTROL
	/**
	 * Get a reservation by id
	 * @param {*} id reservation's id
	 * @returns json {id, name, people, time}
	 */
	async getReservationByID(id) {
		try {
			const ref = doc(this.db, "Reservation", id);
			const ref_doc = await getDoc(ref);
			// Obtener la referencia del usuario
			const userRef = ref_doc.data().user;

			// Obtener los datos del usuario
			const userDocSnap = await getDoc(userRef);
			const userData = userDocSnap.data();
			const timeDocSnap = await getDoc(ref_doc.data().time);
			const timeData = timeDocSnap.data();
			const date = new Date(
				timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6,
			);
			const formattedDateTime = date.toLocaleString();
			const reservation = {
				id: ref_doc.id,
				people: ref_doc.data().people,
				name: userData.name,
				time: formattedDateTime,
				email: userData.email,
				local: timeData.local
			};
			return reservation;
		} catch (error) {
			return 1;
		}
	}
	/**
	 * Create a new reservations
	 * @param {*} userid user's id
	 * @param {*} timeid time's id
	 * @param {*} people number of people
	 */
	async createNewRervation(userid, timeid, people, local) {
		try {
			// Crear una nueva reserva en la colección "Reservation"
			const time_ = doc(this.db, "Time", timeid);
			const user_ = doc(this.db, "User", userid);
			const time_doc = await getDoc(time_);
			const user_doc = await getDoc(user_);
			console.log(time_doc.exists());
			if (!time_doc.exists()) {
				return 1;
			} else if (!user_doc.exists()) {
				return 2;
			} else {
				const docRef = await addDoc(collection(this.db, "Reservation"), {
					people: people,
					time: time_,
					user: user_,
					local: local
				});
				console.log("Documento de reserva creado con ID:", docRef.id);
				const resp = {
					message: "Created" + docRef.id,
				};
				return resp;
			}
		} catch (error) {
			return null;
		}
	}
	/**
	 * Delete a Reservation
	 * @param {*} reservationId reservation's id
	 */
	async deleteReservation(reservationId) {
		try {
			const reservationRef = doc(this.db, "Reservation", reservationId);
			await deleteDoc(reservationRef);
			const resp = {
				message: "deleted",
			};
			return resp;
		} catch (error) {
			return 1;
		}
	}
	/**
	 * Get all the reservations on the system
	 * @returns list of json [{name,people,time}]
	 */
	async getAllReservations_aux() {
		const reserv_ref = collection(this.db, "Reservation");
		const reservationSnapshot = await getDocs(reserv_ref);
		const list = reservationSnapshot.docs.map((doc) => {
			//parseHttpResponse
			const reservationData = doc.data();
			return {
				id: doc.id,
				people: reservationData.people,
				time: reservationData.time,
				user: reservationData.user,
			};
		});
		return list;
	}
	async getAllReservations() {
		const reserv = await this.getAllReservations_aux();
		const reservations = [];
		const num = reserv.length;
		for (let i = 0; i < num; i++) {
			const userRef = reserv[i].user;
			const userSnap = await getDoc(userRef);
			const userData = userSnap.data();
			const timeRef = reserv[i].time;
			const timeSnap = await getDoc(timeRef);
			const timeData = timeSnap.data();
			const date = new Date(
				timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6,
			);
			const time_ = date.toLocaleString();
			const json = {
				id: reserv[i].id,
				time: time_,
				name: userData.name,
				people: reserv[i].people,
				email: userData.email,
				local: timeData.local
			};
			reservations.push(json);
		}
		return reservations;
	}
	async getReservationByEmail_aux(email) {
		const user_collection = collection(this.db, "User");
		const q = query(user_collection, where("email", "==", btoa(email)));
		const userQuerySnapshot = await getDocs(q);
		if (userQuerySnapshot.empty) {
			console.log("No existe ningun usuario con el email asociado");
			return 1;
		}
		const userId = userQuerySnapshot.docs[0].id;
		const user_ = doc(this.db, "User", userId);
		const userData = await getDoc(user_);
		const reservation_coll = collection(this.db, "Reservation");
		const q_ = query(reservation_coll, where("user", "==", user_));
		const reservationQuerySnapshot = await getDocs(q_);
		const reservations = [];
		reservationQuerySnapshot.forEach((doc) => {
			const reservationData = doc.data();
			reservations.push({
				id: doc.id,
				people: reservationData.people,
				time: reservationData.time,
				email: email,
				name: userData.name,
			});
		});
		return reservations;
	}
	async getReservationByEmail(email) {
		const reserv = await this.getReservationByEmail_aux(email);
		const reservations = [];
		const num = reserv.length;
		for (let i = 0; i < num; i++) {
			const timeRef = reserv[i].time;
			const timeSnap = await getDoc(timeRef);
			const timeData = timeSnap.data();
			const date = new Date(
				timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6,
			);
			const time_ = date.toLocaleString();
			const json = {
				id: reserv[i].id,
				time: time_,
				name: reserv[i].name,
				people: reserv[i].people,
				email: reserv[i].email,
				local: timeData.local
			};
			reservations.push(json);
		}
		return reservations;
	}
	async getReservationByLocal_aux(local) {
		const time_collection = collection(this.db, "Time");
		const q = query(time_collection, where("local", "==", local));
		const timeQuerySnapshot = await getDocs(q);
		if (timeQuerySnapshot.empty) {
			console.log("No existe ningun tiempo con el local asociado");
			return 1;
		}
		const timeId = timeQuerySnapshot.docs[0].id;
		const time_ = doc(this.db, "Time", timeId);
		const timeData = await getDoc(time_);
		const reservation_coll = collection(this.db, "Reservation");
		const q_ = query(reservation_coll, where("time", "==", time_));
		const reservationQuerySnapshot = await getDocs(q_);
		const reservations = [];
		const date = new Date(
			timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6,
		);
		const date_ = date.toLocaleString();
		reservationQuerySnapshot.forEach((doc) => {
			const reservationData = doc.data();
			reservations.push({
				id: doc.id,
				people: reservationData.people,
				time: date_,
				local: timeData.local,
				user: reservationData.user
			});
		});
		return reservations;
	}
	async getReservationByLocal(local) {
		const reserv = await this.getReservationByLocal_aux(local);
		const reservations = [];
		const num = reserv.length;
		for (let i = 0; i < num; i++) {
			const userRef = reserv[i].user;
			const userSnap = await getDoc(userRef);
			const userData = userSnap.data();
			const json = {
				id: reserv[i].id,
				time: reserv[i].time,
				name: userData.name,
				people: reserv[i].people,
				email: userData.email,
				local: reserv[i].local
			};
			reservations.push(json);
		}
		return reservations;
	}
	async editReservation(id, time,user, people){
		try {
			const ref = doc(this.db, "Reservation", id);
			const ref_doc = await getDoc(ref);
			await updateDoc(ref_doc, {
                'time': time,
				'user': user,
				'people': people
            });
		} catch (error) {
			return 1;
		}

	}
}

module.exports = { DatabaseController };
