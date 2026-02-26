import React, { useEffect,useState } from 'react'
import Axios from '../Axios';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner'

const SignIn = () => {
  const [Username, SetUsername] = useState()
  const [Password, SetPassword] = useState()

  const navigate = new useNavigate();

  useEffect(() => {
    Axios.get("csrftoken").then((res) => {
    })
  }, [])
  const handleSubmit = async (e) => {
      e.preventDefault()    
      const data = 
          {
            username: Username.toLowerCase(),
            password: Password
          }
          try{
            const response = await Axios.post("signin/", data)
            if(response.status === 200){
              navigate("/feed")
            }
          } catch(err){
                toast.error(err.response.data.error)
            
          }

      }

  return (
        <div className="flex flex-col gap-2 justify-center h-screen items-center ">
          <form onSubmit={handleSubmit}>
          <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label>Username</Label>
                  <Input
                    required
                    placeholder="Enter your username"
                    onChange={(e) => SetUsername(e.target.value)} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password"
                  required 
                  onChange={(e) => SetPassword(e.target.value)}
                  />
                </div>
              </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <p href="" className='text-sm text-muted-foreground my-2'>
              Don't have an accout ?, <a className='underline cursor-pointer' onClick={() => navigate("/signup")}>Create Account</a>
            </p>
          </CardFooter>
        </Card>
    </form>
        </div>
  )
}
export default SignIn;
