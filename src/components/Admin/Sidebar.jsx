import React from 'react';
import PropTypes from 'prop-types';

import {
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import {
  ArrowLeft,
  ArrowRight,
  Assignment,
  Dashboard,
  Festival,
  People,
  Settings,
  MailOutline,
} from '@mui/icons-material';

import { useSelector, useDispatch } from 'react-redux';
import { setCurrentTab } from '../../redux/adminActions';

import man from '../../assets/man.png';
import professor from '../../assets/prof.svg';
import ads from '../../assets/ads.svg';
import conversations from '../../assets/conversations.svg';

export default function Sidebar({ setOpen, open }) {
  const { currentTab } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  return (
    <div className="flex flex-col w-full h-full">
      <div className="w-full p-3 mt-12">
        <img className="w-16" src={man} alt="man" />
        <span className={`flex items-center ${open ? 'justify-between' : 'justify-center'} w-full mt-6`}>
          <Typography variant="h4" className={`${open ? 'block' : 'hidden'}`}>Aron Young</Typography>
          <IconButton className="p-1 rounded-none bg-primary hover:bg-blue-800" onClick={() => setOpen(!open)}>
            {
              open
                ? (
                  <ArrowLeft htmlColor="white" className="w-5 h-5" />
                )
                : (
                  <ArrowRight htmlColor="white" className="w-5 h-5" />
                )
            }
          </IconButton>
        </span>
      </div>
      <Divider />
      <List>
        <ListItemButton className={`${currentTab.name === 'dashboard' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'dashboard', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><Dashboard className={`${currentTab.name === 'dashboard' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Dasboard" />
        </ListItemButton>
        <ListItemButton className={`${currentTab.name === 'users' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'users', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><People className={`${currentTab.name === 'users' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Users" />
        </ListItemButton>
        <ListItemButton className={`${currentTab.name === 'professors' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'professors', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><img src={professor} alt="professors" className={`${currentTab.name === 'professors' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Professors" />
        </ListItemButton>
        <ListItemButton className={`${currentTab.name === 'institutes' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'institutes', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><Festival className={`${currentTab.name === 'institutes' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Institutes" />
        </ListItemButton>
        <ListItemButton className={`${currentTab.name === 'blogs' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'blogs', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><Assignment className={`${currentTab.name === 'blogs' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Blogs" />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        <ListItemButton className={`${currentTab.name === 'adminSettings' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'adminSettings', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><Settings className={`${currentTab.name === 'adminSettings' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Admin Settings" />
        </ListItemButton>
      </List>
      <List>
        <ListItemButton className={`${currentTab.name === 'ads' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'ads', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><img src={ads} alt="advertisemnts" className={`${currentTab.name === 'ads' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Ads" />
        </ListItemButton>
      </List>
      <List>
        <ListItemButton className={`${currentTab.name === 'allowedMails' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'allowedMails', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><MailOutline className={`${currentTab.name === 'allowedMails' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Allowed Mails" />
        </ListItemButton>
      </List>
      <List>
        <ListItemButton className={`${currentTab.name === 'faqs' && 'bg-activeTab text-primary'}`} onClick={() => dispatch(setCurrentTab({ name: 'faqs', data: null }))}>
          <ListItemIcon className={`${!open && 'flex justify-center'}`}><img src={conversations} alt="faqs" className={`${currentTab.name === 'faqs' && 'bg-activeTab text-primary'} w-8 h-8`} /></ListItemIcon>
          <ListItemText className={`${!open && 'hidden'}`} primary="Faq's" />
        </ListItemButton>
      </List>
    </div>
  );
}

Sidebar.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};