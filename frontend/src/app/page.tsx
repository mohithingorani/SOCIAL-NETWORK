"use client";

import "./globals.css";
import NavBar from "./components/AppBar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { isOnlineAtom, pageAtom, userDataAtom, userNameAtom } from "./atoms";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Post from "./components/Post";
import { AddPost } from "./components/AddPost";
import { MessageCard } from "./components/MessageCard";
import { StoriesCard } from "./components/StoriesCard";
import { useFriends } from "@/hooks/useFriends";

export interface userData {
  email: string;
  name: string;
  picture: string;
  username: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface searchedFriends {
  username: string;
  picture: string;
}

export default function Home() {
  const [userData, setUserData] = useState<userData | null>(null);
  const [userDataValue, setUserDataValue] = useRecoilState(userDataAtom);
  const [userNameValue, setUserNameValue] = useRecoilState(userNameAtom);
  const [isOnline, setIsOnline] = useRecoilState(isOnlineAtom);
  const [currPage, setCurrPage] = useRecoilState(pageAtom);
  const router = useRouter();
  const session = useSession();
  const { friends, loading } = useFriends();
  const [searchedFriends, setSearchedFriends] = useState<
    searchedFriends[] | null
  >(null);

  async function searchFriends(name: string) {
    
    const friends = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search`,
      {
        username: name,
        selfUserName: userData?.username,
      }
    );
    if (friends) {
      console.log("====================================");
      console.log("Friends searched");
      console.log(friends.data);
      console.log("====================================");
      setSearchedFriends(friends.data);
    }
  }

  useEffect(()=>{
    searchFriends("");
  },[])

  useEffect(() => {
    const updateLastActive = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/onlinestatus`,
          {
            email: userData?.email,
          }
        );
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
  }, [userData?.email]);

  function openChat(friend: any) {
    const room = [userDataValue.username, friend.username].sort().join("-");
    router.push(`/chat/?room=${room}&name=${userDataValue.username}`);
  }

  useEffect(() => {
    if (session.status === "loading") {
    } else if (session.data?.user) {
      console.log("Session data:", session.data);
    } else {
      console.log("No session data found");
      router.push("/signin");
    }
  }, [session, router]);

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
    return (
      <div className="text-white flex h-screen w-full justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-6">
      <div className="col-span-1">
        <NavBar userName={userNameValue} />
      </div>
      <div className="flex-grow col-span-5 m-3 md:m-6 border border-white/20 max-h-max text-white rounded-3xl bg-gradient-to-t from-[#18181A]  to-[#202020]">
        <div className="w-full grid grid-cols-3 rounded-3xl">
          <div className="col-span-3 md:col-span-2  rounded-l-3xl p-4 md:px-8 md:pt-8 md:pb-1 flex h-[92vh] flex-col overflow-y-scroll">
            {currPage === "home" && (
              <div>
                <div className="mb-8">
                  <StoriesCard />
                </div>
                <div>
                  <AddPost />
                </div>
                {/* Posts */}
                <div className="mt-6 md:overflow-y-scroll flex flex-col gap-6">
                  <Post />
                  <Post />
                  <Post />
                </div>
              </div>
            )}
            {currPage === "messages" && (
              <>
                <div>
                  <div className=" bg-[#161616] border border-white/20 rounded-[8px] mt-4 w-full flex ">
                    <input
                      type="text"
                      placeholder="Search Friends"
                      className="w-full py-4  px-6 bg-transparent outline-none"
                    />
                    <button>
                      <Image
                        src={"/mic_logo.png"}
                        className=" mr-4 opacity-50 hover:opacity-100"
                        width={"22"}
                        height={"22"}
                        alt="mic"
                      />
                    </button>
                  </div>
                </div>
                <div className="mt-6 ">
                  {loading ? (
                    <div className="text-white flex justify-center items-center">
                      Loading...
                    </div>
                  ) : (
                    friends.map((friend: any, index: number) => (
                      <div key={index} onClick={() => openChat(friend)}>
                        <MessageCard
                          name={friend.username || "Unknown"}
                          location="Jaipur"
                          avatar={friend.picture}
                          // avatar={`avatar_0${(index % 6) + 1}`} // Just an example to rotate avatars
                        />
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

          <div className=" md:col-span-1 hidden   rounded-r-3xl p-8  border border-l-white/20 border-y-0 border-r-0 md:grid grid-rows-2">
            <div className="row-span-1">
              <div className="font-medium text-xl ">Friends</div>
              <div className=" bg-[#161616] border border-white/20 rounded-[8px] w-full flex mt-4">
                <input
                  type="text"
                  placeholder="Search...."
                  className="w-full py-4  px-6 bg-transparent outline-none"
                />
                <button>
                  <Image
                    src={"/mic_logo.png"}
                    className=" mr-4 opacity-50 hover:opacity-100"
                    width={"22"}
                    height={"22"}
                    alt="mic"
                  />
                </button>
              </div>
              <div className="mt-6 overflow-y-scroll max-h-[27vh]">
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  friends.map((friend: any, index: number) => (
                    <div key={index} onClick={() => openChat(friend)}>
                      <MessageCard
                        name={friend.username || "Unknown"}
                        location="Jaipur"
                        avatar={friend.picture}
                        // avatar={`avatar_0${(index % 6) + 1}`} // Just an example to rotate avatars
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="row-span-1 pt-4">
              <div className="font-medium text-xl">Suggestions</div>
              <div className=" bg-[#161616] border border-white/20 rounded-[8px] mt-4 w-full flex ">
                <input
                  type="text"
                  onChange={(e) => {
                    setTimeout(()=>{
                      searchFriends(e.target.value as string);

                    },3000);
                  }}
                  placeholder="Add Friends"
                  className="w-full py-4  px-6 bg-transparent outline-none"
                />
                <button>
                  <Image
                    src={"/mic_logo.png"}
                    className=" mr-4 opacity-50 hover:opacity-100"
                    width={"22"}
                    height={"22"}
                    alt="mic"
                  />
                </button>
              </div>
              <div className="mt-6 overflow-y-scroll max-h-[27vh]">
                {searchedFriends ? (
                  searchedFriends.map((friend) => {
                    return (
                      <MessageCard
                        name={friend.username}
                        location="Delhi, India"
                        avatar={friend.picture}
                      />
                    );
                  })
                ) : (
                  <div>Loading....</div>
                )}
{/* 
                <MessageCard
                  name="Mohit"
                  location="Delhi, India"
                  avatar="/avatars/avatar_03.png"
                />
                <MessageCard
                  name="Karen"
                  location="Delhi, India"
                  avatar="/avatars/avatar_04.png"
                />
                <MessageCard
                  name="Neekunj"
                  location="Delhi, India"
                  avatar="/avatars/avatar_05.png"
                />
                <MessageCard
                  name="Dev"
                  location="Delhi, India"
                  avatar="/avatars/avatar_06.png"
                /> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
