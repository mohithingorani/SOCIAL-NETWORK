import { StoryFile, StoryPreview } from "@/types/types";
import { atom } from "recoil";

export const userNameAtom = atom({
  key: 'userName', // Unique key
  default: "",
});

export const isOnlineAtom = atom({
  key: 'isOnline', // Unique key
  default: false,
});

export const pageAtom = atom({
  key: 'pageVal', // Unique key
  default: "home",
});


export const modalOpenAtom = atom({
  key:"modalOpen",
  default:false
})

export const selectedFileAtom = atom<File | null>({
  key: "selectedFile",
  default: null,
});


export const userDataAtom = atom({
  key: 'userData', // Updated to a unique key
  default: {
    email: "",
    name: "",
    picture: "",
    username: "",
    id: 0,
    createdAt: "",
    updatedAt: "",
  },
});

export const pendingRequestsAtom = atom({
  key: 'pendingRequests',
  default: 0,
});


export const storyPreviewAtom = atom<StoryPreview>({
  key : "storyPreview",
  default:undefined
})


export const selectedFileForStory = atom<StoryFile>({
  key : "storyFile",
  default : undefined
})