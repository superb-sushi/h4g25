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
import { useState } from "react"

import "./styles/ItemCard.css";

import scr from "../assets/scr.jpg";
import { Button } from "./ui/button";

const OOSItemCard = ({item}: { item: Item}) => {
    
    const [haveRequested, setHaveRequested] = useState<boolean>(false);

    const handleRequest = () => {
        setHaveRequested(true);
    }

  return (
    <Card className="miniMartCardContainer hover:bg-zinc-100 duration-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
        <CardDescription>S${item.price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={scr} className="itemImg rounded-xl"/>
      </CardContent>
      <CardFooter>
        {haveRequested 
        ?   <Button variant="outline" disabled>
                Requested <Check /> 
            </Button>
        : <Button variant="outline" onClick={() => handleRequest()}>
            Request
        </Button>}
      </CardFooter>
    </Card> 
  )
}

export default OOSItemCard;