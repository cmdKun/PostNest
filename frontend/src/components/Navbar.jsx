import React, { useEffect, useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {Card, CardContent} from "@/components/ui/card"



import NewPost from './pages/NewPost';
import Notifications  from './NotificationDropdown';

import Axios from './Axios'

import ProfileDropDown from './ProfileDropDown';

const Navbar = () => {
  const [profile, SetProfile] = useState()

  const getUser = () => {
      Axios.get("profile/").then((res) => {
          SetProfile(res.data)
          console.log("profile",res.data)       
         })
  }
  useEffect(() => {
    getUser()
  }, [])
  return (
    <div className='flex justify-center'>
        <Card className="mt-2 w-[55rem] h-[50px] flex justify-between items-center">
                <h1 className='ml-4 font-semibold text-lg'>PostNest</h1>
                <div className='flex flex-row-reverse items-center gap-4 mr-2'>
                <div className='flex items-center gap-1'>
                    <Avatar className="w-[25px] h-auto">
                    <AvatarImage src={`http://127.0.0.1:8000${profile?.pfp}`} />
                    <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <p className='text-sm cursor-pointer'>{profile?.user?.username}</p>
                    <ProfileDropDown username={profile?.user?.username} email={profile?.user?.email} bio={profile?.bio} pfp={`http://127.0.0.1:8000${profile?.pfp}`}/>
                </div>
                    <Notifications/>
                    <NewPost/>
                </div>
        </Card>
    </div>
  )
}

export default Navbar