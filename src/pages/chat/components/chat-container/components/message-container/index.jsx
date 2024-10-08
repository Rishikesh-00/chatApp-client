import { apiClient } from '@/lib/api-client';
import { useAppStore } from '@/store';
import { GET_ALL_MESSAGES_ROUTE, HOST } from '@/utils/constants';
import moment from 'moment';
import React, { useEffect, useRef } from 'react'

export default function MessageContainer() {
  const { selectedChatType, selectedChatData, userInfo, selectedChatMessages, setSelectedChatMessages } = useAppStore();

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await apiClient.post(GET_ALL_MESSAGES_ROUTE, { id: selectedChatData._id }, { withCredentials: true });
        if (response.data.messages) {
          setSelectedChatMessages(response.data.messages)
        }
      } catch (err) {
        console.log(err)
      }
    }
    if (selectedChatData._id) {
      if (selectedChatType === "contact")
        getMessages()
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);
  const scrollRef = useRef();

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };
  

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index}>
          {showDate && (<div className='text-center text-gray-500 my-2' >
            {moment(message.timestamp).format("LL")}
          </div>)}
          {
            selectedChatType === "contact" && renderDmMessages(message)
          }
        </div>
      )
    })
  }

 


  const renderDmMessages = (message) => {
    const isSender = message.sender === selectedChatData._id;

    return (
      <div className={`chat ${isSender ? "chat-start " : "chat-end"}`}>
        <div className="chat-bubble">
          {message.messageType === "text" && (
            <div>
              {message.content}
            </div>
          )}
          {
            message.messageType==="file" && <div>
              {checkIfImage(message.fileUrl)?<div className='cursor-pointer '>
                <img src={`${HOST}/${message.fileUrl}`} height={300} width={300} alt="" />
              </div>:<div></div>}
            </div>


          }
          <div className="text-xs text-gray-600 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:[w-70vw] xl:w-[80vw] w-full '>
      {renderMessages()}
      <div ref={scrollRef} />
    </div>
  )
}
