import { useEffect, useState } from "react";
import { User } from "../schema/User";
import { Label } from "@/components/ui/label"
import "./styles/data-table.css";
import { readUsers } from "@/firebase";
import TransactionInfo from "./TransactionInfo";

const DataTable = () => {

    const [ths, setThs] = useState<Array<string[]>>([]);

    useEffect(() => {
        let thArr = [] as Array<string[]>;
        const retrieveUsers = async () => {
            try {
                const u = await readUsers();
                const usersTemp = u.docs.map(doc => ({
                    ...doc.data(),
                } as User))
                for (let i = 0; i < usersTemp.length; i++) {
                    usersTemp[i].transactionHistory.forEach(th => {
                        const temp = th.split("_");
                        temp.push(usersTemp[i].email);
                        thArr.push(temp);
                    })
                }
                setThs(thArr);
            } catch (err) {
                console.error(err);
            }
        }
        retrieveUsers();

    }, [])

  return (
    <>
        <div className="transactionContainer w-full h-full flex flex-col">
            <Label className="ownTransactionContainer text-3xl pb-1">All Transactions</Label>
            <div className="w-full bg-stone-400 h-20 flex items-center">
                <Label className="transactionTime w-1/5 text-xl pl-2.5 min-w-40">Time</Label>
                <Label className="transactionItemName w-1/5 text-xl pl-2.5 min-w-40">Item</Label>
                <Label className="transactionEmail w-1/5 text-xl min-w-40">Email</Label>
                <Label className="transactionQuantity w-1/5 text-xl min-w-40">Quantity</Label>
                <Label className="transactionQuantity w-1/5 text-xl min-w-40">Done</Label>
            </div>
            {ths.filter(th => th[3] == "false").sort((a, b) => {
                return a[0] < b[0] ? -1 : b[0] < a[0] ? 1 : 0;
            }).map(th => 
                <TransactionInfo th={th}/>
            )}
        </div>
    </>
  )
}

export default DataTable