"use client"
import { UserStoriesInterface } from "@/types/types";
import Image from "next/image";
import { useState } from "react";
import NextIcon from "./nextButton";
import { TotalStories } from "./TotalStories";

export default function UserStory({
 userStories,
 onClickClose
}: {
  userStories:UserStoriesInterface[],
  onClickClose:()=>void
}) {
  document.addEventListener("keydown", (e) => {
    if (e.key == "Escape") {
      onClickClose();
    }
  });

  const [counter, setCounter] = useState(0);

  function nextStory(){
    if(counter < userStories.length-1){
      setCounter(counter=>counter+1);
    }
  }
  function prevStory(){
    if(counter >0 ){
      setCounter(counter=>counter-1);
    }
  }

  return (
    <div className=" z-200 backdrop-blur-sm   flex justify-center items-center h-full w-full   ">
      <div className=" relative bg-gradient-to-t from-[#18181A] h-[800px] rounded-xl  to-[#202020] w-[500px]  border border-white ">
        <button onClick={onClickClose} className="absolute right-4 top-4">
          <Image
            className=" opacity-60 hover:opacity-100"
            alt="close"
            src={"/cross.png"}
            width={20}
            height={20}
          />
          
        </button>
        <div className=" flex justify-center items-center w-full h-full">
          <div className="relative">
            <Image
              src={userStories[counter].image}
              className="object-cover aspect-[9/16] h-fit max-w-[400px] rounded-xl"
              alt="storyImage"
              width={"600"}
              height={"500"}
            />
            <div className="absolute top-4 left-2">
              <div className="flex justify-center items-center gap-3">
                <Image
                  className="rounded-full"
                  src={userStories[0].user.picture}
                  width={30}
                  height={30}
                  alt="profile"
                />
                <div className="text-lg font-bold text-white">{userStories[0].user.username}</div>
              </div>
            </div>
            {/* <div className="absolute top-0 right-0  text-black">
              Story Count:  {userStories.length}
              
            </div> */}
            <div className="absolute top-0 w-full">
              <TotalStories counter={counter} total={userStories.length-1}/>

            </div>
            <div className="absolute top-0 right-[-100px] h-full  flex justify-end items-center ">
              <button className="select-none focus:outline-none" onClick={nextStory}>
              <NextIcon/>

              </button>
            </div>
            <div className="absolute top-0 left-[-100px] h-full  flex justify-start items-center ">
              <button className="select-none focus:outline-none scale-x-[-1]" onClick={prevStory} >
              <NextIcon/>

              </button>
            </div>
         
          </div>
        </div>
      </div>
    </div>
  );
}
