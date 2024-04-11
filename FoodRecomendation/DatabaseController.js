const { collection, getDocs } = require('firebase/firestore');

class DatabaseController {
    constructor(db) {
        this.db = db;
    }

    async getAllMenu() { 
        const dishCol = collection(this.db, 'Dish');
        const dishSnapshot = await getDocs(dishCol);
        const list = dishSnapshot.docs.map(doc => doc.data());
        console.log(list);
        return list;
    }
}

module.exports = { DatabaseController };