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

import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { authenticateSignIn } from "../firebase";
import { useToast } from "@/hooks/use-toast"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const { toast } = useToast();

    const login = async () => {
        try {
            await authenticateSignIn(email, password);
            navigate("/home");
        } catch (err) {
            toast({
              title: "Login Error",
              description: `${(err as Error).message}`
            })
        }
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your login details below
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
                  required
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required onChange={e => setPassword(e.target.value)}/>
              </div>
              <Button className="w-full" onClick={login}>
                Login
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className=" font-semibold hover:underline">
                Sign up
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
