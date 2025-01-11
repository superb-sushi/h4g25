import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useToast } from "@/hooks/use-toast";

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { signUp } from "../firebase";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const signup = async () => {
      console.log(email + " " + password)
        try {
          if (email == "") {
            throw new Error("Email field cannot be empty!")
          }
          if (password == "") {
            throw new Error("Password field cannot be empty!");
          }
          signUp(email, password);
          console.log("sign up done!");
          navigate("/home");
        } catch (err) {
            toast({
              title: "Sign Up Error",
              description: `${(err as Error).message}`
            })
        }
    }

    const { toast } = useToast();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Register an Account</CardTitle>
          <CardDescription>
            Enter your sign in details below
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required onChange={e => setPassword(e.target.value)}/>
              </div>
              <Button className="w-full" onClick={signup}>
                Sign Up
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to="/" className=" font-semibold hover:underline">
                Login Here
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
