import { combineReducers } from '@reduxjs/toolkit';
import foldersReducer from '../components/features/folders/foldersSlice';
import emailsReducer from '../components/features/folders/emailsSlice';

const rootReducer = combineReducers({
  folders: foldersReducer,
  emails: emailsReducer,
});

export default rootReducer;
