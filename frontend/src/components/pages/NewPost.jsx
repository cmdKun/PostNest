import React, { useEffect, useState } from 'react'
import AxiosInstance from '../Axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { Textarea } from "@/components/ui/textarea"

import FileUpload from '../FileUpload'
import { toast } from 'sonner'


const NewPost = () => {

  const [content, setContent] = useState()
  const [selectedImage, setSelectedImage] = useState(null);

  const [open, setOpen] = useState(false);




  const submit = async (e) => {
    try {
      const formData = new FormData();
      
      formData.append("content", content)
      if(selectedImage){
        formData.append("image", selectedImage)
      }

      const res = await AxiosInstance.post("posts/",  formData);
      toast.success("Posted!")
      setOpen(false)
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>    
            <Button size="sm" variant="outline"> New Post </Button>
        </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>New Post</DialogTitle>

          <DialogDescription className="flex flex-col gap-2 items-center" >

            <Textarea placeholder="What's on your mind?" onChange={(e) => setContent(e.target.value)} className="resize-none h-[125px]" />
            <FileUpload onFileSelect={setSelectedImage}/>

          </DialogDescription>

        </DialogHeader>
        <div className="flex justify-between">

          <DialogClose>
            <Button size="sm" variant="destructive">Cancle</Button>
          </DialogClose>

          <Button size="sm" onClick={submit}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>

  )
}
export default NewPost;
