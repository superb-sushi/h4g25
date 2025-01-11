import './App.css'
import { router } from "./router/Router";
import { RouterProvider } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster"


function App() {

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  )
}

export default App
