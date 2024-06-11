// __mocks__/firebase/firestore.js
module.exports = {
    getFirestore: jest.fn(),
    collection: jest.fn(),
    getDocs: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
    deleteDoc: jest.fn(),
    updateDoc: jest.fn(),
  };
  