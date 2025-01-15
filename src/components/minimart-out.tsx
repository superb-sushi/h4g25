import OOSItemCard from "./OOSItemCard"
import { Item } from "@/schema/item"
import { User } from "@/schema/User";
import { Package } from "lucide-react";

const MinimartOut = ({items, user}: {items: Item[], user: User}) => {

  return (
    <div className="h-full w-full flex flex-wrap justify-evenly miniMartContainer">
      {items.filter(item => !item.isAvailable || item.quantity <= 0).length == 0 ? <div className="w-full h-full flex justify-center items-center text-zinc-400"><Package className="pr-1"/>All in Stock</div> :items.filter(item => !item.isAvailable).map(item => <OOSItemCard item={item} user={user}/>)}
    </div>
  )
}

export default MinimartOut