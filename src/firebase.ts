// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { browserSessionPersistence, createUserWithEmailAndPassword, getAuth, setPersistence, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { User } from "./schema/User";
import { getDownloadURL, getStorage, ref, StorageReference, uploadBytes } from "firebase/storage";
import { Item } from "./schema/item";
import { Voucher } from "./schema/Voucher";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "xxx",
  authDomain: "xxx",
  projectId: "xxx",
  storageBucket: "xxx",
  messagingSenderId: "xxx",
  appId: "xxx"
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
        await setPersistence(auth, browserSessionPersistence);
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
    await setPersistence(auth, browserSessionPersistence);
    await signInWithEmailAndPassword(auth, email, password);
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
    console.log(0)
    const docRef = doc(db, "items", id);
    console.log(1)
    const docSnap = await getDoc(docRef);
    console.log(2)

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
    const docRef = await addDoc(collection(db, "items"), {
        ...item,
        ["image"]: imageRef.fullPath,
        requests: []
    });
    console.log("Item Added!");
    try {
        await updateDoc(doc(db, "items", docRef.id), {
            id: docRef.id
        })
    } catch (err) {
        console.error(err);
    }
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
    if (newQuantity < 0) {
        console.log("Quantity Error");
        throw new Error("There's not enough stock for this item! Please wait till there's a restock!");
    }

    await updateDoc(doc(db, "items", item.id), {
        quantity: newQuantity,
        isAvailable: !(newQuantity <= 0)
    })

    //Update User balance
    const newBalance = user.balance - totalPx;
    updateUserBalance(user.email, newBalance);

    //Update User transaction history - transaction code is as such: time_itemName_quantity_isDelivered
    const newTransaction = Timestamp.now().seconds + "_" + item.name + "_" + quantity + "_false";
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

export async function updateItemQuantity(item: Item, quantityToAdd: number) {
    try {
        const newQuantity = item.quantity + quantityToAdd;
        await updateDoc(doc(db, "items", item.id), {
            quantity: newQuantity,
            isAvailable: !(newQuantity == 0)
        })
    } catch (err) {
        console.error(err);
    }
}

export async function readVouchers() {
    const querySnapshot = await getDocs(collection(db, "vouchers"));
    console.log("Retrieved all vouchers!");
    return querySnapshot;
}

export async function updateVoucherHighestBid(voucher: Voucher, bid: number, user: User) {
    try {
        await updateDoc(doc(db, "vouchers", voucher.id), {
            highestBid: bid
        })
        console.log(`Update highest bid for voucher ${voucher.id} to ${bid} pts!`);
        await updateDoc(doc(db, "vouchers", voucher.id), {
            owner: user.email
        })
        console.log(`Current highest bidder for voucher ${voucher.id} is ${user.email}!`);
    } catch (err) {
        throw err;
    }
}

export async function uploadVoucher(voucher: Voucher) {
    await addDoc(collection(db, "vouchers"), {
        ...voucher,
    });
}

export async function addVoucherToUser(voucher: string, user: User) {
    await updateDoc(doc(db, "users", user.email), {
        vouchers: arrayUnion(voucher)
    })
    console.log(`Added ${voucher} to user: email!`)
}

export async function allocateVoucher(voucher: Voucher) {
    //Update User balance
    const user = await getUserData(voucher.owner) as User;
    const newBalance = user.balance - voucher.highestBid;
    if (newBalance >=0 ) {
        updateUserBalance(user.email, newBalance);
    } else {
        throw new Error("The winner doesn't have enough balance! Voucher has no winners!");
    }

    //Update Voucher Info
    await updateDoc(doc(db, "vouchers", voucher.id), {
        hasOwner: true,
    })

    //Update User vouchers - id_quantity_owner_itemName_hasOwner_isRedeemed_itemId
    const voucherToAdd = voucher.id + "_" + voucher.quantity + "_" + voucher.owner + "_" + voucher.item + "_" + voucher.hasOwner + "_" + voucher.isRedeemed + "_" + voucher.itemId;
    addVoucherToUser(voucherToAdd, user);
}

export async function removeVoucherFromUser(voucher: string, user: User) {
    await updateDoc(doc(db, "users", user.email), {
        vouchers: arrayRemove(voucher)
    })
    console.log(`Removed ${voucher} from user: email!`)
}

export async function useVoucherFromUser(user: User, voucher: Voucher) {
    //Simulate Purchase of Item
    console.log(voucher.itemId);
    const item = await getItemData(voucher.itemId) as Item;
    return purchaseItem(item, 0, voucher.quantity, user).then(() => {
        //Update Voucher Info
        // await updateDoc(doc(db, "vouchers", voucher.id), {
        //     isRedeemed: true,
        // })

        //Update User vouchers
        const voucherToRemove = voucher.id + "_" + voucher.quantity + "_" + voucher.owner + "_" + voucher.item + "_" + voucher.hasOwner + "_" + false + "_" + voucher.itemId;
        const voucherToAdd = voucher.id + "_" + voucher.quantity + "_" + voucher.owner + "_" + voucher.item + "_" + voucher.hasOwner + "_" + true + "_" + voucher.itemId;
        removeVoucherFromUser(voucherToRemove, user);
        addVoucherToUser(voucherToAdd, user);
    }).catch(e => {
        throw e;
    })
}

export async function deleteVoucher(voucher: Voucher) {
    await deleteDoc(doc(db, "vouchers", voucher.id));
}