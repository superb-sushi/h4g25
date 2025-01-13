import {} from "../firebase";
import DataTable from "./data-table";
import { User } from "../schema/User";
import "./styles/transaction.css";

import { Clock } from "lucide-react"
 
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useEffect, useState } from "react";

const Transaction = ({user}: {user: User}) => {

  const [tHs, setTHs] = useState<Array<string[]>>([]);

  useEffect(() => {
    let thArr = [] as Array<string[]>;
    user.transactionHistory.forEach(th => {
      const temp = th.split("_");
      thArr.push(temp);
    })
    setTHs(thArr);
  }, [])

  return (
    <>
      <div className="ownTransactions h-full w-full justify-center flex items-center">
        <Card className="w-[580px]">
          <CardHeader>
            <CardTitle>Your Transactions</CardTitle>
            <CardDescription>You have {user.transactionHistory.length} total transaction(s).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 h-[500px] personalTransactionContainer">{tHs.sort((a, b) => {
            return a[0] < b[0] ? 1 : b[0] < a[0] ? -1 : 0
          }).map((transaction, index) =>
          <div className=" flex items-center space-x-4 rounded-md border p-4" key={index}>
            {<Clock />}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {transaction[2] + "x " + transaction[1]}
              </p>
              <p className="text-sm text-muted-foreground text-zinc-500">
                {"Ordered on : " + (new Date(Number(transaction[0]) * 1000)).toLocaleString()}
              </p>
            </div>
            <Switch checked={transaction[3] == "true"} disabled/>
          </div>
          )}
          </CardContent>
          <CardFooter className="text-zinc-400">
            Note that orders are non-refundable!
          </CardFooter>
        </Card>
      </div>
      {user.isAdmin ? <DataTable /> : <></>}
    </>
  )
}

export default Transaction