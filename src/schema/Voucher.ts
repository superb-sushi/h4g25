export interface Voucher {
    id: string,
    quantity: number,
    owner: string,
    item: string,
    hasOwner: boolean,
    isRedeemed: boolean,
    itemId: string
}