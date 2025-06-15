import Image from "next/image";
import { formatDate } from "../lib/formatDate";

export default function Post({
  image,caption,Like,createdAt
}:{
  image: string;
  caption: string;
  Like?: number;
  createdAt: string;
  updatedAt?: string;
}) {
  return (
    <div className="bg-[#101010] max-w-lg p-6 rounded-3xl">
      <button className="flex w-full  rounded-xl">
        <Image
          className="rounded-full "
          src={`/avatars/avatar_02.png`}
          width="40"
          height="30"
          alt="profile image"
        />
        <div className="flex flex-col justify-center items-start pl-4">
          <div className="text-md">Mohit</div>
          <div className="flex text-sm text-gray-400 gap-1">
            <div>{formatDate(createdAt)}</div>
          </div>
        </div>
      </button>
      <div className="flex flex-col  justify-center items-center mt-6">
        <Image
          style={{
            backgroundSize: "cover",
          }}
          className="rounded-xl"
          src={image}
          alt="Loading..."
          width={"500"}
          height={"500"}
        />
      </div>
        <div className=" mt-4 text-sm w-fit flex justify-start">
          {caption}
        </div>
      <div className="text-blue-400">#blender #render #design</div>
    </div>
  );
}
