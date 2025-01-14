import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { updateUserTransactionHistory } from "@/firebase";
import { useEffect, useState } from "react";

const TransactionInfo = ({th}: {th: Array<string>}) => {

    const [isChecked, setIsChecked] = useState<boolean>(false);

    useEffect(() => {
        setIsChecked(th[3] == "true");
    }, [])

    function handleCheck(seconds: string, item: string, quantity: string, email: string) {
        const new_tH = seconds + "_" + item + "_" + quantity + "_true";
        const old_tH = seconds + "_" + item + "_" + quantity + "_false";
        const updateTH = async () => {
            await updateUserTransactionHistory(0, email, new_tH);
            await updateUserTransactionHistory(1, email, old_tH);
        }
        updateTH();
        setIsChecked(true);
    }

  return (
    <div className="w-full hover:bg-stone-300 duration-200 h-20 flex items-center">
        <Label className="transactionTime w-1/5 text-md font-normal pl-2.5 min-w-40">{(new Date(Number(th[0]) * 1000)).toLocaleString()}</Label>
        <Label className="transactionItemName w-1/5 text-md font-normal pl-2.5 min-w-40">{th[1]}</Label>
        <Label className="transactionEmail w-1/5 text-md font-normal min-w-40">{th[4]}</Label>
        <Label className="transactionQuantity w-1/5 text-md font-normal min-w-40 pl-9">{th[2]}</Label>
        <Label className="pl-3.5"><Checkbox disabled={isChecked} className="h-6 w-6" onCheckedChange={() => handleCheck(th[0], th[1], th[2], th[4])}/></Label>
    </div>
  )
}

export default TransactionInfo