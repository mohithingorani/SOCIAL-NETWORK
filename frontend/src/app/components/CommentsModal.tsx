import Image from "next/image";

export default function CenteredModal({
  username,
  comments,
}: {
  username: string;
  comments: { user: string; comment: string }[];
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-[#101010] text-white border border-white/20   rounded-[24px] shadow-lg p-6 w-[90%] grid grid-cols-2 max-w-3xl">
        <div className=" border-r border-white/20">
         <div className="flex justify-center w-full items-center pr-6 ">
                  <Image
                    className="rounded-xl max-h-[500px] object-contain"
                    src={"/postimage.png"}
                    alt="Post Image"
                    width={500}
                    height={500}
                  />
                </div></div>
        <div className="pl-4">
          <div className="text-md font-semibold mb-4">{username}</div>
          <div className="space-y-4 max-h-[40vh] overflow-y-auto">
            {comments.map((comment, index) => (
              <div className="flex justify-start items-start gap-2">
                  <Image
                  className="rounded-full"
                    src={"/avatars/avatar_01.png"}
                    alt="avatar image"
                    width={"40"}
                    height={"40"}
                  />
              <p
                key={index}
                className="text-sm pt-1  leading-snug break-words"
              >
                
                <span className="font-semibold">{comment.user}</span>{" "}
                {comment.comment}
              </p>
              </div>
            ))}
          </div>
            <div className="flex justify-start iteme-center  border-t pt-3 border-white/20">
            <input type="text" className="bg-transparent hover:ring-0 w-full hover:outline-none border-none outline-none" placeholder="Add a comment..." />
            <button>Post</button>
            </div>
        </div>
      </div>
    </div>
  );
}
