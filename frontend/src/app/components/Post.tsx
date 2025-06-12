import Image from "next/image";

export default function Post() {
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
            <div>14 Aug at 4:21 PM</div>
          </div>
        </div>
      </button>
      <div className="flex flex-col  justify-center items-center mt-6">
        <Image
          style={{
            backgroundSize: "cover",
          }}
          className="rounded-xl"
          src={"/view.jpeg"}
          alt="Loading..."
          width={"500"}
          height={"500"}
        />
        <div className=" mt-4 text-md max-w-lg">
          Amidst the endless dunes and burning skies, the desert reminds us —
          even in silence and stillness, there is power. A place untouched by
          time, where every grain of sand holds a story, and every horizon dares
          you to keep going.
        </div>
      </div>
      <div className="text-blue-400">#blender #render #design</div>
    </div>
  );
}
