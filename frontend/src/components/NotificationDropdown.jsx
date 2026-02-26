import { useEffect, useState } from "react";
import { BsBell } from "react-icons/bs";
import { BsBellFill } from "react-icons/bs";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { differenceInMinutes, differenceInHours, differenceInDays } from "date-fns";

import Axios from "@/components/Axios"

import { useNavigate } from "react-router";
export default function Notification() {
  const [noti, setNoti] = useState([])

  const navigate = new useNavigate()

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

  const getNotifications = () => {
    Axios.get("getNoti/", {params:{mode:"bell"}}).then((res) => {
      console.log("Notifications:",res.data.notifications)
      const sortedNoti = res.data.notifications.sort(
      (a, b) => new Date(b.created) - new Date(a.created)
    );
      setNoti(sortedNoti)
    })
  }

  useEffect(() => {
    getNotifications()
  }, [])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full shadow-none"
          aria-label="Open edit menu">
          {noti && noti.length > 0 ? <BsBellFill size={16} aria-hidden="true"/> : <BsBell size={16} aria-hidden="true" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="h-[190px]">
        <div className="flex flex-col z-0 h-[150px]">
          <p className="text-xs font-medium border-b pb-2">Notifications.</p>
          <div className="flex flex-col w-[225px]  gap-4 mt-1">
            
            {noti.length>0 ? noti.map((noti) => {
              return(
                <div key={noti.id} className="flex flex-col justify-start  ">
                  <div className="flex justify-between">
                    <p className="text-xs font-medium leading-none ">{noti.notif_type === "LIKE" ? <p>New Like</p> : <p>New Follow</p>}</p>
                    <span className="text-xs text-muted-foreground"> {timeAgoShort(noti.created)} ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{noti.message}</p>
                  
                </div>
                
              )
            }) : <div className="flex item-center justify-center h-screen"> <p>Nothing new here</p> </div>}

            {noti.length>0 && <p className="text-xs text-muted-foreground -mt-2 cursor-pointer" onClick={() => navigate("/notification")}>Show more</p>}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
