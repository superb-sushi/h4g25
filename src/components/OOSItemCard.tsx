import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Check } from "lucide-react"
  

import { Item } from "../schema/item"
import { useEffect, useState } from "react"

import "./styles/ItemCard.css";

import scr from "../assets/scr.jpg";
import { Button } from "./ui/button";
import { User } from "@/schema/User";
import { updateItemRequests, updateItemQuantity } from "@/firebase";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";

import { useToast } from "@/hooks/use-toast"

const OOSItemCard = ({item, user}: { item: Item, user: User}) => {
    
    const [haveRequested, setHaveRequested] = useState<boolean>(false);
    const [restockQ, setRestockQ] = useState<number>(1);

    const { toast } = useToast();

    useEffect(() => {
      if (item.requests.includes(user.email)) {
        setHaveRequested(true);
      }
    }, [])

    const handleCancel = () => {
      setRestockQ(1);
    }

    const handleRestock = () => {
      try {
        updateItemQuantity(item, restockQ);
        toast({
          title: "Restock Successful",
          description: `${item.name} has been successfully restocked! (+${restockQ})`
        })
        setRestockQ(1);
      } catch (e) {
        toast({
          title: "Restock Error!",
          description: `${(e as Error).message}`
        })
      }
    }

    const handleRequest = () => {
        setHaveRequested(true);
        updateItemRequests(user.email, item);
    }

  return (
    <AlertDialog>
      <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{item.name}</AlertDialogTitle>
            <AlertDialogDescription>
                Select quantity to restock below:
                <div className="selectQuantity flex items-end justify-between">
                    <div className="selectQuantity flex items-center gap-2 pt-4">
                        <Label htmlFor="restockQ" className="font-medium text-md text-zinc-800">Quantity</Label>
                        <Input className="w-16" type="number" id="restockQ" placeholder="1" min={1} step={1} onChange={e => setRestockQ(Number(e.target.value))}/>
                    </div>
                </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleCancel()}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRestock()}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>

      <Card className="miniMartCardContainer hover:bg-zinc-100 duration-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
          <CardDescription>S${item.price.toFixed(2)}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={scr} className="itemImg rounded-xl"/>
        </CardContent>
        <CardFooter>
          {user.isAdmin
          ? <AlertDialogTrigger>
              <Button variant="outline">Restock</Button>
            </AlertDialogTrigger>
          : haveRequested 
          ?  <Button variant="outline" disabled>
                  Requested <Check /> 
            </Button>
          : <Button variant="outline" onClick={() => handleRequest()}>
              Request
          </Button>}
        </CardFooter>
      </Card> 
    </AlertDialog>
  )
}

export default OOSItemCard;