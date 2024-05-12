const { collection, doc,deleteDoc, getDoc, getDocs,updateDoc,addDoc, query, where } = require('firebase/firestore');
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

    async getUser(email, password) {
        const userCollection = collection(this.db, 'User');
        const q = query(userCollection, where('email', '==', email));
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log('No matching users.');
            return null;
        }
        const users = snapshot.docs.map(doc => {
            const data = doc.data();
            // Assuming 'timestamp' is stored as a Firestore Timestamp object
            return {'email':data.email,
                    'password': data.password,
                    'access_level': data.access_level,
                    'name': data.name
                    };
        });
        
        return users[0];
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
                time: formattedDateTime
            }
            return reservation;

        }catch(error){
            return 1
        }
    }
    
    async addUser(data) {
        try {
            const userCollection = collection(this.db, 'User');
            const docRef = await addDoc(userCollection, data);
            console.log('DB controller dice: Document written with ID: ', docRef.id);
            return docRef.id;
          } catch (error) {
            console.error('DB controller dice: Error adding document: ', error);
            throw error;
          }
    }
    async updateUserPassword(email, recovery_pin, new_password) {
        try {
            const userCollection = collection(this.db, 'User');
            const q = query(userCollection, where('email', '==', email));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                console.log('DB controller dice: No matching users.');
                return null;
            }
            
            const userDocRef = snapshot.docs[0].ref;
            const db_recovery_pin= snapshot.docs[0].data().recovery_pin;

            if(db_recovery_pin==recovery_pin){
                await updateDoc(userDocRef, {
                    'password': new_password
                });
                console.log(`DB controller dice: recovery_pin ${recovery_pin}`)
                console.log(`DB controller dice: Field "password" updated successfully for user with ID: ${new_password}`);
                return 1;
            }else{
                console.log(`DB controller dice: ERROR: wrong recovery_pin`)
                return 0;
            }
        } catch (error) {
            console.error('DB controller dice: Error updating field: ', error);
            throw error;
        }
    } 
    async updateUserPermit(email, access_level) {
        try {
            const userCollection = collection(this.db, 'User');
            const q = query(userCollection, where('email', '==', email));
            const snapshot = await getDocs(q);
            
            if (snapshot.empty) {
                console.log('DB controller dice: No matching users.');
                return null;
            }
            const userDocRef = snapshot.docs[0].ref;
            await updateDoc(userDocRef, {
                'access_level': access_level
            });
            console.log(`DB controller dice: changed access_level to: ${access_level}`);
            return 1;
            
        } catch (error) {
            console.error('DB controller dice: Error updating field: ', error);
            throw error;
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
    async deleteUser(email, password){
        try {
            const userCollection = collection(this.db, 'User');
            const q = query(userCollection, where('email', '==', email));
            const usr_snapshot = await getDocs(q);
            
            
            if (usr_snapshot.empty) {
                console.log('DB controller dice: No matching users.');
                return null;
            }
            const userDocRef = usr_snapshot.docs[0].ref;
            await deleteDoc(userDocRef);
            console.log(`DB controller dice: user deleted`);

            const reservationCollection = collection(this.db, 'Reservation');
            const reservation_q = query(reservationCollection, where('user', '==', userDocRef));
            const reservation_snapshot = await getDocs(reservation_q);
            reservation_snapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log("DB controller dice: Document deleted successfully from Firestore:", doc.id);
              });
              console.log(`DB controller dice: all reservations of user deleted`);
            return 1;
        } catch (error) {
            console.error('DB controller dice: Error deleting user: ', error);
            throw error;
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
                people: reserv[i].people
            }
            reservations.push(json);
        }
        return reservations
        
    }
    
}

module.exports = { DatabaseController };
