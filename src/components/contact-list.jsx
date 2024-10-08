import { useAppStore } from "@/store";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HOST } from "@/utils/constants";
import { getColor } from "@/lib/utils";
// import { userInfo } from "";

const ContactList = ({ contacts = [], isChannel = false }) => { // Provide default value []
  // console.log({ contacts });
  
  const {
    selectedChatData,
    setSelectedChatData,
    setSelectedChatType,
    selectedChatType,
    setSelectedChatMessages,
  } = useAppStore();

  const handleClick = (contact) => {
    if (isChannel) {
      setSelectedChatType("channel");
    } else {
      setSelectedChatType("contact"); 
    }

    setSelectedChatData(contact);

    if (selectedChatData && selectedChatData._id !== contact._id) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className="mt-5 text-white">
      {contacts.length > 0 ? (
        contacts.map((contact) => (
          <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id == contact._id ? "bg-[#8417ff] hover:bg-[#8417ff] ":" hover:bg-[#f1f1f111]"} `} onClick={() => handleClick(contact)}>
            {
              <div className="flex gap-5 items-center justify-start text-stone-300 ">
                {
                  !isChannel && <Avatar className="h-10 w-10 rounded-full border overflow-hidden">
                  {contact.image ? (
                    <AvatarImage
                      src={`${HOST}/${contact.image}`}
                      alt="profile"
                      className="object-contain w-full h-full bg-black"
                    />
                  ) : (
                    <div
                      className={`${selectedChatData && selectedChatData._id===contact._id?"bg-[ffffff22] border border-white/70":getColor(contact.getColor)} uppercase h-10 w-10 border-[1px] text-lg flex justify-center items-center rounded-full `}
                    >
                      {contact.firstName ? contact.firstName[0] : contact.email[0]}
                    </div>
                  )}
                </Avatar>
                }
                {
                  isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex justify-center items-center rounded-full">#</div>
                }
                {
                  isChannel ? <stan>{contact.name}</stan>:<span>{`${contact.firstName} ${contact.lastName}`} </span>
                }
              </div>
            }
            
          </div>
        ))
      ) : (
        <div>No contacts available</div> 
      )}
    </div>
  );
};

export default ContactList;
