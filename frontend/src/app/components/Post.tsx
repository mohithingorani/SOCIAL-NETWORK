"use client";

import Image from "next/image";
import { formatDate } from "../lib/formatDate";
import { useEffect, useState } from "react";

enum LikeImage {
  white = "like_white.png",
  red = "like.png",
}

export default function Post({
  image,
  caption,
  likesCount = 0,
  createdAt,
  username,
  picture,
  likePost,
  isLikedByUser,
}: {
  image: string | null;
  caption: string;
  likesCount?: number;
  createdAt: string;
  username: string;
  picture: string;
  likePost: () => Promise<void>;
  isLikedByUser: boolean;
}) {
  const [numLikes, setNumLikes] = useState(likesCount);
  const [liked, setLiked] = useState(isLikedByUser);
  const [likeImage, setLikeImage] = useState<string>(
    isLikedByUser ? LikeImage.red : LikeImage.white
  );

  useEffect(() => {
    setLikeImage(liked ? LikeImage.red : LikeImage.white);
  }, [liked]);

  const handleLikeClick = async () => {
    try {
      await likePost(); // 🔁 handles both like & unlike

      setLiked((prev) => !prev);
      setNumLikes((prev) => (liked ? prev - 1 : prev + 1));
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  return (
    <div className="bg-[#101010] p-6 rounded-3xl">
      <button className="flex w-full object-contain rounded-xl">
        <div className="flex justify-center items-center ">
          <Image
            className="rounded-full"
            src={picture}
            width={30}
            height={30}
            alt="profile"
          />
        </div>
        <div className="flex flex-col justify-center items-start pl-4">
          <div className="text-lg">{username}</div>
          <div className="text-sm text-gray-400">{formatDate(createdAt)}</div>
        </div>
      </button>

      {image && (
        <div className="flex justify-center items-center mt-6">
          <Image
            className="rounded-xl max-h-[500px] object-contain"
            src={image}
            alt="Post Image"
            width={500}
            height={500}
          />
        </div>
      )}

      <div className={`mt-4 ${image ? "text-sm" : "text-lg"} w-fit`}>
        {caption}
      </div>

      {/* <div className="text-blue-400">#blender #render #design</div> */}

      <div className="mt-4 flex border-t border-white/20 pt-2 gap-4">
        <div className="flex items-center gap-2">
          <button onClick={handleLikeClick}>
            <Image
              src={`/post/${likeImage}`}
              width={35}
              height={35}
              alt="Like"
            />
          </button>
          <span>{numLikes}</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/post/comment.png" width={35} height={35} alt="Comment" />
          <span>2.3k</span>
        </div>

        <div className="flex items-center gap-2">
          <Image src="/post/share.png" width={35} height={35} alt="Share" />
          <span>300</span>
        </div>
      </div>
    </div>
  );
}
