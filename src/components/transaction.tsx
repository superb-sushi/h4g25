import {} from "../firebase";
import DataTable from "./data-table";
import { User } from "../schema/User";

const Transaction = ({user}: {user: User}) => {
  return (
    <DataTable user={user}/>
  )
}

export default Transaction