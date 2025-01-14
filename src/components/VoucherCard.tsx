import { Voucher } from "../schema/Voucher";
import {
    TicketPlus,
    TicketCheck
} from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";

import { allocateVoucher, updateVoucherHighestBid } from "@/firebase";  
import { User } from "@/schema/User";

import { useToast } from "@/hooks/use-toast"

const VoucherCard = ({voucher, user}: {voucher: Voucher, user: User}) => {

    const [highestBid, setHighestBid] = useState<number>(voucher.highestBid);
    const [currBid, setCurrBid] = useState<number>(0.1);

    const { toast } = useToast();

    const handleBid = async () => {
        updateVoucherHighestBid(voucher, currBid, user).then(() => {
            setHighestBid(currBid);
            toast({
                title: "Bid Successful",
                description: `Your bid of S$${Number(currBid).toFixed(2)} is now the highest bid!`
            })
            setCurrBid(0.1);
        }).catch(e => {
            toast({
                title: "Bid Error",
                description: `${e.message}`
            })
        })
    }

    const handleEndAuction = () => {
        try {
            const endAuction = async () => {
                await allocateVoucher(voucher);
            }
            endAuction();
            toast({
                title: "Auction Ended Successful",
                description: "The voucher has been allocated to the highest bidder!"
            })
        } catch (e) {
            toast({
                title: "Auction End Error",
                description: `${(e as Error).message}`
            })
        }
    }

  return (
    <Card className="h-[250px] w-[500px] border-4 flex items-center justify-between gap-2.5">
        <div>
            <CardHeader>
                <CardTitle className="text-xl font-bold">{voucher.item}</CardTitle>
                <CardDescription>Click "Bid" to raise the voucher's price!</CardDescription>
            </CardHeader>
            <CardContent className="w-full">
                <p>This voucher can be used to redeem <strong>{voucher.quantity}x {voucher.item}</strong>.</p>
            </CardContent>
            <CardFooter>
            <div className="flex gap-1 items-center">
                <Popover>
                    <PopoverTrigger>
                            <Button>Bid {<TicketPlus />}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                        <Label htmlFor="bidAmount" className="text-zinc-800">Bid Amount</Label>
                        <Input type="number" id="bidAmount" placeholder="0.10" step={0.10} onChange={e => setCurrBid(Number(e.target.value))}/>
                        <div className="insufficientBid pt-1 text-xs text-zinc-400">
                            {currBid <= highestBid ? "Your bid is too low." : <></>}
                        </div>
                        <Button className="mt-4" disabled={currBid <= highestBid} onClick={handleBid}>Confirm</Button>
                    </PopoverContent>
                </Popover>
                {user.isAdmin ? <Button variant="outline" onClick={handleEndAuction}>End Auction {<TicketCheck />}</Button> : <></>}
            </div>
            </CardFooter>
        </div>
        <div className="text-5xl font-bold pr-4">S${Number(highestBid).toFixed(2)}</div>
    </Card>
  )
}

export default VoucherCard