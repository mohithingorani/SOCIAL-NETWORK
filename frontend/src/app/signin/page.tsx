"use client";

import { welcomeImageBlurDataUrl } from "@/data/base64images";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export default function Signin() {
  const [formState, setFormState] = useState<"signup" | "signin">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleAuth = async () => {
    await signIn("google", { callbackUrl: "http://localhost:3001" });
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-t from-[#18181A] to-[#202020] xl:px-24">
      <div className="w-full h-full py-20 px-5 md:px-[50px] lg:px-[60px] xl:px-[100px] 2xl:px-[300px]">
        <div className="bg-[#161616] text-white border border-white/20 h-full grid grid-cols-1 md:grid-cols-2 items-center p-4 md:p-6 rounded-[50px] shadow-2xl">
          {/* LEFT FORM SIDE */}
          <div className="w-full h-full p-5 lg:p-10 overflow-hidden">
            <Image src="/newlogo.svg" width={50} height={50} alt="logo" />

            <div className="font-bold text-6xl mt-8">Get started</div>

            <div className="flex gap-1 text-sm md:text-lg text-gray-300 mt-2">
              {formState === "signup" ? (
                <>
                  <div>Already have an account?</div>
                  <button
                    onClick={() => setFormState("signin")}
                    className="text-orange-400 hover:underline font-semibold"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  <div>Create an account?</div>
                  <button
                    onClick={() => setFormState("signup")}
                    className="text-orange-400 hover:underline font-semibold"
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 flex flex-col p-4 rounded-[10px] h-fit">
              {/* Email Input */}
              <label className="mt-2">
                <div>Email</div>
                <div className="border border-gray-300/20 mt-2 w-full px-4 py-2 rounded-[10px]">
                  <input
                    type="email"
                    className="w-full bg-transparent outline-none"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </label>

              {/* Password Input */}
              <label className="mt-4">
                <div>Password</div>
                <div className="border border-gray-300/20 mt-2 w-full px-4 py-2 rounded-[10px] flex justify-between items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-transparent outline-none"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2"
                  >
                    <Image
                      src={showPassword ? "/closedeye.svg" : "/openeye.png"}
                      alt={showPassword ? "Hide password" : "Show password"}
                      width={20}
                      height={20}
                    />
                  </button>
                </div>
              </label>

              {/* Action Button */}
              <button className="bg-orange-400 hover:bg-orange-500 w-full py-2 rounded-[10px] mt-8 text-white font-semibold">
                {formState === "signup" ? "Sign up" : "Sign in"}
              </button>

              <div className="flex justify-center w-full mt-4">or</div>

              {/* Google Button */}
              <button
                onClick={handleGoogleAuth}
                className="w-full hover:bg-gray-200 text-center border py-[8px] border-gray-300 rounded-[10px] bg-gray-50 flex justify-center items-center gap-3 mt-4"
              >
                <Image
                  src="/logo.svg"
                  width={30}
                  height={30}
                  alt="Google logo"
                />
                <span className="text-black">
                  {formState === "signup"
                    ? "Sign up with Google"
                    : "Sign in with Google"}
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE SIDE */}
          <div className="hidden md:block h-full relative overflow-hidden col-span-1">
            <Image
              placeholder="blur"
              blurDataURL={welcomeImageBlurDataUrl}
              src="/welcomeimage2.jpg"
              alt="Welcome"
              fill
              className="object-cover rounded-[35px]"
            />
            <div className="absolute top-10 left-10 text-gray-600 text-2xl font-semibold z-10">
              <div>connect.</div>
              <div>chat.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
