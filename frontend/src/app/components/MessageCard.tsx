import Image from "next/image";

export const MessageCard = ({
  name,
  avatar,
  location
}: {
  name: string;
  avatar: string;
  location: string;
}) => {
  return (
    <div className="flex border  border-x-0 border-y-1 border-gray-300/10  hover:bg-[#242627] w-full px-2 py-3 rounded-xl">
      <Image
        className="rounded-full "
        src={avatar}
        width="50"
        height="50"
        alt="profile image"
      />
      <div className="flex flex-col justify-center items-start pl-4">
        <div className="text-lg">{name}</div>
        <div className="flex text-sm text-gray-300 gap-2">
          <div className="text-gray-400">{location}</div>
        </div>
      </div>
    </div>
  );
};
