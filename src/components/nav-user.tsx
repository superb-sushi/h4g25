import {
  ChevronsUpDown,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
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

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { signUserOut, uploadImage, uploadItem, readUsers, updateUserBalance, readItems, uploadVoucher } from "../firebase";
import { Link } from "react-router-dom";
import { User } from "../schema/User";
import mwhicon from "../assets/mwhicon.jpg"
import { Item } from "@/schema/item"
import { useState } from "react"

import { useToast } from "@/hooks/use-toast"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "./ui/button"
import { Voucher } from "@/schema/Voucher"

export function NavUser({
  user,
}: {
  user: User
}) {
  const { isMobile } = useSidebar()

  const { toast } = useToast();

  const handleSignOut = () => {
    signUserOut();
  }

  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [isAddVoucher, setIsAddVoucher] = useState<boolean>(false);

  const [items, setItems] = useState<Item[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const defaultVoucher = {
    id: "",
    hasOwner: false,
    quantity: 0,
    item: "",
    highestBid: 0,
    itemId: "",
    owner: "",
    isRedeemed: false
  } as Voucher;

  const [voucherToUpload, setVoucherToUpload] = useState<Voucher>(defaultVoucher);

  const handleAddVoucherClick = () => {
    setIsUpdate(false);
    setIsAdd(false);
    setIsAddVoucher(true);
    const getItems = async () => {
      try {
        const i = await readItems();
        const itemsTemp = i.docs.map(doc => ({
          ...doc.data(),
      } as Item))
        setItems(itemsTemp);
      } catch (err) {
        console.error(err);
      }
    }
    getItems();
  }

  const [itemToUpload, setItemToUpload] = useState<Item>();

  const handleSelectItem = (item: string) => {
    const i = items.filter(i => i.name == item)[0];
    console.log(i.name);
    setVoucherToUpload(v => ({...v, item: i.name}));
    console.log(i.id)
    setVoucherToUpload(v => ({...v, itemId: i.id}));
    setItemToUpload(i);
  }

  const handleVoucherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setVoucherToUpload(v => ({...v, [e.target.id]: (e.target.id == "quantity") || (e.target.id == "highestBid") ? Number(e.target.value) : e.target.value}));
    console.log(e.target.id + ": " + e.target.value)
  };

  const handleVoucherUpload = () => {
    if (itemToUpload == undefined) {
      toast({
        title: "Voucher Upload Error",
        description: "Please select and item first!"
      })
      return;
    }
    if (voucherToUpload.quantity < 1 || !Number.isInteger(voucherToUpload.quantity)) {
      console.log(voucherToUpload.quantity);
      toast({
        title: "Voucher Upload Error",
        description: "Please select enter an appropriate quantity!"
      })
      return;
    }
    try {
      const uploadVoucherLive = async () => {
        await uploadVoucher(voucherToUpload);
      }
      uploadVoucherLive();
      toast({
        title: "Voucher Upload Successful",
        description: `"Voucher for ${voucherToUpload.quantity}x ${voucherToUpload.item} has been uploaded!`
      });
    } catch (err) {
      console.log(err);
        toast({
          title: "Voucher Upload Error",
          description: `${(err as Error).toString()}`
        });
    }
  }

  const handleUpdateClick = () => {
    setIsUpdate(true);
    setIsAdd(false);
    setIsAddVoucher(false);
    const getUser = async () => {
      const retrieveUsers = async () => {
          try {
            const u = await readUsers();
            const usersTemp = u.docs.map(doc => ({
                ...doc.data(),
            } as User))
            setUsers(usersTemp);
          } catch (err) {
            console.error(err);
          }
        }
        retrieveUsers();
    }
    getUser();
  }

  const handleAddClick = () => {
    setIsUpdate(false);
    setIsAdd(true);
    setIsAddVoucher(false);
  }

  const defaultItem = {
    id: "",
    isAvailable: true,
    quantity: 0,
    name: "",
    price: 0,
    image: ""
  } as Item;

  const defaultUser = {
    email: "",
    vouchers: [],
    transactionHistory: [],
    balance: 0,
    isAdmin: false
  } as User;

  const [item, setItem] = useState<Item>(defaultItem);
  const [itemImage, setItemImage] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setItem(item => ({...item, [e.target.id]: (e.target.id == "quantity") || (e.target.id == "price") ? Number(e.target.value) : e.target.value}));
  };

  // to handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files![0];
      if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
          setItemImage(e.target.files![0]);
      } else {
        toast({
          title: "Image File Error",
          description: "Invalid File Type! Please only use .jpg/.jpeg/.png"
        })
      }
  }

  const handleUpload = () => {
        try {
            //Guard Clauses
            (Object.keys(item) as (keyof typeof item)[]).forEach((key) => {
                if (key != "id" && key != "isAvailable" && key !="image" && item[key] == defaultItem[key]) {
                  throw `Invalid Upload (Missing Fields:${key})`;
                }
            });
            
            //Handle image upload + Item Uploads
            const itemData = async () => {
              const imageRef = await uploadImage(itemImage!);
              await uploadItem(item, imageRef);
            }
            itemData();

        
            toast({
              title: "Upload Successful",
              description: `"${item.name}" has been successfully added!`
            });
        } catch (err) {
          console.log(err);
            toast({
              title: "Upload Error",
              description: `${(err as Error).toString()}`
            });
        }
  }

  const [balance, setBalance] = useState<number>(0);
  const [balanceToAdd, setBalanceToAdd] = useState<number>(0);
  const [userToUpdate, setUserToUpdate] = useState<User>();

  const handleSelectEmail = (email: string) => {
    const user = users.filter(user => user.email == email)[0];
    setUserToUpdate(user);
    setBalance(user.balance);
  }

  const handleBalanceChange = (value: number) => {
    setBalanceToAdd(value);
  }

  const handleUpdateBalance = () => {
    try {
      const updateUserNewBalance = async () => {
        await updateUserBalance(userToUpdate!.email, balance);
      }
      updateUserNewBalance();
  
      toast({
        title: "Update Successful",
        description: `"${userToUpdate!.email}"'s balance has been set to S$${Number(balance).toFixed(2)}!`
      });
    } catch (err) {
      console.log(err);
        toast({
          title: "Update Error",
          description: `${(err as Error).toString()}`
        });
    }
  }

  return (
    <AlertDialog>
      {isAdd ?
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Minimart Item</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col justify-center items-center">
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Label htmlFor="name" className="text-zinc-800">Item Name</Label>
                  <Input type="text" id="name" placeholder="E.g. Apple" onChange={e => handleChange(e)}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Label htmlFor="price" className="text-zinc-800">Price</Label>
                  <Input type="number" id="price" placeholder="2.50" min={0.10} onChange={e => handleChange(e)}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Label htmlFor="quantity" className="text-zinc-800">Quantity</Label>
                  <Input type="number" id="quantity" placeholder="1" min={1} step={1} onChange={e => handleChange(e)}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Label htmlFor="image" className="text-zinc-800">Picture</Label>
                  <Input id="image" type="file" onChange={e => handleImageChange(e)}/>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUpload()}>Upload</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      : isUpdate ?
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update User Balance</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col justify-center items-center">
                <div className="flex w-full max-w-sm items-center pt-2.5 justify-between">
                  <div className="flex flex-col">
                    <Select onValueChange={email => handleSelectEmail(email)}>
                      <div className="text-zinc-800 font-bold">User Email</div>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="User Email"/>
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => <SelectItem value={user.email}>{user.email}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="selectedUserBalance text-3xl font-bold text-zinc-900">S${Number(balance).toFixed(2)}</div>
                </div>
                <div className="flex w-full max-w-sm items-end gap-1.5 pt-2.5">
                  <div>
                    <Label htmlFor="balance" className="text-zinc-800">Add to Balance</Label>
                    <Input type="number" id="balance" placeholder="0.01" step={0.01} onChange={e => handleBalanceChange(Number(e.target.value))}/>
                  </div>
                  <Button disabled={!users.includes(userToUpdate!)}variant="default" onClick={() => (balance + balanceToAdd) >= 0 ? setBalance(balance + balanceToAdd) : setBalance(0)}>Add</Button>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {setBalance(0); setBalanceToAdd(0.01); setUserToUpdate(defaultUser)}} >Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleUpdateBalance()}>Upload</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        : isAddVoucher ?
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Voucher</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col justify-center items-center">
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Select onValueChange={item => handleSelectItem(item)}>
                    <div className="text-zinc-800 font-bold">Minimart Item</div>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Item"/>
                    </SelectTrigger>
                    <SelectContent>
                      {items.map(item => <SelectItem value={item.name}>{item.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Label htmlFor="highestBid" className="text-zinc-800">Starting Price</Label>
                  <Input type="number" id="highestBid" placeholder="2.50" min={0.10} onChange={e => handleVoucherChange(e)}/>
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 pt-2.5">
                  <Label htmlFor="quantity" className="text-zinc-800">Quantity</Label>
                  <Input type="number" id="quantity" placeholder="1" min={1} step={1} onChange={e => handleVoucherChange(e)}/>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleVoucherUpload()}>Upload</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
        : <></>
      }

      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={mwhicon} />
                  <AvatarFallback className="rounded-lg">MWH</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-lg font-bold">S${user.balance.toFixed(2)}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              {user.isAdmin ? 
              <>
                <DropdownMenuItem>
                <AlertDialogTrigger asChild onClick={() => handleUpdateClick()}>
                    <div>Update Balance</div>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <AlertDialogTrigger asChild onClick={() => handleAddClick()}>
                    <div>Add Item</div>
                  </AlertDialogTrigger>
                </DropdownMenuItem> 
                <DropdownMenuItem>
                <AlertDialogTrigger asChild onClick={() => handleAddVoucherClick()}>
                    <div>Add Voucher</div>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </>
              : <></>}
              <DropdownMenuItem>
                <Link onClick={handleSignOut} to="/">Log out </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </AlertDialog>
  )
}
