import { combineReducers } from 'redux';
import folderReducer from '../components/features/folders/foldersSlice';

const rootReducer = combineReducers({
  folders: folderReducer,
  // Add other reducers here if needed
});

export default rootReducer;
