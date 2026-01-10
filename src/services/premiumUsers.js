import { db, auth } from '../config/firebase';
import { collection, serverTimestamp, setDoc, doc, getDoc } from 'firebase/firestore';


export async function addToPremium(premiumType) {

    try {
        const user = auth.currentUser;
        if (!user) {
            console.error("Login first");
            return false;
        }
        await setDoc(doc(db, 'premiumUsers', user.uid), {
            userId: user.uid,
            email: user.email,
            type: premiumType,
            createdAt: serverTimestamp(),
            status: 'active'
        },
            { merge: true }
        );
        return true;
    } catch (e) {
        console.error("Error adding user to Premium", e);
        return false;
    }


}

export async function getPremiumStatus() {
    try {
        const user = auth.currentUser;
        if (!user) return null;

        const docRef = doc(db, 'premiumUsers', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data().type;
        } else {
            return null;
        }

    } catch (e) {
        console.error("Error fetching premium status", e);
        return null;
    }
}