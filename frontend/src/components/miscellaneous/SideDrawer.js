import {
    Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useDisclosure } from "@chakra-ui/react";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner";


const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
 
  const [loadingChat, setLoadingChat] = useState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const {user, setSelectedChat, chats, setChats} = ChatState();
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
    
  };
  const handleSearch = async () => {
    if(!search){
      toast({
        title: "Please enter a name to search",
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position:"top-left"
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const {data} = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);

    } catch (error) {
        toast({
          title: 'error occured',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position:"top-left"
        })
    } 

  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`,{userId},config);

      if(!chats.find((chat)=>chat._id===data._id)){
        setChats([data,...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    } catch (error) {
      toast({
        title: 'error occured',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position:"bottom-left"

      });
    }

  };

  return (<>
    <Box
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
      bg={"white"}
      w={"100%"}
      p={"5px 10px 5px 10px"}
      borderWidth={"5px"}
    >
      <Tooltip label="Search users to chat" hasArrow placement="bottom-end">
        <Button variant={"ghost"} onClick={onOpen}>
          <i className="fas fa-search"></i>
          <Text display={{ base: "none", md: "flex" }} px={4}>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize={"2xl"} fontFamily={"Work sans"}>
        Chat-App
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize={"2xl"} m={1} />
          </MenuButton>
          {/* <MenuList>

            </MenuList> */}
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            <Avatar size={'sm'} cursor={'pointer'} name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModal user = {user}>
            <MenuItem>Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
        </Menu>
      </div>
    </Box>

    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
            <DrawerHeader borderBottomWidth={"1px"}>
                Search Users
            </DrawerHeader>
            <DrawerBody>
          <Box display={"flex"} p={2}>
            <Input
              placeholder="Search Users"
              value={search}
              mr={2}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button onClick={handleSearch}>Go</Button>
          </Box>
          {loading?(<ChatLoading/>):(
            searchResult?.map(user=>(
              <UserListItem key={user._id} user={user} handleFunction={()=>accessChat(user._id)} />
            ))
          )}
          {loadingChat && <Spinner ml="auto" display="flex"/>}
        </DrawerBody>
        </DrawerContent>
        
    </Drawer>
</>
  );
};

export default SideDrawer;