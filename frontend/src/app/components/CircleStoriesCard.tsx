"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { selectedFileForStory, storyPreviewAtom } from "../atoms";
import { StoryInterface, UserStoriesInterface } from "@/types/types";
import UserStory from "./UserStory";
// import UserStory from "./UserStory";

export const StoriesCard = ({
  groupedStories,
}: {
  groupedStories: Record<number, StoryInterface[]>;
}) => {
  const fileInputRef = useRef(null);
  const [storyPreview, setStoryPreview] = useRecoilState(storyPreviewAtom);
  const [viewStory, setViewStory] = useState(false);
  const [selectedStoryFile, setSelectedStoryFile] =
    useRecoilState(selectedFileForStory);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setSelectedStoryFile(selectedFile);

      const previewUrl = URL.createObjectURL(selectedFile);
      // setPreview(previewUrl);
      setStoryPreview(previewUrl);
      console.log("Preview URL : ", storyPreview);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };

  useEffect(() => {
    return () => {
      if (storyPreview) {
        URL.revokeObjectURL(storyPreview);
      }
    };
  }, [storyPreview]);
  const [userId, setUserId] = useState(0);
  const [userStories, setUserStories] = useState<UserStoriesInterface[] | undefined>(undefined);
  return (
    <>
    <div>
      {viewStory && userStories&&<div className="fixed top-0 left-0 right-0 bottom-0"><UserStory onClickClose={()=>setViewStory(false)}  userStories={userStories}/></div>}
    </div>
      <div className="flex overflow-x-auto  flex-nowrap scrollbar-none">
        <input
          type="file"
          accept="image/*, video/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          className="flex focus:outline-none focus:ring-0 justify-center flex-col w-fit items-center gap-1 md:gap-2 text-sm mr-6 md:mr-12 shrink-0"
        >
          <div className="w-16 h-16 border text-center border-dashed bg-[#1E1E1D] border-white/50 rounded-full text-sm md:text-3xl text-white/50 flex justify-center items-center">
            +
          </div>
          <div className="text-xs text-center">Add Story</div>
        </button>
        <div className="flex justify-start">
          {Object.entries(groupedStories).map(([userId, userStories]) => {
            
            // Safely get the first story to access user info
            const firstStory = userStories[0];
            const user = firstStory.user;
            console.log("userId=",userId)
            console.log("userStories=",JSON.stringify(userStories))
            return (
              <button
              onClick={()=>{
                setViewStory(true)
                setUserStories(userStories)
              }}
              
                key={userId}
                className="flex mr-6 md:mr-12 justify-center flex-col items-center gap-1 md:gap-2 text-sm shrink-0"
              >
                <div className="relative w-20 h-20">
                  <div className="absolute w-full h-full bg-[#1E1E1D] rounded-full border-spacing-5 text-sm md:text-3xl text-white/50 flex justify-center items-center">
                    <div className="absolute border-4 border-blue-500 rounded-full w-full h-full p-1">
                      <Image
                        className="rounded-full select-none"
                        src={user.picture}
                        width={76}
                        height={76}
                        alt={`${user.username}'s profile`}
                      />
                    </div>
                  </div>
                </div>
                <div className="text-xs">{user.username}</div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
