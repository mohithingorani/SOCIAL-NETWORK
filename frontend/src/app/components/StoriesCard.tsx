"use client";
import { Stories } from "@/data/avatars";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { storyPreviewAtom } from "../atoms";
// import StoryPage from "./StoryPage";

export const StoriesCard = () => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [storyPreview,setStoryPreview] = useRecoilState(storyPreviewAtom);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const previewUrl = URL.createObjectURL(selectedFile);
      setPreview(previewUrl);
      setStoryPreview(previewUrl);
      console.log("Preview URL : ",storyPreview);
    }
  };
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      (fileInputRef.current as HTMLInputElement).click();
    }
  };

  useEffect(()=>{
    return ()=>{
      if(preview){
        URL.revokeObjectURL(preview)
      }
    }
  },[preview])

  return (
    <>
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
          className="flex justify-center flex-col w-fit items-center gap-1 md:gap-2 text-sm mr-6 md:mr-12 shrink-0"
        >
          <div className="w-16 h-16 border text-center border-dashed bg-[#1E1E1D] border-white/50 rounded-full text-sm md:text-3xl text-white/50 flex justify-center items-center">
            +
          </div>
          <div className="text-xs text-center">Add Story</div>
        </button>
        <div className="flex justify-start">
          {Stories.map((story) => {
            return (
              <div
                key={story.name}
                className="flex mr-6 md:mr-12 justify-center flex-col items-center gap-1 md:gap-2 text-sm shrink-0"
              >
                <div className="w-16 h-16 border border-dashed bg-[#1E1E1D] border-white/50 rounded-full border-spacing-5 text-sm md:text-3xl text-white/50 flex justify-center items-center">
                  <Image
                    className="rounded-full"
                    src={`/avatars/${story.image}.png`}
                    width="76"
                    height="76"
                    alt="profile image"
                  />
                </div>
                <div className="text-xs">{story.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
