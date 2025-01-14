import { useEffect, useState } from "react";
import { Voucher } from "../schema/Voucher";
import { readVouchers } from "@/firebase";
import VoucherCard from "./VoucherCard";
import { User } from "@/schema/User";

const VoucherAuction = ({user}: {user: User}) => {

  const [vouchers, setVouchers] = useState<Voucher[]>([])

  useEffect(() => {
    const retrieveVouchers = async () => {
      try {
              const i = await readVouchers();
              const itemsTemp = i.docs.map(doc => ({
                  ...doc.data(),
                  id: doc.id,
              } as Voucher))
              setVouchers(itemsTemp);
            } catch (err) {
                console.error(err);
            }
    }
    retrieveVouchers();
  }, [])

  return (
    <div className="w-full h-full flex flex-wrap gap-2.5 justify-center">
      {vouchers.map(v => <VoucherCard voucher={v} user={user}/>)}
    </div>
  )
}

export default VoucherAuction;