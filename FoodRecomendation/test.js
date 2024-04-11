const express = require('express');
const app = express();
const firebaseApp =require("firebase/app");
const firestore = require ("firebase/firestore");

const firebaseApp_= firebaseApp.initializeApp({
    apiKey: "AIzaSyAGqShV0l2hfX2eO8hYzgXnXDmpO5F0xsI",
    authDomain: "silken-tenure-419721.firebaseapp.com",
    projectId: "silken-tenure-419721",
    storageBucket: "silken-tenure-419721.appspot.com",
    messagingSenderId: "245250661585",
    appId: "1:245250661585:web:194d2c6ccce99dd6aab9f0",
    measurementId: "G-L0BFNM9LDG"
  });

const db = firestore.getFirestore("myrestaurant");
console.log(db)
async function getDish(){
    const dishcol = firestore.collection(db, 'Dish');
    const dishSnapshot = await firestore.getDocs(dishcol);
    const lista = dishSnapshot.docs.map(doc=>doc.data());
    return lista;
}




app.get('/getMenu', async (req, res) => {
  var lista = await getDish();
  res.send(lista);
});

getDish()

exports.api = app;