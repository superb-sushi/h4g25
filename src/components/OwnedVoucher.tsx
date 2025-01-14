import { Voucher } from '@/schema/Voucher'
import { BadgeDollarSign } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from 'react';

import { useToast } from "@/hooks/use-toast"
import { useVoucherFromUser } from '@/firebase';
import { User } from '@/schema/User';

const OwnedVoucher = ({voucher, index, user}: {voucher: Voucher, index: number, user: User}) => {

    const { toast } = useToast();

    const [isRedeemed, setIsRedeemed] = useState<boolean>(voucher.isRedeemed);

    const handleCheck = () => {
        setIsRedeemed(true);
        try {
          const performRedemption = async () => {
            await useVoucherFromUser(user, voucher);
            toast({
                title: "Redemption Successful!",
                description: `Your redemption of ${voucher.quantity}x ${voucher.item} is successful!`
            })
          }
          performRedemption();
        } catch (e) {
          console.log("Quantity Error Caught");
            toast({
                title: "Redemption Error",
                description: `${(e as Error).message}`
            })
        }
        
    }

  return (
    <div className=" flex items-center space-x-4 rounded-md border p-4" key={index}>
            {<BadgeDollarSign />}
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {voucher.item}
              </p>
              <p className="text-sm text-muted-foreground text-zinc-500 flex gap-1 items-end">
                Quantity to Redeem: <div className="font-semibold">{voucher.quantity}</div>
              </p>
            </div>
            <Switch disabled={isRedeemed} onCheckedChange={handleCheck}/>
          </div>
  )
}

export default OwnedVoucher;