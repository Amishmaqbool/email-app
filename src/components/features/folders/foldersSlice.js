import { createSlice } from "@reduxjs/toolkit";
import { initialFolders, emails } from "../../../data";

const foldersSlice = createSlice({
  name: "folders",
  initialState: [...initialFolders],
  reducers: {
    addFolder: (state, action) => {
      state.push(action.payload);
    },
    addSubfolder: (state, action) => {
      const { parentId, subfolder } = action.payload;
      const parentFolder = findFolder(parentId, state);
      if (parentFolder) {
        parentFolder.subfolders.push(subfolder);
      }
    },
    toggleSubfolderInput: (state, action) => {
      const subfolderId = action.payload;
      const subfolder = findSubfolder(subfolderId, state);
      if (subfolder) {
        subfolder.showInput = !subfolder.showInput;
      }
    },

    // moveEmail: (state, action) => {
    //   const { emailId, sourceFolderId, destinationFolderId } = action.payload;
    //   console.log("------emailId", emailId);
    //   const sourceFolder = state.find((folder) => folder.id === sourceFolderId);
    //   console.log("---------------sourceFolder", sourceFolder);
    //   const destinationFolder = state.find(
    //     (folder) => folder.id === destinationFolderId
    //   );
    //   console.log("---------------destinationFolder", destinationFolder);

    //   if (sourceFolder && destinationFolder) {
    //     const emailIndex = sourceFolder.emails.findIndex(
    //       (email) => email.id === emailId
    //     );

    //     if (emailIndex !== -1) {
    //       const movedEmail = sourceFolder.emails.splice(emailIndex, 1)[0];
    //       movedEmail.folderId = destinationFolderId;
    //       destinationFolder.emails.push(movedEmail);
    //     }
    //   }
    // },
  },
});

export const { addFolder, addSubfolder, toggleSubfolderInput, moveEmail } =
  foldersSlice.actions;

export const selectFolders = (state) => state.folders;

export default foldersSlice.reducer;

export const findFolder = (folderId, folderList) => {
  for (let folder of folderList) {
    if (folder.id === folderId) {
      return folder;
    }
    if (folder.subfolders.length > 0) {
      const foundFolder = findFolder(folderId, folder.subfolders);
      if (foundFolder) {
        return foundFolder;
      }
    }
  }
  return null;
};

export const findSubfolder = (subfolderId, folderList) => {
  for (let folder of folderList) {
    if (folder.subfolders.length > 0) {
      const foundSubfolder = folder.subfolders.find(
        (subfolder) => subfolder.id === subfolderId
      );
      if (foundSubfolder) {
        return foundSubfolder;
      } else {
        const foundSubfolderRecursive = findSubfolder(
          subfolderId,
          folder.subfolders
        );
        if (foundSubfolderRecursive) {
          return foundSubfolderRecursive;
        }
      }
    }
  }
  return null;
};
