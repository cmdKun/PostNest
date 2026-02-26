import React from 'react'
import Axios from '../Axios';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {Card} from "@/components/ui/card"
import { Button } from '../ui/button';

import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";

import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { User } from 'lucide-react';
import { useNavigate } from "react-router";
import { toast } from 'sonner';

 const Discover = ({posts, savedPosts, likedPosts, following, getSavedLiked, getFollowing, setPosts}) => {

  const navigate = new useNavigate()

  const toggleLike = (postid) => {
    Axios.post(`toggleLike/${postid}/`).then((res) => {
    getSavedLiked()
    setPosts(posts.map(p => 
      p.id === postid ? { ...p, likes:res.data.Count}
      : p
    ))
    })
  }
  
  const toggleSave = (postid) => {
    Axios.post(`toggleSave/${postid}/`).then((res) => {
      getSavedLiked()
      setPosts(posts.map(p => 
      p.id === postid ? { ...p, saves:res.data.Count}
      : p
    ))
    })
  }
  const Follow = (userid) => {
    Axios.post(`follow/${userid}/`).then(() => {
      getFollowing()
    }).catch((err) => {
      toast.error(err.response.data.error)
    })
  }


  return (
    <div className="w-128 h-[86vh] flex overflow-x-hidden flex-col gap-2 my-scrollable-box ">
            {posts?.map((post) => (
            <Card className="w-[38rem] " key={post.id}>
              <div className='ml-4 mr-4 mt-4 flex justify-between items-center'>
                <div className='flex items-center gap-1'>
                  <Avatar className="w-[30px] h-auto">
                    <AvatarImage src={`http://127.0.0.1:8000${post?.profile?.pfp}`}/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className='cursor-pointer'>{post.profile?.user?.username || "Unknown"}</p>
                </div>
                <div className='flex items-center gap-2'>

                  {following.includes(post.profile.user.id) 
                  ? 
                  <Button size="sm" variant="outline" className="h-[25px]" onClick={() => Follow(post.profile.user.id)}>unfollow</Button> 
                  : 
                  <Button size="sm" className="h-[25px]" onClick={() => Follow(post.profile.user.id)}>Follow</Button> 
                  }   
                    <Button variant="outline" size="icon" className="h-[25px] w-auto p-1" onClick={()=> navigate(`/profile/${post?.profile?.user?.username}`)}>
                          <User />
                    </Button>
                </div>
              </div>
              <div className='flex flex-col m-4 border-y py-2 gap-2'>
                <p>{post.content}</p>

                  <div>
                  {post.image && <img src={`http://127.0.0.1:8000${post.image}`} className='w-auto h-48 rounded-lg '/>}

                </div>
              </div>
              <div className='flex items-center  mb-2 justify-between'>

                <p className='text-sm text-muted-foreground ml-4'>{post.created}</p>
                <div className='flex mr-4 gap-2'>
                  <div className='flex items-center gap-1'>
                    {likedPosts.includes(post.id) ?
                      <IoHeartSharp  onClick={() => toggleLike(post.id)} size={20} className='cursor-pointer'/>
                      :
                      <IoHeartOutline onClick={() => toggleLike(post.id)} size={20} className='cursor-pointer' />
                    }

                    <p className='text-sm text-muted-foreground'>{post.likes}</p>
                  </div>

                  <div className='flex items-center gap-1'>
                    {savedPosts.includes(post.id)
                     ? <IoBookmark size={20} onClick={() => toggleSave(post.id)} className='cursor-pointer' />
                     : <IoBookmarkOutline size={20} onClick={() => toggleSave(post.id)} className='cursor-pointer' /> }
                    
                    <p className='text-sm text-muted-foreground'>{post.saves}</p>
                  </div>
                 
                </div>
              </div>
            </Card>
          ))}
      </div>
  )
}
export default Discover;