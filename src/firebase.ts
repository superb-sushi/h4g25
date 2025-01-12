// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { User } from "./schema/User";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB4kfnzP6f-dAIODWOa7WXutw5brmuNGCE",
  authDomain: "h4g25-42aa4.firebaseapp.com",
  projectId: "h4g25-42aa4",
  storageBucket: "h4g25-42aa4.firebasestorage.app",
  messagingSenderId: "125179454215",
  appId: "1:125179454215:web:8636a56e67b9a168badba2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();


// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export async function signUp(emailInput: string, passwordInput: string) {
    console.log("signing user up...")
    try {
        await createUserWithEmailAndPassword(auth, emailInput, passwordInput); // createUserWithEmailAndPassword automatically signs user in
            await setDoc(doc(db, "users", emailInput), {
                email: emailInput,
                vouchers: [],
                transactionHistory: [],
                balance: 0,
                isAdmin: false
            } as User)
    } catch (err) {
        console.log(err);
    }
}

export async function authenticateSignIn(email: string, password:string) {
    // firebase/auth login
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log(userCredential);
}

export function signUserOut() {
    signOut(auth).then(() => {
    // Sign-out successful.
    }).catch((error) => {
    // An error happened.
    console.log(error);
    });
}

export function getCurrentUser() {
    return auth.currentUser;
}

export async function getUserData(id: string) {
    const docRef = doc(db, "users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("User data retrieved:", docSnap.data());
        return docSnap.data();
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}