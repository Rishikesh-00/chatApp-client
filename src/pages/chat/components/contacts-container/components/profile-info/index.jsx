import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { AvatarImage } from "@radix-ui/react-avatar";
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import { HOST, LOGOUT_ROUTE } from '@/utils/constants'
import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {FiEdit2} from "react-icons/fi"
import { IoPowerSharp} from "react-icons/io5"
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";

function ProfileInfo() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logOut = async () => {
        try {
            const response = await apiClient.post(LOGOUT_ROUTE, {}, { withCredentials: true });
            if (response.status === 200) {
                navigate("/auth");
                setUserInfo(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="text-white absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative">
                    <Avatar className="h-12 w-12 rounded-full border overflow-hidden">
                        {userInfo.image ? (
                            <AvatarImage
                                src={`${HOST}/${userInfo.image}`}
                                alt="profile"
                                className="object-contain w-full h-full bg-black"
                            />
                        ) : (
                            <div
                                className={`uppercase h-12 w-12 border-[1px] text-lg flex justify-center items-center rounded-full ${getColor(
                                    userInfo.getColor
                                )}`}
                            >
                                {userInfo.firstName
                                    ? userInfo.firstName.split("").shift()
                                    : userInfo.email.split("").shift()}
                            </div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {userInfo.firstName && userInfo.lastName
                        ? `${userInfo.firstName} ${userInfo.lastName}`
                        : ""}
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2
                                className="text-purple-500 text-xl font-medium"
                                onClick={() => navigate("/profile")}
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            Edit Profile
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <IoPowerSharp
                                className="text-red-500 text-xl font-medium"
                                onClick={logOut} 
                            />
                        </TooltipTrigger>
                        <TooltipContent className="bg-[#1c1b1e] border-none text-white">
                            Logout
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
}

export default ProfileInfo;

