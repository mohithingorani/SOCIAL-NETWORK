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
    <button className="flex hover:bg-[#242627] w-full px-2 py-3 rounded-xl">
      <Image
        className="rounded-full "
        src={`/avatars/${avatar}.png`}
        width="50"
        height="50"
        alt="profile image"
      />
      <div className="flex flex-col justify-center items-start pl-4">
        <div className="text-lg">{name}</div>
        <div className="flex text-sm text-gray-300 gap-2">
          <div>liked your story</div>
          <div className="text-gray-400">{time}</div>
        </div>
      </div>
    </button>
  );
};
