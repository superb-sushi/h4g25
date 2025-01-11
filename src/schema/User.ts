import { DocumentReference } from "firebase/firestore";

export interface User {
    id: string,
    email: string,
    vouchers: DocumentReference[],
    transactionHistory: string[]
}