"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export const AddPost = ({
  userId,
  refreshPosts,
}: {
  userId: number;
  refreshPosts: () => void;
}) => {
  const { data: session } = useSession();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDivClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleUpload = async () => {
    if (!file) {
      try {
        setIsUploading(true);
        const post = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/uploadWithoutImage`,
          {
            caption,
            userId: userId,
          }
        );
        return post;
      } catch (err) {
        console.log(err);
        return;
      } finally {
        setIsUploading(false);
        refreshPosts();
        setCaption("");
        return;
      }
    }
    if (file) {
      const formData = new FormData();
      formData.append("userId", userId.toString());
      if (file) formData.append("image", file);
      formData.append("caption", caption);

      try {
        setIsUploading(true);
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Uploaded image:", res.data);
        refreshPosts();
        setCaption("");
        setPreview(null);
        setFile(null);
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setIsUploading(false);
      }
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
          disabled={!caption.trim() && !file}
          className={`rounded-[10px] px-4 py-1 ${
            caption.trim() || file
              ? "bg-blue-400 hover:bg-blue-500"
              : "bg-gray-500 cursor-not-allowed"
          }`}
        >
          {isUploading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Uploading State */}
      {isUploading && (
        <p className="text-sm mt-2 text-gray-400">Uploading...</p>
      )}

      {/* Optional Preview */}
      {preview && (
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
