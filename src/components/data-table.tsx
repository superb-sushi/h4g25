import { useEffect, useState } from "react";
import { User } from "../schema/User";
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import "./styles/data-table.css";

const DataTable = ({user}: {user: User}) => {

    const [ths, setThs] = useState<Array<string[]>>([]);

    let thArr = [] as Array<string[]>;

    useEffect(() => {
        if (thArr.length == 0) {
            user.transactionHistory.map(th => {
                thArr.push(th.split("_"));
            })
            setThs(thArr);
        }
    }, [])
  return (
    <div className="transactionContainer w-full h-full flex flex-col">
        <div className="w-full bg-stone-400 h-20 flex items-center">
            <Label className="transactionItemName w-1/4 text-xl pl-2.5 min-w-40">Item</Label>
            <Label className="transactionEmail w-1/4 text-xl min-w-40">Email</Label>
            <Label className="transactionQuantity w-1/4 text-xl min-w-40">Quantity</Label>
            <Label className="transactionQuantity w-1/4 text-xl min-w-40">Done</Label>
        </div>
        {ths.map(th => 
            <div className="w-full hover:bg-stone-300 duration-200 h-20 flex items-center">
                <Label className="transactionItemName w-1/4 text-md font-normal pl-2.5 min-w-40">{th[0]}</Label>
                <Label className="transactionEmail w-1/4 text-md font-normal min-w-40">{user.email}</Label>
                <Label className="transactionQuantity w-1/4 text-md font-normal min-w-40 pl-9">{th[1]}</Label>
                <Label className="pl-3.5"><Checkbox className="h-6 w-6"/></Label>
            </div>
        )}
    </div>
  )
}

export default DataTable