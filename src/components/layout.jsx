import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { emails } from "../data";
import {
  Bars3Icon,
  CalendarIcon,
  ChartPieIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useSelector, useDispatch } from "react-redux";
import {
  addFolder,
  addSubfolder,
  selectFolders,
  findFolder,
  findSubfolder,
  toggleSubfolderInput,
  moveMail,
} from "../components/features/folders/foldersSlice";
import {
  addEmail,
  updateEmail,
  deleteEmail,
  moveEmail,
  selectEmails,
  handleArchiveEmail,
  handleUnarchiveEmail,
} from "../components/features/folders/emailsSlice";
import ComposeModal from "./ComposeModal";
import { v4 as uuidv4 } from "uuid";


const navigation = [
  { name: "Inbox", href: "http://localhost:3000", icon: UsersIcon, current: false },
  { name: "Draft", href: "#", icon: FolderIcon, current: false },
  { name: "Sent", href: "#", icon: CalendarIcon, current: false },
  { name: "Archived", href: "#", icon: DocumentDuplicateIcon, current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [showSubfolderInput, setShowSubfolderInput] = useState(false);
  const [selectedSubfolder, setSelectedSubfolder] = useState(null);
  const [showChildSubfolderInput, setShowChildSubfolderInput] = useState("");
  const [newSubfolderName, setNewSubfolderName] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMailFolder, setSelectedMailFolder] = useState(null);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [showComposeModal, setShowComposeModal] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  const folders = useSelector(selectFolders);
  const emails = useSelector(selectEmails);
  console.log("-------folders", folders);
  const dispatch = useDispatch();

  // console.log(setNewSubfolderName,'```````````')
  const [composeEmail, setComposeEmail] = useState({
    from: "",
    to: "",
    subject: "",
    attachments: false,
    priority: "Normal",
    body: "",
  });
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (e) => {
    const email = e.target.value;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Simple email regex

    setComposeEmail({
      ...composeEmail,
      from: email,
    });

    setIsEmailValid(emailRegex.test(email));
  };

  const handleComposeEmail = () => {
    setShowComposeModal(true);
  };

  const handleCancelCompose = () => {
    dispatch(addEmail({ ...composeEmail, folderId: "folder2" })); // Add to "Draft" folder
    setShowComposeModal(false);
    setComposeEmail({
      from: "",
      to: "",
      subject: "",
      attachments: false,
      priority: "Normal",
      body: "",
    });
  };

  const handleSendEmail = () => {
    dispatch(addEmail({ ...composeEmail, folderId: "folder3" }));
    setShowComposeModal(false);
    setComposeEmail({
      from: "",
      to: "",
      subject: "",
      attachments: false,
      priority: "Normal",
      body: "",
    });
  };

  const handleAddFolder = () => {
    const newFolder = {
      id: folders.length + 1,
      name: newFolderName,
      href: "#",
      current: false,
      subfolders: [],
    };
    dispatch(addFolder(newFolder));
    setNewFolderName("");
  };

  const toggleSubFolderInput = (folder) => {
    setSelectedFolder(folder.id);
    setShowSubfolderInput(!showSubfolderInput);
  };

  const handleCreateSubfolder = (parentId) => {
    if (newSubfolderName.trim() !== "") {
      const parentFolder = findFolder(parentId, folders);
      if (parentFolder) {
        const newSubfolder = {
          id: uuidv4(), // Generate a unique ID using uuidv4()
          name: newSubfolderName,
          href: "#",
          current: false,
          subfolders: [],
          parentId: parentFolder.id,
        };

        const updatedSubfolders = [...parentFolder.subfolders, newSubfolder];
        const updatedParentFolder = {
          ...parentFolder,
          subfolders: updatedSubfolders,
        };

        const updatedFolders = folders.map((folder) =>
          folder.id === parentId ? updatedParentFolder : folder
        );

        dispatch(addSubfolder({ parentId, subfolder: newSubfolder }));
        setNewSubfolderName("");
        setShowSubfolderInput(false);
      }
    }
  };


  const handleFolderClick = (folder) => {
    console.log("Folder clicked:", folder);
    setSelectedMailFolder(folder.id);
    console.log("Selected mail folder:", folder.name);
  };

  const handleMoveEmail = (emailId, destinationFolderId) => {
    dispatch(moveEmail({ emailId, folderId: destinationFolderId }));
  };

  const handleDropdownToggle = (emailId) => {
    setIsDropdownOpen((prevState) => ({
      ...prevState,
      [emailId]: !prevState[emailId],
    }));
  };

  const handleDeleteEmail = (emailId) => {
    dispatch(deleteEmail(emailId));
  };

  const handleOpenComposeModal = () => {
    setShowComposeModal(true);
  };

  const handleCloseComposeModal = () => {
    setShowComposeModal(false);
  };

  const handleComposeSubmit = (formData) => {
    if (formData.to && formData.subject) {
      const newEmail = {
        id: `email${emails.length + 1}`,
        folderId: "drafts",
        from: "bob@example.com",
        to: formData.to,
        subject: formData.subject,
        attachments: false,
        priority: "Normal",
        read: true,
        conversationId: null,
      };

      dispatch(addEmail(newEmail));
    }

    handleCloseComposeModal();
  };

  const handleArchive = (emailId) => {
    dispatch(handleArchiveEmail(emailId));
  };

  const handleUnarchive = (emailId) => {
    dispatch(handleUnarchiveEmail(emailId));
  };
  const showNoEmailsMessage = selectedMailFolder && emails.filter((email) => email.folderId === selectedMailFolder).length === 0;

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
                    <div className="flex h-16 shrink-0 items-center"></div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-800 text-white"
                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className="h-6 w-6 shrink-0"
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6">
            <div className="flex h-16 shrink-0 items-center"></div>
            <nav className="flex flex-1 flex-col">
              <button
                className="bg-gray-100 text-white-300 mb-3 hover:bg-gray-300 rounded-md py-3"
                onClick={handleComposeEmail}
              >
                Compose Email
              </button>

              {/* Compose Email Modal */}
              <Transition.Root show={showComposeModal} as={Fragment}>
                <Dialog
                  as="div"
                  className="z-10 inset-0   bg-white rounded-2xl overflow-y-auto"
                  onClose={setShowComposeModal}
                >
                  {/* ... */}

                  <div className="absolute z-[1200px]  shadow-2xl rounded-2xl grid  2xl:w-[700px] lg:w-[500px] w-[350px] right-8 bottom-0 ">
                    <p className="text-black px-2 bg-white rounded-t-2xl z-[1200px] font-semibold lg:text-[16px]">
                      New Message
                    </p>
                    <input
                      type="text"
                      placeholder="To:"
                      className={`px-2 py-4 relative ${isEmailValid ? "" : "border-red-900 border-2"}`}
                      value={composeEmail.from}
                      onChange={handleEmailChange}
                    />
                    {!isEmailValid && (
                      <>
                        <div className="absolute text-sm text-red-900 right-4 top-10">
                          Please add correct email
                        </div>
                      </>
                    )}
                    <input
                      type="text"
                      placeholder="Subject:"
                      value={composeEmail.subject}
                      className="border-2  px-2 py-4"
                      onChange={(e) =>
                        setComposeEmail({
                          ...composeEmail,
                          subject: e.target.value,
                        })
                      }
                    />

                    <textarea
                      value={composeEmail.body}
                      className="border-2 h-[300px] px-2 py-4"
                      onChange={(e) =>
                        setComposeEmail({
                          ...composeEmail,
                          body: e.target.value,
                        })
                      }
                    />
                    <div className="flex my-6 justify-end">
                      <button className="bg-red-300 px-8 py-3 mx-2 rounded-md text-white " onClick={handleCancelCompose}>Cancel</button>
                      <button
                        className={`bg-[#0b57d0] px-8 py-3 rounded-md text-white ${isEmailValid ? "" : "cursor-not-allowed opacity-50"
                          }`}
                        onClick={handleSendEmail}
                        disabled={!isEmailValid}
                      >
                        send </button>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {folders.map((folder) => (
                      <li key={folder.id}>
                        <div
                          className="flex justify-between items-center"
                          onClick={() => handleFolderClick(folder)}
                        >
                          {/* Render your SVG icon here */}
                          <a
                            href={folder.href}
                            className={classNames(
                              folder.current
                                ? "bg-gray-800 cursor-pointer my-2 text-white"
                                : "text-gray-400 hover:text-white hover:bg-gray-800",
                              "group flex gap-x-3 cursor-pointer rounded-md p-2 text-sm leading-6 font-semibold"
                            )}
                            onClick={() => handleFolderClick(folder)}
                          >
                            {folder.name}
                          </a>


                          <button className="text-gray-200" onClick={() => toggleSubFolderInput(folder)}>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#7bc62d" fill="none" stroke-linecap="round" stroke-linejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M12 5l0 14" />
                              <path d="M5 12l14 0" />
                            </svg>

                          </button>
                        </div>
                        {folder.id === selectedFolder && showSubfolderInput && (
                          <div>
                            <input
                              className="my-3 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type="text"
                              value={newSubfolderName}
                              onChange={(e) =>
                                setNewSubfolderName(e.target.value)
                              }
                            />
                            <button
                              onClick={() => handleCreateSubfolder(folder.id)}
                            >
                              Create
                            </button>
                          </div>
                        )}
                        <div className="ml-2">
                          {folder.subfolders.length > 0 && (
                            <ul>
                              {folder.subfolders.map((subfolder) => (
                                <li key={subfolder.id}>
                                  <div className="flex justify-between items-center">
                                    {/* Render your SVG icon for subfolder */}
                                    <a
                                      href={subfolder.href}
                                      className={classNames(
                                        subfolder.current
                                          ? "bg-gray-800 text-white"
                                          : "text-gray-400 hover:text-white hover:bg-gray-800",
                                        "group flex gap-x-3 pl-8 rounded-md p-2 text-sm leading-6 font-semibold"
                                      )}
                                    >
                                      {subfolder.name}
                                    </a>
                                    <button
                                      className="text-white"
                                      onClick={() =>
                                        toggleSubFolderInput(subfolder.id)
                                      }
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-plus" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#00b341" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 5l0 14" />
                                        <path d="M5 12l14 0" />
                                      </svg>
                                    </button>
                                  </div>
                                  {subfolder && (
                                    <div>
                                      <input
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outlin"
                                        type="text"
                                        value={newSubfolderName}
                                        onChange={(e) =>
                                          setNewSubfolderName(e.target.value)
                                        }
                                      />
                                      <button
                                        className="text-blue-300"
                                        onClick={() =>
                                          handleCreateSubfolder(subfolder.id)
                                        }
                                      >
                                        Create child subfolder
                                      </button>
                                    </div>
                                  )}
                                  <div className="ml-2">
                                    {subfolder.subfolders.length > 0 && (
                                      <ul>
                                        {subfolder.subfolders.map(
                                          (childSubfolder) => (
                                            <li key={childSubfolder.id}>
                                              {/* Render child subfolder content here */}
                                              <div className="flex items-center">
                                                {/* Render your SVG icon for subfolder */}
                                                <a
                                                  href={childSubfolder.href}
                                                  className={classNames(
                                                    subfolder.current
                                                      ? "bg-gray-800 text-white"
                                                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                                  )}
                                                >
                                                  {childSubfolder.name}
                                                </a>
                                              </div>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </li>
                    ))}
                    <div>
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                      <button onClick={handleAddFolder}>Add Folder</button>
                    </div>
                  </ul>
                </li>
                <li></li>
                <li className="-mx-6 mt-auto">
                  <a
                    href="#"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800"
                  >
                    <img
                      className="h-8 w-8 rounded-full bg-gray-800"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">Tom Cook</span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            Dashboard
          </div>
          <a href="#">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-800"
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt=""
            />
          </a>
        </div>

        <main className="py-10 lg:pl-72">
          <div className="px-4 sm:px-6 lg:px-8">
            {showNoEmailsMessage && (
              <div className="h-screen items-center flex justify-center">
    <div className="bg-gray-300 p-8 text-md rounded-md">
    All caught up! No new emails to read.
    </div>
              </div>
            )}
            {emails
              .filter((email) => email.folderId === selectedMailFolder)
              .map((email) => {
                const isEmailDropdownOpen = isDropdownOpen[email.id] || false;
                const isArchivedFolder = selectedMailFolder === "folder4";

                return (
                  <>
                    <div className="mt-10">

                    </div>
                    <div className="flex justify-between bg-gray-100 shadow-xl rounded-md px-3 my-1 py-5" key={email.id}>
                      <div className="w-[20%] truncate">
                        <p className="text-md text-gray-600 font-semibold">{email.subject}</p>
                      </div>
                      <div className="text-md text-gray-600 font-semibold">
                        <p>{email.from}</p>
                      </div>
                      <div>
                      </div>
                      <button className="bg-red-300 px-4 text-white font-bold shadow-xl  hover:shadow-2xl rounded-md" onClick={() => handleDeleteEmail(email.id)}>Delete</button>
                      {isArchivedFolder ? (
                        <button className="bg-green-300 px-4  text-white font-bold shadow-xl  hover:shadow-2xl  rounded-md" onClick={() => handleUnarchive(email.id)}>Unarchive</button>
                      ) : (
                        <button className="bg-green-300 px-4  text-white font-bold shadow-xl  hover:shadow-2xl  rounded-md" onClick={() => handleArchive(email.id)}>Archive</button>
                      )}
                      <div className="">
                        {!isArchivedFolder && (
                          <button className="relative bg-blue-300 text-white font-bold  shadow-xl  hover:shadow-2xl  px-4 rounded-md " onClick={() => handleDropdownToggle(email.id)}>
                            Dropdown
                          </button>
                        )}
                        {isEmailDropdownOpen && !isArchivedFolder && (
                          <div className="flex flex-col ml-3 absolute z-[500] rounded-md bg-white shadow-2xl dropdown-content">
                            {folders
                              .filter((folder) => folder.id !== selectedMailFolder && folder.id !== "folder4") // Exclude the archived folder
                              .map((folder) => (
                                <button
                                  className="hover:bg-gray-200 py-3  font-bold hover:shadow-xl mb-4 px-5 "
                                  key={folder.id}
                                  onClick={() => handleMoveEmail(email.id, folder.id)}
                                >
                                  {folder.name}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </>

                );
              })}
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;
