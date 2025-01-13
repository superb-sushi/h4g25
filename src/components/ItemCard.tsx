import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
  

import { Item } from "../schema/item"
import { useEffect, useState } from "react"

import "./styles/ItemCard.css";

import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useToast } from "@/hooks/use-toast"

import { User } from "@/schema/User";
import { getImageUrl, purchaseItem } from "@/firebase";

const ItemCard = ({user, item}: {user:User, item: Item}) => {
    
    const [stock, setStock] = useState<number>(0);
    const [quantity, setQuantity] = useState<number>(1);
    const [totalPx, setTotalPx] = useState<number>(item.price);

    useEffect(() => {
        const initStock = () => {
          setStock(item.quantity);
        }
        initStock();
      }, [])

    const [imageUrl, setImageUrl] = useState<string>("");
    useEffect(() => {
        const getImage = async () => {
          const url = await getImageUrl(item.image);
            setImageUrl(url);
        }
        getImage();
      }, [item.image])

    const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = (e.target.value as unknown) as number;
        setQuantity(newQuantity);
        setTotalPx(newQuantity * item.price);
    }

    const { toast } = useToast();

    const handleCancel = () => {
      setQuantity(1);
      setTotalPx(item.price);
    }

    const handlePurchase = () => {
        try {
          purchaseItem(item, totalPx, quantity, user);
          toast({
            title: "Purchase Successful!",
            description: `Your transaction of "${quantity} ${item.name}(s)" has been recorded! Please reload the page to reflect your new balance!`
          })
        } catch (e) {
            toast({
                title: "Purchase Error",
                description: `${(e as Error).message}`
              })
        }
    }

  return (
    <AlertDialog>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{item.name}</AlertDialogTitle>
            <AlertDialogDescription>
                Select your quantity below:
                <div className="selectQuantity flex items-end justify-between">
                    <div className="selectQuantity flex items-center gap-2 pt-4">
                        <Label htmlFor="quantity" className="font-medium text-md text-zinc-800">Quantity</Label>
                        <Input className="w-16" type="number" id="quantity" placeholder="1" min={1} max={3} onChange={e => handleChangeQuantity(e)}/>
                    </div>
                    <div className={totalPx > user.balance ?  "totalPx font-bold text-lg text-red-600" : "totalPx font-bold text-lg text-zinc-950"}>
                        S${totalPx.toFixed(2)}
                    </div>
                </div>
                <div className="insufficientBalanceText pt-1 text-xs text-zinc-400">
                  {totalPx > user.balance ? "You do not have sufficient funds." : <></>}
                </div>
                <div className="insufficientStock pt-1 text-xs text-zinc-400">
                  {quantity > stock ? "There's not enough stock." : <></>}
                </div>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleCancel()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handlePurchase()} disabled={totalPx > user.balance || quantity > stock}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    <Card className="miniMartCardContainer hover:bg-zinc-100 duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
        <CardDescription>S${item.price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={imageUrl} className="itemImg rounded-xl"/>
      </CardContent>
      <CardFooter>
        <div className="text-sm font-normal text-neutral-400">{stock} in-stock!</div>
        <div className="flex-1"></div>
        <AlertDialogTrigger><Button variant="ghost">Buy</Button></AlertDialogTrigger>
      </CardFooter>
    </Card>
    </AlertDialog>
  )
}

export default ItemCard