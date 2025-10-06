import Image from "next/image";

export default function StoryPage({
  storyImage,
  userId,
  userImage,
  onClickClose
}: {
  storyImage: string;
  userId: string;
  userImage: string;
  onClickClose : ()=>void
}) {
  return (
    <div className="absolute z-50 backdrop-blur-sm   flex justify-center items-center h-full w-full   ">
      <div className=" relative bg-gradient-to-t from-[#18181A] h-[800px] rounded-xl  to-[#202020] w-[500px]  border border-white ">
        <button onClick={onClickClose}  className="absolute right-4 top-4">
        <Image className=" opacity-60 hover:opacity-100" alt="close" src={"/cross.png"} width={20} height={20}/>
        </button>
        <div className=" flex justify-center items-center w-full h-full">
          <div className="relative">
            <Image
              src={storyImage}
              className="object-cover aspect-[9/16] h-fit max-w-[400px] rounded-xl"
              alt="storyImage"
              width={"600"}
              height={"500"}
            />
            <div className="absolute top-4 left-2">
              <div className="flex justify-center items-center gap-3">
                <Image
                  className="rounded-full"
                  src={userImage}
                  width={30}
                  height={30}
                  alt="profile"
                />
              <div className="text-lg font-bold text-white">{userId}</div>
              </div>
            </div>
            <div className="absolute w-full bottom-2 flex justify-center">
              <button className="bg-blue-500 px-8 hover:scale-95 py-2 rounded-[60px] text-white font-semibold">
                Post
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
