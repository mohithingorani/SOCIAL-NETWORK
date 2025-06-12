"use client";

import "./globals.css";
import NavBar from "./components/AppBar";
import { WelcomeCard } from "./components/WelcomCard";
import Sidebar from "./components/SideBar";
import ImageComponent from "./components/ImageComponent";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { isOnlineAtom, userDataAtom, userNameAtom } from "./atoms";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Post from "./components/Post";

export interface userData {
  email: string;
  name: string;
  picture: string;
  username: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const [userData, setUserData] = useState<userData | null>(null);
  const [userDataValue, setUserDataValue] = useRecoilState(userDataAtom);
  const [userNameValue, setUserNameValue] = useRecoilState(userNameAtom);
  const [isOnline, setIsOnline] = useRecoilState(isOnlineAtom);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    const updateLastActive = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/onlinestatus`,
          {
            email: userData?.email,
          }
        );
        console.log("Sent last active ping");

        return data;
      } catch (err) {
        console.log("Error updating last active");
        console.log(err);
      }
    };
    updateLastActive();
    const interval = setInterval(() => {
      updateLastActive();
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (session.status === "loading") {
    } else if (session.data?.user) {
      console.log("Session data:", session.data);
    } else {
      console.log("No session data found");
      router.push("/signin");
    }
  }, [session]);

  useEffect(() => {
    const getInfo = async () => {
      try {
        console.log("Searching for user Data");
        if (session.data?.user?.email) {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/details?email=${session.data.user.email}`
          );
          console.log("API response:", data);
          setUserData(data);
          setUserDataValue(data);
          if (data?.username) {
            setUserNameValue(data.username);
          } else {
            console.error("Username not found in API response.");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    getInfo();
  }, [session.data?.user?.email, setUserNameValue, setUserDataValue]);

  if (session.data === undefined) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid grid-cols-6 max-h-screen">
      <div className="grid grid-col-1">
        <NavBar userName={userNameValue} />
      </div>
      <div className="flex-grow col-span-5 m-6 border border-white/20 max-h-max text-white rounded-3xl bg-gradient-to-t from-[#18181A]  to-[#202020]">
        <div className="w-full grid grid-cols-3 rounded-3xl">
          <div className="col-span-2  rounded-l-3xl p-8 flex h-[92vh] flex-col overflow-y-scroll">
            <div className="mb-8">
              <StoriesCard />
            </div>
            <div>
              <AddPost />
            </div>
            {/* Posts */}
            <div className="mt-6 overflow-y-scroll">
              <Post />
            </div>
          </div>

          <div className=" col-span-1 rounded-r-3xl p-8  border border-l-white/20 border-y-0 border-r-0"></div>
        </div>
      </div>

      {/* <div className="col-span-1 p-2  ">
          <div className="h-full w-full md:border md:shadow-md rounded-[30px] bg-transparent md:bg-white flex flex-col justify-evenly gap-6  items-center p-6">
            <WelcomeCard />
            <Sidebar userId={userData?.id } />
          </div>
        </div> */}
    </div>
  );
}

const Stories = [
  {
    image: "avatar_09",
    name: "Alice",
  },
  {
    image: "avatar_02",
    name: "Ben",
  },
  {
    image: "avatar_03",
    name: "Charlie",
  },
  {
    image: "avatar_04",
    name: "Diana",
  },
  {
    image: "avatar_05",
    name: "Ethan",
  },
  {
    image: "avatar_06",
    name: "Fiona",
  },
  {
    image: "avatar_07",
    name: "Jordan",
  },
];

const StoriesCard = () => {
  return (
    <>
      <div className="flex">
        <div className="flex justify-center flex-col w-fit items-center gap-2 text-sm mr-12">
          <div className="w-16 h-16 border border-dashed bg-[#1E1E1D] border-white/50 rounded-full border-spacing-5 text-3xl text-white/50   flex justify-center items-center">
            +
          </div>
          <div>Add Story</div>
        </div>
        <div className="flex justify-start ">
          {Stories.map((story) => {
            return (
              <div className="flex mr-12 justify-center flex-col w-fit items-center gap-2 text-sm">
                <div className="w-16 h-16 border border-dashed bg-[#1E1E1D] border-white/50 rounded-full border-spacing-5 text-3xl text-white/50   flex justify-center items-center">
                  <Image
                    className="rounded-full "
                    src={`/avatars/${story.image}.png`}
                    width="76"
                    height="76"
                    alt="profile image"
                  />
                </div>
                <div>{story.name}</div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

const AddPost = () => {
  return (
    <>
      <div className="bg-[#101010] p-6 rounded-3xl shadow-md w-full text-white">
        <div className="flex justify-start w-full">
          <Image
            className="rounded-full "
            src={`/avatars/avatar_01.png`}
            width="60"
            height="60"
            alt="profile image"
          />
          <div className="ml-6 bg-[#161616] border border-white/20 rounded-[8px] w-full flex">
            <input
              type="text"
              placeholder="What is happening?"
              className="w-full  px-6 bg-transparent outline-none"
            />
            <button>
              <Image
                src={"/mic_logo.png"}
                className="mr-6 opacity-50 hover:opacity-100"
                width={"25"}
                height={"25"}
                alt="mic"
              />
            </button>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className=" flex justify-start gap-6">
            <div>Media Content</div>
            <div>Hashtags</div>
            <div>Schedule</div>
          </div>
          <button className="bg-[#9B9B9B] text-xl  rounded-xl px-8 py-2 hover:bg-blue-400">
            Post
          </button>
        </div>
      </div>
    </>
  );
};
