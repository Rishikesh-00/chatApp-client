import { useAppStore } from "@/store"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { ADD_PROFILE_IMAGE_ROUTE, HOST, UPDATE_PROFILE_ROUTE } from "@/utils/constants";
export default function Profile() {
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [image, setImage] = useState(null)
  const [hovered, setHovered] = useState(false)
  const [selectedColor, setSelectedColor] = useState(0)
  const fileInputRef=useRef(null)

  useEffect(()=>{
    if(userInfo.profileSetup){
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
    }
    console.log(HOST)
    if(userInfo.image){
      setImage(`${HOST}/${userInfo.image}`)
    }
  },[userInfo])

  const validateProfile=()=>{
    if(!firstName ){
      toast.error("First Name is required!");
      return false;
    }
    if(!lastName ){
      toast.error("Last Name is required!");
      return false;
    }
    return true
  }

  const saveChanges = async () => {
    if(validateProfile()){
      try{
        const response=await apiClient.post(UPDATE_PROFILE_ROUTE,{firstName,lastName,color:selectedColor},{withCredentials:true})
        if(response.status===200 && response.data){
          setUserInfo({...response.data});
          toast.success("Profile updated successfully!")
          navigate("/chat");
        }
      }catch(err){
        console.log(err)
      }
    }
   };

   const handleNavigate=()=>{
    if(userInfo.profileSetup){
      navigate("/chat")
    }
    else{
      toast.error("Please setup profile!")
    }
   }
   const handleFileInputClick=()=>{
    fileInputRef.current.click();
   }

   const handleImageChange=async (event)=>{
      const file=event.target.files[0];
      console.log({file})
      if(file){
        const formData=new FormData();
        formData.append("profile-image",file)
        console.log(ADD_PROFILE_IMAGE_ROUTE)
        var response=await apiClient.post(ADD_PROFILE_IMAGE_ROUTE,formData,{withCredentials:true})
      }
      if(response.status===200 && response.data.image){
        setUserInfo({...userInfo,image:response.data.image})
        toast.success("Image updated successfully!")
      }
      // const reader=new FileReader();
      // reader.onload=()=>{
      //   setImage(reader.result)
      // }
      // reader.readAsDataURL(file)
   }

   const handleDeleteImage=async()=>{}


  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10 ">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max ">
        <div>
          <FaArrowLeft onClick={handleNavigate} className="text-4xl lg:text-6xl text-white/90 cursor-pointer " />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div
    className="relative h-full w-32 md:w-48 md:h-48 flex items-center justify-center"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
    <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full border overflow-hidden">
      {image ? (
        <AvatarImage
          src={image}
          alt="profile"
          className="object-contain w-full h-full bg-black"
        />
      ) : (
        <div
          className={`uppercase h-32 w-32 md:w-48 md:h-48 border-[1px] text-3xl md:text-5xl flex justify-center items-center rounded-full ${getColor(
            selectedColor
          )}`}
        >
          {firstName
            ? firstName.charAt(0)
            : userInfo.email.charAt(0)}
        </div>
      )}
    </Avatar>

    {hovered && (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full transition-opacity duration-300" onClick={image ? handleDeleteImage:handleFileInputClick}>
        {image ? (
          <FaTrash className="text-white text-2xl md:text-3xl cursor-pointer" />
        ) : (
          <FaPlus className="text-white text-2xl md:text-3xl cursor-pointer" />
        )}
      </div>
    )}
    <input type="file" ref={fileInputRef} className="hidden" onChange={handleImageChange} name="profile-image" accept=".png, .jpg, .jpeg, .svg, .webp" />
  </div>

  <div className="flex flex-col gap-5 text-white items-center justify-center w-full">
    <div className="w-full">
      <Input
        type="email"
        placeholder="Email"
        disabled
        value={userInfo.email}
        className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none"
      />
    </div>
    <div className="w-full">
      <Input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none"
      />
    </div>
    <div className="w-full">
      <Input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="rounded-lg p-4 md:p-6 bg-[#2c2e3b] border-none"
      />
    </div>
    <div className="w-full flex gap-5">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`${color} h-6 w-6 md:h-8 md:w-8 rounded-full cursor-pointer transition-all duration-300 ${
            selectedColor === index ? "outline outline-white/50 outline-2" : ""
          }`}
          onClick={() => setSelectedColor(index)}
        />
      ))}
    </div>
  </div>
</div>

        <div className="w-full">
          <Button onClick={saveChanges} className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 ">Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
// 2:43