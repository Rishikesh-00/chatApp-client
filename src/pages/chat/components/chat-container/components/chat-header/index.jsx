import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { HOST } from '@/utils/constants';
import React from 'react'
import { RiCloseFill } from 'react-icons/ri'
function ChatHeader() {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();
  return (
    <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20  ' >
      <div className="flex gap-5 items-center w-full justify-between ">
        <div className='flex gap-3 items-center justify-center ' >
          <div className="w-12 h-12 relative">
            <Avatar className="h-12 w-12 rounded-full border overflow-hidden">
              {selectedChatData.image ? (
                <AvatarImage
                  src={`${HOST}/${selectedChatData.image}`}
                  alt="profile"
                  className="object-contain w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase h-12 w-12 border-[1px] text-lg flex justify-center items-center rounded-full ${getColor(selectedChatData.getColor)}`}
                >
                  {selectedChatData.firstName ? selectedChatData.firstName[0] : selectedChatData.email[0]}
                </div>
              )}
            </Avatar>
          </div>
          <div>
              {
                selectedChatType==="contact" && 
                selectedChatData.firstName ?
                 `${selectedChatData.firstName}  ${selectedChatData.lastName}`:selectedChatData.email
              }
          </div>
        </div>
        <div className="flex items-center justify-center gap-5  " >
          <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all ' onClick={closeChat}>
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader
