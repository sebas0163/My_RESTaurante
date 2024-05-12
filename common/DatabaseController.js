const { collection, doc, getDoc, getDocs, query, where,addDoc,deleteDoc } = require('firebase/firestore');
const firebase = require('firebase/app');
const moment = require('moment');
const firebaseApp =require("firebase/app");
const firestore = require ("firebase/firestore");


class DatabaseController {
    constructor() {
        this.firebaseApp_= firebaseApp.initializeApp({
            apiKey: "AIzaSyAGqShV0l2hfX2eO8hYzgXnXDmpO5F0xsI",
            authDomain: "silken-tenure-419721.firebaseapp.com",
            projectId: "silken-tenure-419721",
            storageBucket: "silken-tenure-419721.appspot.com",
            messagingSenderId: "245250661585",
            appId: "1:245250661585:web:194d2c6ccce99dd6aab9f0",
            measurementId: "G-L0BFNM9LDG"
        });
        this.db = firestore.getFirestore("myrestaurant");
    }


    // async getAllMenu() { 
    //     const dishCol = collection(this.db, 'Dish');
    //     const dishSnapshot = await getDocs(dishCol);
    //     const list = dishSnapshot.docs.map(doc => doc.data());
    //     console.log(list);
    //     return list;
    // }

    async getDishById(dishId) {
      try {
          const dishDocRef = doc(this.db, 'Dish', dishId);
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
    const dishCol = collection(this.db, 'Dish');
    const dishSnapshot = await getDocs(dishCol);
    const list = dishSnapshot.docs.map(doc => {
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
      const dishCol = collection(this.db, 'Dish');
      const dishSnapshot = await getDocs(dishCol);
      const list = dishSnapshot.docs.map(doc => {
      //parseHttpResponse
          const data = doc.data();
          return {
              name: data.name,
              type: data.type,
              // If you need IDs from req1 or req2 but not the whole DocumentReference:
              req1Id: data.req1 ? data.req1.id : null, // assuming 'id' is what you need
              req2Id: data.req2 ? data.req2.id : null
          };
      });
      return list;
  }  

    async get_available_schedule(dayMoment) {
      const timeCollection = collection(this.db, 'Time');
      
      // Create start and end timestamps for the day
      const startOfDay = dayMoment.clone().startOf('day');
      const endOfDay = dayMoment.clone().endOf('day');
      
      // Query Firestore for entries within the specified day
      const q = query(timeCollection, where('time', '>=', startOfDay.toDate()),
            where('time', '<=', endOfDay.toDate()));
      const snapshot = await getDocs(q);

      
      if (snapshot.empty) {
        console.log('No matching documents.');
        return [];
      }
      
      // Convert query results to Moment.js objects
      const times = snapshot.docs.map(doc => {
        const data = doc.data();
        // Assuming 'timestamp' is stored as a Firestore Timestamp object
        return moment(data.time.toDate());
      });
      
      return times;
    }
    //HERE STARTS RESERVARTION CONTROL
    /**
     * Get a reservation by id
     * @param {*} id reservation's id
     * @returns json {id, name, people, time}
     */
    async getReservationByID(id){
        try{
            const ref = doc(this.db, "Reservation",id);
            const ref_doc = await getDoc(ref);
            // Obtener la referencia del usuario
            const userRef = ref_doc.data().user;
            
            // Obtener los datos del usuario
            const userDocSnap = await getDoc(userRef);
            const userData = userDocSnap.data();
            const timeDocSnap = await getDoc(ref_doc.data().time);
            const timeData = timeDocSnap.data();
            const date = new Date(timeData.time.seconds * 1000 + timeData.time.nanoseconds / 1e6);
            const formattedDateTime = date.toLocaleString();
            const reservation ={
                id: ref_doc.id,
                people: ref_doc.data().people,
                name: userData.name,
                time: formattedDateTime,
                email: userData.email
            }
            return reservation;

        }catch(error){
            return 1
        }
    }
    /**
     * Create a new reservations
     * @param {*} userid user's id
     * @param {*} timeid time's id
     * @param {*} people number of people 
     */
    async createNewRervation(userid, timeid, people){
        try {
            // Crear una nueva reserva en la colección "Reservation"
            const time_ =doc(this.db,'Time', timeid);
            const user_ = doc(this.db,'User', userid);
            const time_doc = await getDoc(time_);
            const user_doc = await getDoc(user_);
            console.log(time_doc.exists());
            if (!time_doc.exists()){
                return 1
            }else if(!user_doc.exists()){
                return 2
            }else{
                const docRef = await addDoc(collection(this.db, 'Reservation'), {
                    people: people,
                    time: time_,
                    user: user_
                });
                console.log("Documento de reserva creado con ID:", docRef.id);
                const resp ={
                'message': "Created" +docRef.id
            }
            return resp
            }
        } catch (error) {
            return null
        }
    }
    /**
     * Delete a Reservation
     * @param {*} reservationId reservation's id
     */
    async  deleteReservation(reservationId){
        try {
            const reservationRef = doc(this.db, 'Reservation', reservationId);
            await deleteDoc(reservationRef);
            const resp ={
                'message': "deleted"
            }
            return resp
        } catch (error) {
            return 1
        }
    }
    /**
     * Get all the reservations on the system
     * @returns list of json [{name,people,time}]
     */
    async getAllReservations_aux() {
        const reserv_ref = collection(this.db, 'Reservation');
        const reservationSnapshot = await getDocs(reserv_ref);
        const list = reservationSnapshot.docs.map(doc => {
        //parseHttpResponse
            const reservationData =  doc.data();
            return  {
                id: doc.id,
                people: reservationData.people,
                time: reservationData.time,
                user: reservationData.user
            };
      });
      return list;
    }
    async getAllReservations(){
        const reserv = await this.getAllReservations_aux();
        const reservations =[];
        const num = reserv.length;
        for(let i=0; i<num;i++){
            const userRef= reserv[i].user;
            const userSnap = await getDoc(userRef);
            const userData = userSnap.data();
            const timeRef = reserv[i].time;
            const timeSnap = await getDoc(timeRef);
            const timeData = timeSnap.data();
            const date = new Date(timeData.time.seconds *1000 +timeData.time.nanoseconds / 1e6);
            const time_ = date.toLocaleString();
            const json ={
                id: reserv[i].id,
                time: time_,
                name: userData.name,
                people: reserv[i].people,
                email: userData.email
            }
            reservations.push(json);
        }
        return reservations
        
    }
    async getReservationByEmail_aux(email){
        const user_collection = collection(this.db, 'User');
        const q = query(user_collection, where('email', '==', btoa(email)));
        const userQuerySnapshot = await getDocs(q);
        if (userQuerySnapshot.empty) {
            console.log('No existe ningun usuario con el email asociado');
            return 1
        }
        const userId = userQuerySnapshot.docs[0].id;
        const user_ = doc(this.db,'User', userId);
        const userData = await getDoc(user_);
        const reservation_coll = collection(this.db, 'Reservation');
        const q_ = query(reservation_coll, where('user', '==', user_));
        const reservationQuerySnapshot = await getDocs(q_);
        const reservations = [];
        reservationQuerySnapshot.forEach((doc) => {
            const reservationData = doc.data();
            reservations.push({
                id: doc.id,
                people: reservationData.people,
                time: reservationData.time,
                email:email,
                name: userData.name
            });
        });
        return reservations;
    }
    async getReservationByEmail(email){
        const reserv = await this.getReservationByEmail_aux(email);
        const reservations =[];
        const num = reserv.length;
        for(let i=0; i<num;i++){
            const timeRef = reserv[i].time;
            const timeSnap = await getDoc(timeRef);
            const timeData = timeSnap.data();
            const date = new Date(timeData.time.seconds *1000 +timeData.time.nanoseconds / 1e6);
            const time_ = date.toLocaleString();
            const json ={
                id: reserv[i].id,
                time: time_,
                name: reserv[i].name,
                people: reserv[i].people,
                email: reserv[i].email
            }
            reservations.push(json);
        }
        return reservations
    }
    
}

module.exports = { DatabaseController };
