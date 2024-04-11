const { collection, doc, getDoc, getDocs, query, where } = require('firebase/firestore');
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
          return null;
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
}

module.exports = { DatabaseController };
