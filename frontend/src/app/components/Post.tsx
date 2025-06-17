import Image from "next/image";
import { formatDate } from "../lib/formatDate";

export default function Post({
  image,
  caption,
  Like,
  createdAt,
  username,
  picture,
}: {
  image: string | null;
  caption: string;
  Like?: number;
  createdAt: string;
  updatedAt?: string;
  username: string;
  picture: string;
}) {
  return (
    <div className="bg-[#101010]  p-6 rounded-3xl">
      <button className="flex w-full object-contain  rounded-xl">
        <div className="flex justify-center items-center">
        <Image
          className="rounded-full h-fit  w-fit "
          src={`${picture}`}
          width="30"
          height="30"
          alt="profile image"
        />
        </div>
        <div className="flex flex-col justify-center items-start pl-4">
          <div className="text-lg">{username}</div>
          <div className="flex text-sm text-gray-400 gap-1">
            <div>{formatDate(createdAt)}</div>
          </div>
        </div>
      </button>
      {image && (
        <div className="flex flex-col  justify-center items-center mt-6">
          <Image
            className="rounded-xl max-h-[500px] w-auto object-contain"
            src={image}
            alt="Loading..."
            width={"500"}
            height={"500"}
          />
        </div>
      )}
      {image ? (
        <div className=" mt-4 text-sm w-fit flex justify-start">{caption}</div>
      ) : (
        <div className=" mt-4 text-lg w-fit flex justify-start">{caption}</div>
      )}
      <div className="text-blue-400">#blender #render #design</div>
      <div className="mt-4 flex border gap-2 border-x-0 border-b-0 border-t-1 border-white/20 pt-2">
        <div className="flex items-center ">
          <Image src={"/post/like_white.png"} width={"35"} height={"35"} alt="Like Logo"/>
          <div>1.6k</div>
        </div>
        <div className="flex items-center ">
          <Image src={"/post/comment.png"} width={"35"} height={"35"} alt="Like Logo"/>
          <div>2.3k</div>
        </div>
        <div className="flex items-center ">
          <Image src={"/post/share.png"} width={"35"} height={"35"} alt="Like Logo"/>
          <div>300</div>
        </div>
      </div>

    </div>
  );
}
