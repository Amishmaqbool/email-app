// store.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../store/rootReducer';
import { initialFolders, emails } from '../data';

const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    folders: initialFolders,
    emails: emails,
  },
});

export default store;
