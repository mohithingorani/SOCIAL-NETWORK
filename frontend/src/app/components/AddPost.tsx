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
          <div className="ml-6 bg-[#161616] border border-white/20 rounded-[8px] w-full flex">
            <input
              type="text"
              placeholder="What is happening?"
              className="w-full  py-3 px-6 bg-transparent outline-none"
            />
            <button>
              <Image
                src={"/mic_logo.png"}
                className="mr-6 opacity-50 hover:opacity-100"
                width={"25"}
                height={"25"}
                alt="mic"
              />
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className=" flex justify-start gap-6">
            <div>Media Content</div>
            <div>Hashtags</div>
            <div>Schedule</div>
          </div>
          <button className="bg-[#9B9B9B] text-xl  rounded-xl px-8 py-2 hover:bg-blue-400">
            Post
          </button>
        </div>
      </div>
    </>
  );
};
