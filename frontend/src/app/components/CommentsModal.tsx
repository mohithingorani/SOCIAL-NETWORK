"use client";
import Image from "next/image";
import axios from "axios";
import { useEffect, useState } from "react";



export interface User {
  id: number;
  username: string;
  picture: string;
}

export interface Comment {
  commentId: number;
  text: string;
  userId: number;
  createdAt: string; 
  updatedAt: string; 
  postId: number;
  user: User;
}


export default function CommentsModal({
  username,
  postId,
  currentPostImage
}: {
  username: string;
  postId: number | null;
  currentPostImage:string|null
}) {

  const [comments, setComments] = useState<Comment[] | null>(null);

   async function getCommentsByPostId(postId: number) {
    const comments = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/comments/all`,
      {
        postId,
      }
    );
    setComments(comments.data.comments);
    return comments;
  }
  useEffect(() => {
    if (postId) getCommentsByPostId(postId);
  }, []);
  useEffect(() => {
    if (postId) getCommentsByPostId(postId);
  }, [postId]);
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center ">
      <div className="bg-[#101010] text-white border border-white/20   rounded-[24px] shadow-lg p-6 w-[90%] grid grid-cols-2 max-w-3xl">
        <div className=" border-r border-white/20">
          <div className="flex justify-center w-full items-center pr-6 ">
            <Image
              className="rounded-xl max-h-[500px] object-contain"
              src={currentPostImage || "/postimage.png"}
              alt="Post Image"
              width={500}
              height={500}
            />
          </div>
        </div>
        <div className="pl-4">
          <div className="text-md font-semibold mb-4">{username}</div>
          <div className="space-y-4  h-[40vh]  overflow-y-auto">
            
            {comments ?comments.map((comment, index) => (
              <div className="flex justify-start items-start gap-2">
                <Image
                  className="rounded-full"
                  src={comment.user.picture}
                  alt="avatar image"
                  width={"40"}
                  height={"40"}
                />
                <p
                  key={index}
                  className="text-sm pt-1  leading-snug break-words"
                >
                  <span className="font-semibold">{comment.user.username}</span>{" "}
                  {comment.text}
                </p>
              </div>
            )):<div>
              Loading...
              </div>}
          </div>
          <div className="flex justify-start iteme-center  border-t pt-3 border-white/20">
            <input
              type="text"
              className="bg-transparent hover:ring-0 w-full hover:outline-none border-none outline-none"
              placeholder="Add a comment..."
            />
            <button>Post</button>
          </div>
        </div>
      </div>
    </div>
  );
}
