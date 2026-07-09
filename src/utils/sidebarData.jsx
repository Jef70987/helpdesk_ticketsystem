import React from 'react';
import GridViewIcon from '@mui/icons-material/GridView'; 
import AssignmentIcon from '@mui/icons-material/Assignment'; 
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add'; 
import { BotIcon } from 'lucide-react';
import LogoutIcon from '@mui/icons-material/Logout'; 

const sidebarData = [
  {
    title: "Dashboard",
    icon: <GridViewIcon />,
    link: "/user/dashboard"
  },
  {
    title: "My Tickets",
    icon: <AssignmentIcon />,
    link: "/user/tickets"
  },
  {
    title: "New Ticket",
    icon: <AddIcon />,
    link: "/user/create"
  },
  // {
  //   title: "Notifications",
  //   icon: <NotificationsIcon />,
  //   link: "/notifications"
  // },
  // {
  //   title: "Messages",
  //   icon: <ChatIcon />,
  //   link: "/user/messages"
  // },
  // {
  //   title: 'AI Chat',
  //   link: '/user/ai-chat',
  //   icon: <BotIcon />
  // },
  {
    title: "Logout",
    icon: <LogoutIcon />,
    link: "/auth/logout",
    isLogout: true 
  },
  
];

export default sidebarData;
