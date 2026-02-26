import React, { useEffect, useState } from 'react'
import Navbar from '../Navbar'
import Axios from '../Axios'
import {Card} from "@/components/ui/card"
import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
const Notification = () => {

  function timeAgoShort(dateString) {
    const date = new Date(dateString);
    const now = new Date();

    const diffMins = differenceInMinutes(now, date);
    if (diffMins < 60) return `${diffMins}m`;

    const diffHours = differenceInHours(now, date);
    if (diffHours < 24) return `${diffHours}h`;

    const diffDays = differenceInDays(now, date);
    return `${diffDays}d`;
}


  const [noti, setNoti] = useState([])
    const getNotifications = () => {
      Axios.get("getNoti/", { params : {mode:"page"}}).then((res) => {
        const sortedNoti = res.data.notifications.sort(
        (a, b) => new Date(b.created) - new Date(a.created)
      );
        setNoti(sortedNoti)
      })
  }

  useEffect(() => {
    getNotifications();
  }, [])
  return (
    <div>
        <Navbar/>
            <div className="w-128 h-[86vh] flex overflow-x-hidden flex-col gap-2 my-scrollable-box items-center">
                {noti.length>0
                ? 
                <>
                  {noti?.map((noti) => (
                    <Card className="w-[38rem] " key={noti.id}>
                      <div className='p-2 flex justify-between items-center'>
                        <div className='flex items-center gap-2'>
                                <Avatar className="w-[30px] h-auto">
                                    <AvatarImage src={noti.user_pfp} />
                                   <AvatarFallback>CN</AvatarFallback>
                              </Avatar>
                          <p className='cursor-pointer'>{noti?.message}</p>
                        </div>

                          <span className="text-xs text-muted-foreground"> {timeAgoShort(noti.created)} ago</span>
                      </div>
                    </Card>
                  ))}
                </>
                :
                <div>No notifications yet</div>
            }
                  
              </div>
    </div>
  )
}

export default Notification;
