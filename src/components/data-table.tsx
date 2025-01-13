import { useEffect, useState } from "react";
import { User } from "../schema/User";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import "./styles/data-table.css";
import { readUsers, updateUserTransactionHistory } from "@/firebase";

const DataTable = () => {

    const [ths, setThs] = useState<Array<string[]>>([]);

    // useEffect(() => {
    //     if (thArr.length == 0) {
    //         user.transactionHistory.map(th => {
    //             thArr.push(th.split("_"));
    //         })
    //         setThs(thArr);
    //     }
    // }, [])

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

    function handleCheck(seconds: string, item: string, quantity: string, email: string) {
        console.log("Checked!");
        const new_tH = seconds + "_" + item + "_" + quantity + "_true";
        const old_tH = seconds + "_" + item + "_" + quantity + "_false";
        const updateTH = async () => {
            await updateUserTransactionHistory(0, email, new_tH);
            await updateUserTransactionHistory(1, email, old_tH);
        }
        updateTH();
    }

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
                <div className="w-full hover:bg-stone-300 duration-200 h-20 flex items-center">
                    <Label className="transactionTime w-1/5 text-md font-normal pl-2.5 min-w-40">{(new Date(Number(th[0]) * 1000)).toLocaleString()}</Label>
                    <Label className="transactionItemName w-1/5 text-md font-normal pl-2.5 min-w-40">{th[1]}</Label>
                    <Label className="transactionEmail w-1/5 text-md font-normal min-w-40">{th[4]}</Label>
                    <Label className="transactionQuantity w-1/5 text-md font-normal min-w-40 pl-9">{th[2]}</Label>
                    <Label className="pl-3.5"><Checkbox className="h-6 w-6" onCheckedChange={() => handleCheck(th[0], th[1], th[2], th[4])}/></Label>
                </div>
            )}
        </div>
    </>
  )
}

export default DataTable