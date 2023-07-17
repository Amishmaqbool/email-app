import { createSlice } from "@reduxjs/toolkit";

const emailsSlice = createSlice({
  name: "emails",
  initialState: [],
  reducers: {
    addEmail: (state, action) => {
      state.push(action.payload);
    },
    updateEmail: (state, action) => {
      const { emailId, ...updatedFields } = action.payload;
      const email = state.find((email) => email.id === emailId);
      if (email) {
        Object.assign(email, updatedFields);
      }
    },
    deleteEmail: (state, action) => {
      const emailId = action.payload;
      const emailIndex = state.findIndex((email) => email.id === emailId);
      if (emailIndex !== -1) {
        state.splice(emailIndex, 1);
      }
    },
    moveEmail: (state, action) => {
      const { emailId, folderId } = action.payload;
      const email = state.find((email) => email.id === emailId);
      if (email) {
        email.folderId = folderId;
      }
    },
    handleArchiveEmail: (state, action) => {
      const emailId = action.payload;
      const email = state.find((email) => email.id === emailId);
      if (email) {
        email.folderId = "folder4"; // Set the folderId to the archive folder
      }
    },
    handleUnarchiveEmail: (state, action) => {
        const emailId = action.payload;
        const email = state.find((email) => email.id === emailId);
        if (email) {
          const originalFolderId = email.originalFolderId || "folder1"; // Assuming the original folder ID is stored in the 'originalFolderId' property of the email object
          email.folderId = originalFolderId;
          delete email.originalFolderId;
        }
      },
      
  },
});

export const {
  addEmail,
  updateEmail,
  deleteEmail,
  moveEmail,
  handleArchiveEmail,
  handleUnarchiveEmail,
} = emailsSlice.actions;

export const selectEmails = (state) => state.emails;

export default emailsSlice.reducer;
