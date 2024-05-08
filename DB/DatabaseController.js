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



    /**
     * The function `getDishById` retrieves a dish document from a Firestore database by its ID,
     * handling cases where the document does not exist or errors occur during the retrieval process.
     * 
     * @param dishId The `dishId` parameter in the `getDishById` function is the unique identifier of
     * the dish document that you want to retrieve from the database. 
     * 
     * @return The `getDishById` function returns an object containing the data of the dish with the
     * specified ID. 
     */
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
  

  /**
   * The function `getAllMenuWithoutRef` retrieves all menu items without references from a Firestore
   * database collection named 'Dish'.
   * 
   * @return The `getAllMenuWithoutRef` function is returning a list of objects with `name` and `type`
   * properties for each dish in the "Dish" collection in the database.
   */
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

    /**
     * This function retrieves all menu items from a Firestore collection and returns an array of
     * objects containing the name, type, and IDs of related documents.
     * 
     * @return The `getAllMenu` function is returning a list of objects, where each object represents a
     * dish from the 'Dish' collection in the database. Each object contains the following properties:
     * - `name`: The name of the dish
     * - `type`: The type of the dish
     * - `req1Id`: The ID of the document referenced by the `req1` field in the dish document
     */
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

    /**
     * The function `get_available_schedule` retrieves available schedule times for a specified day
     * from a Firestore database and returns them as Moment.js objects.
     * 
     * @param dayMoment The `dayMoment` parameter represents a specific moment in time within a day for
     * which you want to retrieve available schedules. This function retrieves schedules from a
     * Firestore database collection based on the specified day.
     * 
     * @return The `get_available_schedule` function returns an array of Moment.js objects representing
     * the available schedule for the specified `dayMoment`.
     */
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
