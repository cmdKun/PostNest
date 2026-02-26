import React, {useEffect, useState} from 'react'
import Navbar from '../Navbar'
import Axios from '../Axios';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {Card, CardContent} from "@/components/ui/card"
;
import ProfileTabs from '../ProfileTabs';
import { useParams } from 'react-router';


import { IoHeartOutline } from "react-icons/io5";
import { IoHeartSharp } from "react-icons/io5";

import { IoBookmarkOutline } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";

const Profile = () => {
  const {username} = useParams();
  const [profile, SetProfile] = useState()
  const [likedPosts, setLikedPosts] = useState([]); 
  const [savedPosts, setSavedPosts] = useState([]);
  





  const getUser = () => {
      Axios.get(`publicprofile/${username}`).then((res) => {
          SetProfile(res.data)
        })
  }

  const getSavedLiked = () => {
    Axios.get("profile/").then((res) => {
      const LikedIds = res.data.liked_posts.map(post => post.id);
      const SavedIds = res.data.saved_posts.map(post => post.id)

      setLikedPosts(LikedIds)
      setSavedPosts(SavedIds)    
          })
  }

  useEffect(() => {
    getUser()
    getSavedLiked()
  }, [username])

const toggleLike = (postid) => {
  Axios.post(`toggleLike/${postid}/`).then((res) => {
    const { Liked, Count } = res.data;


    SetProfile(prev => ({
      ...prev,
      liked: prev.liked.map(p =>
        p.id === postid ? { ...p, likes: Count } : p
      ),
      saved: prev.saved.map(p =>
        p.id === postid ? { ...p, likes: Count } : p
      )
    }));

    if (Liked) {
      setLikedPosts(prev => [...prev, postid]);
    } else {
      setLikedPosts(prev => prev.filter(id => id !== postid));
    }
  }).catch(err => console.error("Toggle like failed", err));
}

const toggleSave = (postid) => {
  Axios.post(`toggleSave/${postid}/`).then((res) => {
    const { Saved, Count } = res.data;


    SetProfile(prev => ({
      ...prev,
      liked: prev.liked.map(p =>
        p.id === postid ? { ...p, saves: Count } : p
      ),
      saved: prev.saved.map(p =>
        p.id === postid ? { ...p, saves: Count } : p
      )
    }));

    if (Saved) {
      setSavedPosts(prev => [...prev, postid]);
    } else {
      setSavedPosts(prev => prev.filter(id => id !== postid));
    }
  }).catch(err => console.error("Toggle save failed", err));
}

  return (
    <div className='flex flex-col gap-2'>
      <Navbar/>
      <div className='flex items-center justify-center'>
        <Card className="w-[65vh] h-[90vh] flex overflow-x-hidden -2 my-scrollable-box flex flex-col items-center ">
          <div className="flex flex-col gap-2 items-center mt-6">


              <Avatar className="w-[90px] h-auto mt-6">
                  <AvatarImage src={`http://127.0.0.1:8000${profile?.pfp}`} />
                <AvatarFallback>CN</AvatarFallback>
           </Avatar>
           <div className='flex flex-col gap-2 font-manrope items-center'>
              <p>{profile?.username}</p>
              <p>{profile?.bio}</p>
           </div>

          </div>
          
          <div className='flex items-center justify-center gap-4 mt-6 font-manrope'>
            <div className='flex flex-col items-center w-20'>
              <p>{profile?.posts.length}</p>
              <p>Posts</p>
            </div>
            <div className='flex flex-col items-center w-20'>
              <p>{profile?.followers_count}</p>
              <p>Followers</p>
            </div>
            <div className='flex flex-col items-center w-20'>
              <p>{profile?.following_count}</p>
              <p>Following</p>
            </div>

          </div>

          {profile?.isowner ? 

          <div>
            <ProfileTabs profile={profile} toggleSave={toggleSave} toggleLike={toggleLike} savedPosts={savedPosts} likedPosts={likedPosts} />
          </div>

           : 

             <div className="w-128 mt-4 ">
            {profile?.posts?.map((post) => (
            <Card className="w-[36rem]" key={post.id}>
              <div className='ml-4 mr-4 mt-4 flex justify-between items-center'>
                <div className='flex items-center gap-1'>
                  <Avatar className="w-[30px] h-auto">
                    <AvatarImage src={`http://127.0.0.1:8000${profile?.pfp}`}/>
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <p className='cursor-pointer'>{profile?.username || "Unknown"}</p>
                </div>
                {/* <div className='flex items-center gap-2'>

                  {following.includes(post.profile.user.id) 
                  ? 
                  <Button size="sm" variant="outline" className="h-[25px]" onClick={() => Follow(post.profile.user.id)}>unfollow</Button> 
                  : 
                  <Button size="sm" className="h-[25px]" onClick={() => Follow(post.profile.user.id)}>Follow</Button> 
                  }   
                    <Button variant="outline" size="icon" className="h-[25px] w-auto p-1" onClick={()=> navigate(`/profile/${username}`)}>
                          <User />
                    </Button>
                </div> */}
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
            }
        </Card>
      </div>
    </div>
  )
}

export default Profile;