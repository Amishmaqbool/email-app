export const initialFolders = [
  {
    name: "Inbox",
    id: "folder1",
    subfolders: [],
    
  },
  {
    name: "Draft",
    id: "folder2",
    subfolders: [],
  },
  {
    name: "Sent",
    id: "folder3",
    subfolders: [],
  },
  {
    name: "Archived",
    id: "folder4",
    subfolders: [],
  },
  {
    name: "Meeting",
    id: "folder5",
    subfolders: [
      {
        name: "Team-Meetings",
        id: "subfolder1",
        subfolders: [
          {
            name: "Sprint Planning Meeting",
            id: "subfolder2",
            subfolders: [],
          },
        ],
      },
    ],
  },
];

export const emails = [
  {
    id: "email1",
    folderId: "folder1",
    from: "john@example.com",
    to: "jane@example.com",
    subject: "Hello",
    attachments: false,
    status:"inbox",
    priority: "Low",
    read: true,
    conversationId: null,
  },
  {
    id: "email2",
    folderId: "folder1",
    from: "jane@example.com",
    status:"inbox",
    to: "john@example.com",
    subject: "Re: Hello",
    attachments: true,
    priority: "High",
    read: false,
    conversationId: "email1",
  },
  {
    id: "email3",
    folderId: "folder2",
    from: "alice@example.com",
    to: "bob@example.com",
    status:"inbox",
    subject: "Draft Email",
    attachments: false,
    priority: "Normal",
    read: false,
    conversationId: null,
  },
  {
    id: "email4",
    folderId: "folder3",
    from: "bob@example.com",
    to: "alice@example.com",
    subject: "Sent Email",
    status:"Draft",
    attachments: true,
    priority: "Normal",
    read: true,
    conversationId: null,
  },
  {
    id: "email5",
    folderId: "folder4",
    from: "john@example.com",
    to: "jane@example.com",
    subject: "Archived Email",
    status:"Draft",
    attachments: false,
    priority: "Low",
    read: true,
    conversationId: null,
  },
];
