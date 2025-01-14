export interface User {
    email: string,
    vouchers: string[],
    transactionHistory: string[],
    balance: number,
    isAdmin: boolean
}