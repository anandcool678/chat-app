import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
            <Text
                fontSize={{base:"28px", md:"30px"}}
                fontFamily={"Work sans"}
                display={"flex"}
                alignItems={"center"}
                justifyContent={{base:"space-between"}}
                w={"100%"}
                pb={3}
                px={2}
            >
                <IconButton
                    display={{base:"flex", md:"none"}}
                    icon={<ArrowBackIcon/>}
                    onClick={()=>setSelectedChat("")}
                />
                {!selectedChat.isGroupChat?(
                    <>
                        {getSender(user,selectedChat.users)}
                        <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                    </>
                ):(
                    <>{selectedChat.chatName.toUpperCase()}
                        <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                    </>
                )}

            
            </Text>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"flex-end"}
                p={3}
                bg={"#E8E8E8"}
                w={"100%"}
                h={"100%"}
                borderRadius={"lg"}
                overflowY={"hidden"}
            >
                
                  {/* messages here */}
            </Box>
        </>
      ) : (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Work sans"}>
            Select a chat to start messaging
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
