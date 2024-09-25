import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAppStore } from '@/store';
import ChatContainer from './components/chat-container';
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';

export default function ChatPage() {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo && !userInfo.profileSetup) {
      toast("Please setup profile to continue.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className='flex h-screen text-black overflow-hidden'>
      
      
      <ContactsContainer/>
      {/* <EmptyChatContainer/> */}
      <ChatContainer/>
    </div>
  );
}