import { db } from '../firebaseClient';
import {
    collection,
    addDoc,
    query, 
    where, 
    getDocs,
    serverTimestamp, 
    doc, 
    getDoc,
    updateDoc
} from 'firebase/firestore';

export const saveDeck = async (userId, title, cards) => {
    const decksRef = collection(db, "decks");
    const data = {
        userId,
        title,
        cards,
        createdAt: serverTimestamp()
    };
    try {
        const docRef = await addDoc(decksRef, data);
        return docRef.id;
    } catch (error) {
        console.error("saveDeck failed:", error);
        throw error;
    }
};

export const fetchDecks = async (userId) => {
    const decksRef = collection(db, "decks");
    const q = query(decksRef, where("userId", "==", userId));
    try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("fetchDecks failed:", error);
        return [];
    }
};

export const fetchDeck = async (deckId) => {
    const docRef = doc(db, "decks", deckId);
    try { 
        const snapshot = await getDoc(docRef);
        if (!snapshot.exists()) {
            return null;
        }
        return { id: snapshot.id, ...snapshot.data() };
    } catch (error) {
        console.error("fetchDeck failed:", error);
        return null;
    }
};

export const updateTitle = async (deckId, newTitle) => {
    const docRef = doc(db, "decks", deckId);
    try {
        await updateDoc(docRef, { title: newTitle });
    } catch (error) {
        console.error("updateTitle failed:", error);
        throw error;
    }
};