// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserSessionPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { User } from "./schema/User";
import { getDownloadURL, getStorage, ref, StorageReference, uploadBytes } from "firebase/storage";
import { Item } from "./schema/item";

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

const storage = getStorage();



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
        await setPersistence(auth, browserSessionPersistence);
    } catch (err) {
        console.log(err);
    }
}

export async function authenticateSignIn(email: string, password:string) {
    // firebase/auth login
    await signInWithEmailAndPassword(auth, email, password);
    await setPersistence(auth, browserSessionPersistence);
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

export async function getUserData(email: string) {
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("User data retrieved:", docSnap.data());
        return docSnap.data();
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

export async function getItemData(id: string) {
    const docRef = doc(db, "items", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Item data retrieved:", docSnap.data());
        return docSnap.data();
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

export async function readItems() {
    const querySnapshot = await getDocs(collection(db, "items"));
    console.log("Retrieved all minimart items!");
    return querySnapshot;
}

export async function readUsers() {
    const querySnapshot = await getDocs(collection(db, "users"));
    console.log("Retrieved all users!");
    return querySnapshot;
}

export async function getImageUrl(imageRef: string) {
    const url = await getDownloadURL(ref(storage, imageRef));
    return url;
}

export async function uploadImage(itemImage: File) {
    let imageRef = ref(storage, "itemImages/default/mwhicon.jpg");
    if (itemImage) {
        imageRef = ref(storage, `itemImages/${itemImage.name}`);
        await uploadBytes(imageRef, itemImage);
    }
    return imageRef;
}

export async function uploadItem(item: Item, imageRef:StorageReference) {
    //Error thrown here with regards to the Time --> RangeError: Invalid time value
    await addDoc(collection(db, "items"), {
        ...item,
        ["image"]: imageRef.fullPath,
    });
}

export async function updateUserBalance(email: string, newBalance: number) {
    try {
        await updateDoc(doc(db, "users", email), {
            balance: newBalance
        })
    } catch (err) {
        console.error(err);
    }
}

export async function updateUserTransactionHistory(operation: number, email: string, transaction: string) {
    try {
        if (operation == 0) {
            await updateDoc(doc(db, "users", email), {
                transactionHistory: arrayUnion(transaction)
            })
            console.log(`Added ${transaction} to user: email!`)
        } else {
            await updateDoc(doc(db, "users", email), {
                transactionHistory: arrayRemove(transaction)
            })
            console.log(`Removed ${transaction} from user: email!`)
        }
    } catch (err) {
        console.error(err);
    }
}

export async function purchaseItem(item: Item, totalPx: number, quantity: number, user: User) {

    //Update item quantity
    const newQuantity = item.quantity - quantity;
    try {
        await updateDoc(doc(db, "items", item.id), {
            quantity: newQuantity,
            isAvailable: !(newQuantity == 0)
        })
    } catch (err) {
        console.error(err);
    }

    //Update User balance
    const newBalance = user.balance - totalPx;
    updateUserBalance(user.email, newBalance);

    //Update User transaction history - transaction code is as such: itemId_quantity
    const newTransaction = item.id + "_" + quantity;
    updateUserTransactionHistory(0, user.email, newTransaction);
}

export async function updateItemRequests(email: string, item: Item) {
    try {
        await updateDoc(doc(db, "items", item.id), {
            requests: item.requests.includes(email) ? item.requests : arrayUnion(email)
        })
        console.log(`Request added to product ${item.id}!`)
    } catch (err) {
        console.error(err);
    }
}