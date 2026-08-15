import { db } from '../firebaseClient';
import { 
    collection,
    addDoc, 
    query, 
    where, 
    getDocs, 
    serverTimestamp
} from 'firebase/firestore';

export const createTag = async (useRevalidator, name, color) => {
    const tagsRef = collection(db, "tags");
    const data = {
        userId, 
        name, 
        color, 
        createdAt: serverTimestamp()
    };
    try {
        const docRef = await addDoc(tagsRef, data);
        return docRef.id;
    } catch (error) {
        console.error("createTag failed: ", error);
        throw error;
    }
};

export const fetchTags = async (userId) => {
    const tagsRef = collection(db, "tags");
    const q = query(tagsRef, where("userId", "==", userId));
    try {
        const snapshot = await getDocs(q);
        return snapshot.docs.map((doc) => ({id: doc.id, ...doc.data() }));
    } catch (error) {
        console.log("fetchTags failed: ", error);
        return [];
    }
};