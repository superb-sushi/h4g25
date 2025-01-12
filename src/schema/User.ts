import { DocumentReference } from "firebase/firestore";

export interface User {
    email: string,
    vouchers: DocumentReference[],
    transactionHistory: string[],
    balance: number,
    isAdmin: boolean
}