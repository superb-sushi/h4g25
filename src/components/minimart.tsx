import ItemCard from "../components/ItemCard"
import { Item } from "../schema/item"

import "./styles/minimart.css";
import { User } from "@/schema/User";

const Minimart = ({items, user}: {items: Item[], user: User}) => {

  return (
    <div className="h-full w-full flex flex-wrap justify-evenly miniMartContainer">
      {items.filter(item => item.isAvailable).map(item => <ItemCard user={user} item={item} />)}
    </div>
  )
}

export default Minimart