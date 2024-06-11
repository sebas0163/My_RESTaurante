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

  /**
   * The function `getUser` retrieves a user's data from a Firestore database based on their email
   * and returns it.
   *
   * @param email The `email` parameter is used to specify the email address of the user you want to
   * retrieve from the database.
   * @param password The function `getUser` you provided searches for a user in a Firestore database
   * based on the email provided. It retrieves the user's data if a matching user is found.
   *
   * @return The `getUser` function is returning an object with the user's email, password, access
   * level, and name if a user with the provided email is found in the Firestore database. If no
   * matching user is found, it returns `null`.
   */
  async getUser(email, password) {
    const userCollection = collection(this.db, "User");
    const q = query(userCollection, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No matching users.");
      return null;
    }
    const users = snapshot.docs.map((doc) => {
      const data = doc.data();
      // Assuming 'timestamp' is stored as a Firestore Timestamp object
      return {
        id: doc.id,
        email: data.email,
        password: data.password,
        access_level: data.access_level,
        name: data.name,
      };
    });

    return users[0];
  }
  /**
   * The function `addUser` asynchronously adds a new document to the 'User' collection in a database
   * and returns the ID of the newly created document.
   *
   * @param data The `data` parameter in the `addUser` function represents the information of the
   * user that you want to add to the database. This data typically includes details such as the
   * user's name, email, age, address, etc. It could be an object containing key-value pairs of user
   * attributes.
   *
   * @return The `addUser` function is returning the ID of the document that was written to the
   * database.
   */
  async addUser(data) {
    try {
      const userCollection = collection(this.db, "User");
      const docRef = await addDoc(userCollection, data);
      console.log("DB controller dice: Document written with ID: ", docRef.id);
      return docRef.id;
    } catch (error) {
      console.error("DB controller dice: Error adding document: ", error);
      throw error;
    }
  }
  /**
   * The function `updateUserPassword` updates a user's password in a database if the provided
   * recovery pin matches the one stored for the user.
   *
   * @param email The `email` parameter is the email address of the user for whom you want to update
   * the password.
   * @param recovery_pin The `recovery_pin` parameter is typically a unique code or token that is
   * provided to a user as a means of verifying their identity when they need to reset their password.
   * It serves as a security measure to ensure that only the rightful owner of the account can change
   * the password.
   * @param new_password The `new_password` parameter in the `updateUserPassword` function represents
   * the new password that the user wants to set for their account. This function is designed to
   * update the password field in the user document in the database with this new password value.
   *
   * @return The function `updateUserPassword` will return a value of `1` if the recovery pin provided
   * matches the recovery pin stored in the database for the user, and the password field is
   * successfully updated with the new password. If the recovery pin does not match, it will return a
   * value of `0`. If there are no matching users found in the database, it will return `null`.
   */
  async updateUserPassword(email, recovery_pin, new_password) {
    try {
      const userCollection = collection(this.db, "User");
      const q = query(userCollection, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("DB controller dice: No matching users.");
        return null;
      }

      const userDocRef = snapshot.docs[0].ref;
      const db_recovery_pin = snapshot.docs[0].data().recovery_pin;

      if (db_recovery_pin == recovery_pin) {
        await updateDoc(userDocRef, {
          password: new_password,
        });
        console.log(`DB controller dice: recovery_pin ${recovery_pin}`);
        console.log(
          `DB controller dice: Field "password" updated successfully for user with ID: ${new_password}`
        );
        return 1;
      } else {
        console.log(`DB controller dice: ERROR: wrong recovery_pin`);
        return 0;
      }
    } catch (error) {
      console.error("DB controller dice: Error updating field: ", error);
      throw error;
    }
  }
  /**
   * The function `updateUserPermit` updates the access level of a user in a database based on their
   * email.
   *
   * @param email The `email` parameter in the `updateUserPermit` function is used to specify the
   * email address of the user whose access level needs to be updated.
   * @param access_level The `access_level` parameter in the `updateUserPermit` function represents
   * the level of access or permissions that you want to assign to a user. It is the new value that
   * will be set for the `access_level` field in the user document in the database. This parameter
   * allows you to
   *
   * @return The `updateUserPermit` function returns either `1` if the access level was successfully
   * updated for the user with the provided email, or `null` if no matching user was found in the
   * database.
   */
  async updateUserPermit(email, access_level) {
    try {
      const userCollection = collection(this.db, "User");
      const q = query(userCollection, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        console.log("DB controller dice: No matching users.");
        return null;
      }
      const userDocRef = snapshot.docs[0].ref;
      await updateDoc(userDocRef, {
        access_level: access_level,
      });
      console.log(
        `DB controller dice: changed access_level to: ${access_level}`
      );
      return 1;
    } catch (error) {
      console.error("DB controller dice: Error updating field: ", error);
      throw error;
    }
  }
  /**
   * The function `deleteUser` deletes a user and all their associated reservations from a Firestore
   * database based on the provided email and password.
   *
   * @param email The `deleteUser` function you provided is designed to delete a user from a Firestore
   * database along with all their associated reservations. The function first queries the `User`
   * collection to find the user document based on the provided email. If the user is found, it
   * deletes the user document and then proceeds to
   * @param password The function `deleteUser` you provided seems to be deleting a user and all their
   * associated reservations from a Firestore database. The parameters `email` and `password` are
   * likely used to identify and authenticate the user before deleting their account.
   *
   * @return The `deleteUser` function returns a promise that resolves to `1` if the user and all
   * their reservations are successfully deleted from the database. If there is an error during the
   * deletion process, the function will throw an error.
   */
  async deleteUser(email, password) {
    try {
      const userCollection = collection(this.db, "User");
      const q = query(userCollection, where("email", "==", email));
      const usr_snapshot = await getDocs(q);

      if (usr_snapshot.empty) {
        console.log("DB controller dice: No matching users.");
        return null;
      }
      const userDocRef = usr_snapshot.docs[0].ref;
      await deleteDoc(userDocRef);
      console.log(`DB controller dice: user deleted`);

      const reservationCollection = collection(this.db, "Reservation");
      const reservation_q = query(
        reservationCollection,
        where("user", "==", userDocRef)
      );
      const reservation_snapshot = await getDocs(reservation_q);
      reservation_snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        console.log(
          "DB controller dice: Document deleted successfully from Firestore:",
          doc.id
        );
      });
      console.log(`DB controller dice: all reservations of user deleted`);
      return 1;
    } catch (error) {
      console.error("DB controller dice: Error deleting user: ", error);
      throw error;
    }
  }
}

module.exports = { DatabaseController };
