import { SET_CURRENT_TAB } from './adminActionTypes';

const initialState = {
  currentTab: { name: 'admins', data: null },
  users: [
    {
      id: 1,
      name: 'Linsi Stroud',
      email: 'u1@email.com',
      register: '5 min ago',
    },
    {
      id: 2,
      name: 'Nicci Troaini',
      email: 'u2@email.com',
      register: '50 min ago',
    },
    {
      id: 3,
      name: 'George Fields',
      email: 'u3@email.com',
      register: '1 hr ago',
    },
  ],
  professors: [
    {
      id: 1,
      firstName: 'Lindsi Stroud',
      lastName: 'Giovani',
      email: 'u1@email.com',
      university: 'North South University',
    },
    {
      id: 2,
      firstName: 'Nicci Troaini',
      lastName: 'Giovani',
      email: 'u2@email.com',
      university: 'North South University',
    },
    {
      id: 3,
      firstName: 'George Fields',
      lastName: 'Giovani',
      email: 'u3@email.com',
      university: 'North South University',
    },
  ],
  institutes: [
    {
      id: 1,
      name: 'University of Dhaka',
      email: 'u1@email.com',
      register: '5 min ago',
    },
    {
      id: 2,
      name: 'North South University',
      email: 'u2@email.com',
      register: '50 min ago',
    },
    {
      id: 3,
      name: 'FAST',
      email: 'u3@email.com',
      register: '1 hr ago',
    },
  ],
  blogs: [
    {
      id: 1,
      title: 'This is blog post title',
      register: '5 min ago',
    },
    {
      id: 2,
      title: 'This is blog post title',
      email: 'u2@email.com',
      register: '50 min ago',
    },
    {
      id: 3,
      title: 'This is blog post title',
      register: '1 hr ago',
    },
  ],
  admins: [
    {
      id: 1,
      name: 'admin1',
      email: 'admin1@email.com',
      register: '50 min ago',
    },
    {
      id: 2,
      name: 'admin2',
      email: 'admin2@email.com',
      register: '55 min ago',
    },
    {
      id: 3,
      name: 'admin3',
      email: 'admin3@email.com',
      register: '1 hour ago',
    },
  ],
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_TAB: return {
      ...state,
      currentTab: action.payload.tab,
    };
    default: return state;
  }
}
