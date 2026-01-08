import{db, auth} from '../config/firebase';
import { collection, serverTimestamp, setDoc,doc } from 'firebase/firestore';


export async function addToPremium(premiumType){

    try{
         const user = auth.currentUser;
         if(!user){
            console.error("Login first");
            return false;
         }
         await setDoc(doc(db,'premiumUsers', user.uid),{
            userId : user.uid,
            email : user.email, 
            type: premiumType,
            createdAt: serverTimestamp(),
            status: 'active'},
            {merge: true}
            );
            return true;
    }catch(e){
        console.error("Error adding user to Premium", e);
        return false;
    }
   

}