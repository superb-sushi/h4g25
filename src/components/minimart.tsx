import ItemCard from "../components/ItemCard"
import { Item } from "../schema/item"
import { useState } from "react"

import "./styles/minimart.css";
import { User } from "@/schema/User";

const Minimart = ({user}: {user: User}) => {

  const defaultItem = {
    id: "",
    isAvailable: true,
    quantity: 1,
    name: "Cinammon Rolls",
    price: 4.50
  }


  const [items, setItems] = useState<Item[]>([defaultItem, defaultItem, defaultItem, defaultItem])
  setItems([defaultItem, defaultItem, defaultItem, defaultItem]);

  return (
    <div className="h-full w-full flex flex-wrap justify-evenly miniMartContainer">
      {items.filter(item => item.isAvailable).map(item => <ItemCard user={user} item={item} />)}
    </div>
  )
}

export default Minimart