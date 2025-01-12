import "./styles/HomePage.css"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"

import Minimart from "../components/minimart";
import MinimartOut from "../components/minimart-out";
import Voucher from "../components/voucher";
import VoucherAuction from "../components/voucher-auction";
import Transaction from "../components/transaction";
import { User } from "@/schema/User"
import { getCurrentUser, getUserData, readItems } from "@/firebase"
import { Item } from "@/schema/item"

const HomePage = () => {

  const [isMA, setIsMA] = useState<boolean>(true);
  const [isMO, setIsMO] = useState<boolean>(false);
  const [isV, setIsV] = useState<boolean>(false);
  const [isVA, setIsVA] = useState<boolean>(false);
  const [isH, setIsH] = useState<boolean>(false);

  const defaultUser = {
    email: "",
    vouchers: [],
    transactionHistory: [],
    balance: 0,
    isAdmin: false
  } as User

  const [user, setUser] = useState<User>(defaultUser);

  useEffect( () => {
    const getUser = async () => {
      const email = await getCurrentUser()!.email!;
      const user = await getUserData(email) as User;
      setUser(user)
    }
    getUser();
  },[])

  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    const retrieveItems = async () => {
      try {
        const i = await readItems();
        const itemsTemp = i.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
        } as Item))
        setItems(itemsTemp);
      } catch (err) {
          console.error(err);
      }
    }
    retrieveItems();
  }, [])

  return (
    <SidebarProvider> 
      <AppSidebar user={user} setStates={[setIsMA, setIsMO, setIsV, setIsVA, setIsH]}/>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="homeContent flex-1 flex items-center justify-center">
          {isMA ? <Minimart items={items} user={user}/> : isMO ? <MinimartOut items={items}/> : isV ? <Voucher/> : isVA ? <VoucherAuction /> : isH ? <Transaction /> : <></>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default HomePage