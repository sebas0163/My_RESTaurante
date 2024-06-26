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
    if (docSnap.exists()) {
      const currentSlots = docSnap.data().slots;

      if (currentSlots <= 0)
        throw new RangeError(
          `Document with id: ${timeId}, has no slots available`
        );

      await updateDoc(entryRef, { slots: currentSlots - 1 });
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
        timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6
      );
      const formattedDateTime = date.toLocaleString();
      const reservation = {
        id: ref_doc.id,
        people: ref_doc.data().people,
        name: userData.name,
        time: formattedDateTime,
        email: userData.email,
        local: timeData.local,
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
  async createNewRervation(userid, timeid, people) {
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
        timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6
      );
      const time_ = date.toLocaleString();
      const json = {
        id: reserv[i].id,
        time: time_,
        name: userData.name,
        people: reserv[i].people,
        email: userData.email,
        local: timeData.local,
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
        timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6
      );
      const time_ = date.toLocaleString();
      const json = {
        reservationId: reserv[i].id,
        time: time_,
        timeid: timeRef.id,
        name: reserv[i].name,
        people: reserv[i].people,
        email: reserv[i].email,
        local: timeData.local,
      };
      reservations.push(json);
    }
    return reservations;
  }

  async getReservationByLocal(local) {
    // 1. Obtener los documentos de la colección Time donde local es "Cartago"
    const timeQuery = query(
      collection(this.db, "Time"),
      where("local", "==", local)
    );
    const timeSnapshot = await getDocs(timeQuery);

    // Guardar los IDs de los documentos Time
    const timeIds = timeSnapshot.docs.map((doc) => doc.ref);

    // 2. Consultar la colección Reservation con los IDs obtenidos
    const reservaciones = [];
    for (const timeId of timeIds) {
      const reservationQuery = query(
        collection(this.db, "Reservation"),
        where("time", "==", timeId)
      );
      const reservationSnapshot = await getDocs(reservationQuery);

      // 3. Obtener el nombre de usuario y compilar los resultados
      for (const reservationDoc of reservationSnapshot.docs) {
        const reservationData = reservationDoc.data();
        const userIdRef = reservationData.user;
        const userDoc = await getDoc(userIdRef);
        const userName = userDoc.exists()
          ? userDoc.data().name
          : "Usuario no encontrado";

        const timeDoc = await getDoc(reservationData.time);
        const timeData = timeDoc.data();
        const date = new Date(
          timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6
        );

        const date_ = date.toLocaleString();
        reservaciones.push({
          reservationId: reservationDoc.id,
          time: date_, // Asumiendo que time es el campo de timestamp
          timeid: timeDoc.id,
          local: timeData.local,
          name: userName,
          people: reservationData.people,
          email: atob(userDoc.data().email),
        });
      }
    }

    return reservaciones;
  }
  async editReservation(id, timeid, userid, people) {
    try {
      const time_ = doc(this.db, "Time", timeid);
      const user_ = doc(this.db, "User", userid);
      const ref = doc(this.db, "Reservation", id);

      await updateDoc(ref, {
        time: time_,
        user: user_,
        people: people,
      });
      return 1;
    } catch (error) {
      return error;
    }
  }
}

//const cont = new DatabaseController();
//cont.editReservation("NkWfXJbrHTi2CENWB6hT","8nbBRayIb6NKsmp5Zze5", "YYgq3OPFWBNTv8cUukP2", 2);

module.exports = { DatabaseController };
