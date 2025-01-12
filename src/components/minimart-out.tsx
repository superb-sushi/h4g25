import { useState } from "react"
import OOSItemCard from "./OOSItemCard"
import { Item } from "@/schema/item"

const MinimartOut = () => {
  const defaultItem = {
    id: "",
    isAvailable: false,
    quantity: 1,
    name: "Cinammon Rolls",
    price: 4.50
  }


  const [items, setItems] = useState<Item[]>([defaultItem, defaultItem, defaultItem, defaultItem])
  setItems([defaultItem, defaultItem, defaultItem, defaultItem]);

  return (
    <div className="h-full w-full flex flex-wrap justify-evenly miniMartContainer">
      {items.filter(item => !item.isAvailable).map(item => <OOSItemCard item={item} />)}
    </div>
  )
}

export default MinimartOut