import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { addEmail } from "../components/features/folders/emailsSlice";

const ComposeModal = ({ onClose, onSubmit }) => {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();

  const cancelButtonRef = useRef(null);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    subject: "",
    attachment: false,
    priority: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      addEmail({
        id: "email4",
        folderId: "folder3",
        from: formData.from,
        to: formData.to,
        subject: formData.subject,
        attachments: formData.attachment,
        priority: formData.priority ? "High" : "Normal",
        read: true,
        conversationId: null,
      })
    );
    setOpen(false); 
  };

  const handleModalClose = () => {
    setOpen(false);
    onClose();
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={cancelButtonRef}
        onClose={handleModalClose}
      >
        <div className="flex items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="relative bg-white rounded-lg px-4 pb-4 pt-5 text-left shadow-xl transition-all transform sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
              <h2>Compose Mail</h2>
              <form onSubmit={handleSubmit}>
                <div className="border-b-2 py-2 px-2">
                  <label className="w-full">
                    To
                    <input
                      className="focus-none focus:outline-none ml-2 w-80"
                      type="text"
                      name="to"
                      value={formData.to}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="border-b-2 py-2 px-2">
                  <label className="w-full">
                    Subject
                    <input
                      className="focus-none focus:outline-none ml-2 w-80"
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="mt-6">
                  <textarea
                    className="h-60 w-full"
                    id="w3review"
                    name="w3review"
                    rows="4"
                    cols="50"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <button
                    className="bg-blue-600 mx-4 rounded-lg text-white px-4 py-[2px]"
                    type="submit"
                  >
                    Send
                  </button>
                  <button
                    className="bg-blue-600  rounded-lg text-white px-4 py-[2px]"
                    ref={cancelButtonRef}
                    onClick={handleModalClose}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default ComposeModal;
