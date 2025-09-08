import Image from "next/image";

export const ContactCard = ({
  name,
  avatar,
  time,
}: {
  name: string;
  avatar: string;
  time: string;
}) => {
  return (
    <button className="flex items-center w-full px-2 py-1 rounded-xl hover:bg-[#242627] transition">
      <Image
        className="rounded-full"
        src={`/avatars/${avatar}.png`}
        width={40}
        height={40}
        alt="profile image"
      />
      <div className="flex flex-col justify-center items-start pl-3 sm:pl-4">
        <div className="text-base sm:text-lg font-medium truncate">{name}</div>
        <div className="flex flex-wrap text-sm sm:text-sm text-gray-300 gap-1 sm:gap-2">
          <span>liked your story</span>
          {/* <span className="text-gray-400 whitespace-nowrap">{time}</span> */}
        </div>
      </div>
    </button>
  );
};
