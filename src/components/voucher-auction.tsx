import { useEffect, useState } from "react";
import { Voucher } from "../schema/Voucher";
import { readVouchers } from "@/firebase";
import VoucherCard from "./VoucherCard";
import { User } from "@/schema/User";

import {
  Gavel
} from "lucide-react"

const VoucherAuction = ({user}: {user: User}) => {

  const [vouchers, setVouchers] = useState<Voucher[]>([])

  useEffect(() => {
    const retrieveVouchers = async () => {
      try {
        const v = await readVouchers();
        const vsTemp = v.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        } as Voucher))
        setVouchers(vsTemp);
      } catch (err) {
        console.error(err);
      }
    }
    retrieveVouchers();
  }, [])

  return (
    <div className="w-full h-full flex flex-wrap gap-2.5 justify-center">
      {vouchers.filter(v => !v.hasOwner).length == 0 ? <div className="w-full h-full flex justify-center items-center text-zinc-400"><Gavel className="pr-1"/>No Ongoing Auction</div> : vouchers.filter(v => !v.hasOwner).map(v => <VoucherCard voucher={v} user={user}/>)}
    </div>
  )
}

export default VoucherAuction;