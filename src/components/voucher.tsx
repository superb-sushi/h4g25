import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { useEffect, useState } from "react";
import { User } from "@/schema/User";

import { Voucher } from "../schema/Voucher";
import OwnedVoucher from "../components/OwnedVoucher"; 

const VoucherPage = ({user}: {user: User}) => {

  const v = {
    id: "",
    quantity: 10,
    owner: "calebazx@gmail.com",
    item: "Cinnamon Rolls",
    hasOwner: true
  } as Voucher;

  const [vouchers, setVouchers] = useState<Voucher[]>([v,v,v]);

  useEffect(() => {
    let vArr = [] as Array<string[]>;
    const getVouchers = async () => {
      const vTemp = user.vouchers;
      vTemp.forEach(v => {
        const temp = v.split("_");
        vArr.push(temp);
      })
      let voucherArr = [] as Array<Voucher>;
      vArr.forEach(v => {
        const voucher = {
          id: v[0],
          quantity: Number(v[1]),
          owner: v[2],
          item: v[3],
          hasOwner: v[4] == "true",
          isRedeemed: v[5] == "true",
          itemId: v[6]
        } as Voucher;
        voucherArr.push(voucher);
      })
      setVouchers(voucherArr);
    }
    getVouchers();
  }, [])

  return (
    <div className="ownTransactions w-full justify-center flex items-center">
        <Card className="w-[580px]">
          <CardHeader>
            <CardTitle>Your Vouchers</CardTitle>
            <CardDescription>You have {user.vouchers.length} voucher(s) (both used & unused).</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2.5 h-[500px] personalTransactionContainer">{vouchers.map((voucher, index) => <OwnedVoucher voucher={voucher} index={index} user={user}/>)}
          </CardContent>
          <CardFooter className="text-zinc-400">
            To use a voucher, toggle the corresponding voucher's switch on!
          </CardFooter>
        </Card>
      </div>
  )
}

export default VoucherPage;