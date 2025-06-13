import Image from "next/image";

export const AddPost = () => {
  return (
    <>
      <div className="bg-[#101010] p-6 rounded-3xl shadow-md w-full text-white">
        <div className="flex justify-start w-full">
          <Image
            className="rounded-full w-fit "
            src={`/avatars/avatar_01.png`}
            width="40"
            height="40"
            alt="profile image"
          />
          <div className="ml-6 bg-[#161616] border text-sm md:text-lg border-white/20 rounded-[8px] w-full flex">
            <input
              type="text"
              placeholder="What is happening?"
              className="w-full py-1 px-2  md:py-3 md:px-6 bg-transparent outline-none"
            />
            <button>
              <Image
                src={"/mic_logo.png"}
                className="mr-6 w-4 md:w-6  opacity-50 hover:opacity-100"
                width={"25"}
                height={"25"}
                alt="mic"
              />
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className=" flex justify-start text-sm gap-1 md:gap-6">
            <button className="flex gap-1 opacity-70 hover:opacity-100">
              <Image
                src={"/image_05.png"}
                className=""
                alt="media image"
                width={"30"}
                height={"30"}
              />
              <div className="hidden md:block">Media Content</div>
            </button>
            <button className="flex gap-1 opacity-70 hover:opacity-100">
              <Image
                src={"/hashtag_05.png"}
                className=""
                alt="hashtag image"
                width={"30"}
                height={"30"}
              />
              <div className="hidden md:block">Hashtags</div>
            </button>
            <button className="flex gap-1 opacity-70 hover:opacity-100">
              <Image
                src={"/schedule_05.png"}
                className=""
                alt="schedule image"
                width={"30"}
                height={"30"}
              />
              <div className="hidden md:block">Schedule</div>
            </button>
          </div>
          <button className="bg-[#9B9B9B]   rounded-[10px] px-4 py-1 hover:bg-blue-400">
            Post
          </button>
        </div>
      </div>
    </>
  );
};
