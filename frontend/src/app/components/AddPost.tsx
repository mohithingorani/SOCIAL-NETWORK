"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";

export const AddPost = ({
  userId,
  refreshPosts
}:{
  userId:number,
  refreshPosts:()=>void
}) => {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDivClick = () => {
    fileInputRef.current?.click();
  };
  const [caption, setCaption] = useState<string>("");


const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (!selectedFile) return;
  
  setPreview("loading");

  try {
    const options = {
      maxSizeMB: 1, // Maximum size in MB (adjust as needed)
      maxWidthOrHeight: 1024, // Resize large images (optional)
      useWebWorker: true, // For better performance
    };

    const compressedFile = await imageCompression(selectedFile, options);
    setFile(compressedFile); // Save compressed file to state
    setPreview(URL.createObjectURL(compressedFile)); // Optional preview
  } catch (error) {
    console.error("Image compression failed:", error);
  }
};


  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("userId",userId.toString());
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      refreshPosts();
      const data = res.data;
      console.log("Uploaded image:", data);
      setCaption("");
      setPreview(null);
      setFile(null);
      
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="bg-[#101010] p-6 rounded-3xl shadow-md w-full text-white">
      {/* Profile and Input */}
      <div className="flex justify-start items-center w-full">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            alt="profile"
            width={35}
            height={35}
            className="rounded-full"
          />
        )}
        <div className="ml-6 bg-[#161616] border text-sm md:text-lg border-white/20 rounded-[8px] w-full flex">
          <input
            onChange={(e) => setCaption(e.target.value)}
            value={caption}
            type="text"
            placeholder="What is happening?"
            className="w-full py-3 px-4 md:py-3 md:px-6 bg-transparent outline-none"
          />
          <button>
            <Image
              src="/mic_logo.png"
              className="mr-6 w-4 md:w-6 opacity-50 hover:opacity-100"
              width={25}
              height={25}
              alt="mic"
            />
          </button>
        </div>
      </div>

      {/* Media + Actions */}
      <div className="mt-4 flex justify-between items-center">
        <div className="flex justify-start text-sm gap-4 md:gap-6">
          <div
            onClick={handleDivClick}
            className="flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer"
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
              accept="image/*"
            />
            <Image
              onClick={handleDivClick}
              src="/image_05.png"
              alt="media image"
              width={30}
              height={30}
              className="cursor-pointer"
            />
            <div className="hidden lg:block">Media Content</div>
          </div>

          <div className="flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer">
            <Image
              src="/hashtag_05.png"
              alt="hashtag image"
              width={30}
              height={30}
            />
            <div className="hidden lg:block">Hashtags</div>
          </div>

          <div className="flex items-center gap-1 opacity-70 hover:opacity-100 cursor-pointer">
            <Image
              src="/schedule_05.png"
              alt="schedule image"
              width={30}
              height={30}
            />
            <div className="hidden lg:block">Schedule</div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleUpload}
          className="bg-blue-400 md:bg-[#9B9B9B] rounded-[10px] px-4 py-1 hover:bg-blue-400"
        >
          Post
        </button>
      </div>

      {preview=="loading" && (
        <div className="text-white">
          Loading ...
        </div>
      )}
      {/* Optional Preview */}
      {preview!="loading" && preview && (
        <div className="mt-4">
          <Image
            src={preview}
            alt="preview"
            width={200}
            height={200}
            className="rounded-lg object-cover"
          />
        </div>
      )}
    </div>
  );
};
