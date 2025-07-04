import Image from "next/image";
export const MessageCardForRequests = ({
  name,
  avatar,
  location,
  acceptRequest
}: {
  name: string;
  avatar: string;
  location: string;
  acceptRequest:()=>any
}) => {
  return (
    <div className="flex border justify-between  border-x-0 border-y-1 border-gray-300/10  hover:bg-[#242627] w-full px-2 py-3 rounded-xl">
      {" "}
      <div className="flex ">
        {" "}
        <Image
          className="rounded-full "
          src={avatar}
          width="50"
          height="50"
          alt="profile image"
        />{" "}
        <div className="flex flex-col justify-center items-start pl-4">
          {" "}
          <div className="text-lg">{name}</div>{" "}
          <div className="flex text-sm text-gray-300 gap-2">
            {" "}
            <div className="text-gray-400">{location}</div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
      <div className="gap-4 flex justify-end h-full">
        <button className="hover:scale-110"><Image src={"/requests/accept.png"} onClick={acceptRequest} alt="accept" width={"40"} height={"40"}/></button>
        <button className="hover:scale-110"><Image src={"/requests/reject.png"} alt="accept" width={"40"} height={"40"}/></button>
        
      </div>
    </div>
  );
};
