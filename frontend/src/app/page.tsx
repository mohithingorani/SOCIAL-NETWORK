"use client";

import "./globals.css";
import NavBar from "./components/AppBar";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRecoilState } from "recoil";
import {
  isOnlineAtom,
  modalOpenAtom,
  pageAtom,
  userDataAtom,
  userNameAtom,
} from "./atoms";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Post from "./components/Post";
import { AddPost } from "./components/AddPost";
import { MessageCard } from "./components/MessageCard";
import { StoriesCard } from "./components/StoriesCard";
import { useFriends } from "@/hooks/useFriends";
import { PostInterface } from "@/types/types";
import { toast } from "react-toastify";
import { MessageCardForRequests } from "./components/MessageCardForRequests";
import Spinner from "./components/Spinner";
import CommentsModal from "./components/CommentsModal";

// import ReminderModal from "./components/Surprise";
// import ChickShower from "./components/surprise";
// import ChickShower from "./components/surprise";
// import ReminderModal from "./components/surprise";

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
  id: number;
}

enum showFriendsMenu {
  showFriends = 0,
  showRequests = 1,
}

export default function Home() {
  const session = useSession();
  const [userData, setUserData] = useState<userData | null>(null);
  const [userDataValue, setUserDataValue] = useRecoilState(userDataAtom);
  const [userNameValue, setUserNameValue] = useRecoilState(userNameAtom);
  const [isOnline, setIsOnline] = useRecoilState(isOnlineAtom);
  const [menuOpen, setMenuOpen] = useState<number>(showFriendsMenu.showFriends);
  const [currPage, setCurrPage] = useRecoilState(pageAtom);
  const router = useRouter();
  const { friends, loading, refetch } = useFriends();
  const [friendRequests, setFriendRequests] = useState<[any] | null>(null);
  const [searchedFriends, setSearchedFriends] = useState<
    searchedFriends[] | null
  >(null);
  const [commentsPostId, setCommentsPostId] = useState<number | null>(null);
  const [posts, setPosts] = useState<PostInterface[] | null>(null);
  // const [showComments, setShowComments] = useState<boolean>(false);
  const [showComments, setShowComments] = useRecoilState(modalOpenAtom);
  const [currentPostImage, setCurrentPostImage] = useState<string | null>(null);
  const [searchFriendsInput, setSearchFriendsInput] = useState<string>("");
  const [suggestedFriendsInput, setSuggestedFriendsInput] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  // const [friendsList, setFriendsList] = useState<any>();
  const filteredFriends = friends?.filter((f: any) =>
    f.username?.toLowerCase().includes(searchFriendsInput.toLowerCase())
  );

  const filteredSuggestFriends = searchedFriends?.filter((f: any) => {
    return f.username
      ?.toLowerCase()
      .includes(suggestedFriendsInput.toLocaleLowerCase());
  });

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

  async function getPosts() {
    try {
      if (userDataValue.id != 0) {
        const posts = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/getposts?userId=${userDataValue?.id}`
        );

        console.log(posts);
        setPosts(posts.data.posts);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getPosts();
  }, [userDataValue]);

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

  useEffect(() => {
    searchFriends("");
  }, []);

  function showCommentsModal(postId: number, image: string | null) {
    setShowComments(true);
    setCommentsPostId(postId);

    setCurrentPostImage(image);
  }
  async function searchSuggestedFriends(name: string) {
    const friends = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/suggestions`,
      {
        username: name,
        selfUserName: userData?.username,
        userId: userDataValue.id,
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

  useEffect(() => {
    if (userDataValue.id != 0) searchSuggestedFriends("");
  }, [userDataValue]);

  async function getFriendRequests() {
    if (userDataValue.id != 0) {
      const friendRequests = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friend/requests`,
        {
          userId: userDataValue.id,
        }
      );
      setFriendRequests(friendRequests.data.requests);
    }
  }

  useEffect(() => {
    getFriendRequests();
  }, [userDataValue]);

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
      console.log(friends);
      updateLastActive();
    }, 2500);

    return () => clearInterval(interval);
  }, [userData?.email]);

  useEffect(() => {
    if (session.data?.user && session.status === "authenticated") {
      setLoggedIn(true);
      console.log("Session data:", session.data);
    } else if (session.status === "unauthenticated") {
      console.log("No session data found");
      router.push("/signin");
    }
  }, [session]);

  if (!loggedIn) {
    return (
      <div className="text-white flex h-screen w-full justify-center items-center">
        <Spinner />
      </div>
    );
  }
  function openChat(friend: any) {
    const room = [userDataValue.username, friend.username].sort().join("-");
    router.push(`/chat/?room=${room}&name=${userDataValue.username}`);
  }

  async function sendFriendRequest(friendId: number) {
    const friendRequest = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friend/request`,
      {
        fromUserId: userDataValue.id,
        toUserId: friendId,
      }
    );
    const notify = () => toast(friendRequest.data.message);

    notify();
    return friendRequest;
  }

  async function acceptFriendRequest(senderId: number, requestId: number) {
    const request = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/friend/accept`,
      {
        senderId,
        receiverId: userDataValue.id,
        requestId,
      }
    );
    const notify = () => toast(request.data.message);
    getFriendRequests();
    notify();
    refetch();
    return acceptFriendRequest;
  }

  return (
    loggedIn && (
      <>
        {showComments && (
          <CommentsModal
            userId={userDataValue.id}
            currentPostImage={currentPostImage}
            postId={commentsPostId}
            username={userDataValue.username}
          />
        )}{" "}
        <div className="grid grid-cols-1 md:grid-cols-6 overflow-hidden ">
          <div className="col-span-1">
            <NavBar userName={userNameValue} />
          </div>
          <div className="flex-grow col-span-5 m-3 md:m-4  border border-white/20 max-h-max text-white rounded-3xl bg-gradient-to-t from-[#18181A]  to-[#202020]">
            <div className="w-full grid grid-cols-3 rounded-3xl">
              <div className="col-span-3 md:col-span-2  rounded-l-3xl p-4 md:px-8 md:pt-8 md:pb-1 flex h-[92vh] flex-col overflow-y-scroll">
                {currPage === "home" && (
                  <div>
                    <div className="mb-8">
                      <StoriesCard />
                    </div>
                    <div>
                      {userDataValue.id != 0 && (
                        <AddPost
                          userId={userDataValue.id}
                          refreshPosts={getPosts}
                        />
                      )}
                    </div>
                    {/* Posts */}
                    <div className="mt-6 md:overflow-y-scroll flex flex-col gap-6">
                      {posts &&
                        posts.map((post, index) => {
                          return (
                            <Post
                              commentButtonOnClick={() => {
                                showCommentsModal(post.id, post.image || null);
                              }}
                              isLikedByUser={post.isLikedByUser}
                              likePost={async () => {
                                try {
                                  if (post.isLikedByUser) {
                                    await axios.post(
                                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/unlikePost`,
                                      {
                                        userId: userDataValue.id, // or session?.user?.id
                                        postId: post.id,
                                      }
                                    );
                                    console.log("Unliked post " + post.id);
                                  } else {
                                    await axios.post(
                                      `${process.env.NEXT_PUBLIC_BACKEND_URL}/likePost`,
                                      {
                                        username: userDataValue.id,
                                        postId: post.id,
                                      }
                                    );
                                    console.log("Like Post " + post.id);
                                  }

                                  getPosts(); // refresh state from backend if needed
                                } catch (error) {
                                  console.error("Like/unlike failed:", error);
                                }
                              }}
                              likesCount={post._count.likes}
                              commentsCount={post._count.comments}
                              username={post.user.username}
                              picture={post.user.picture}
                              createdAt={post.createdAt}
                              key={post.id}
                              image={post.image || null}
                              caption={post.caption}
                            />
                          );
                        })}
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
                        filteredFriends.map((friend: any, index: number) => (
                          <div
                            className="cursor-pointer"
                            key={index}
                            onClick={() => openChat(friend)}
                          >
                            <MessageCard
                              sendRequest={() => sendFriendRequest(friend.id)}
                              name={friend.username || "Unknown"}
                              location="Jaipur"
                              suggestion={false}
                              avatar={friend.picture}
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
                  <div className="flex justify-between items-end">
                    <div className={`font-medium text-xl`}>Friends</div>
                  </div>
                  <div className=" bg-[#161616] border border-white/20  rounded-[8px] w-full flex mt-4">
                    <input
                      type="text"
                      placeholder="Search...."
                      value={searchFriendsInput}
                      onChange={(e) => setSearchFriendsInput(e.target.value)}
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
                  <div className="flex justify-between mt-4">
                    <button
                      onClick={() => {
                        setMenuOpen(showFriendsMenu.showFriends);
                      }}
                      className={`text-white h-8  text-lg ${
                        menuOpen == showFriendsMenu.showFriends && "underline"
                      } hover:underline`}
                    >
                      Primary
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(showFriendsMenu.showRequests);
                      }}
                      className={`text-sm text-[#EDAD2C] ${
                        menuOpen == showFriendsMenu.showRequests && "underline"
                      } hover:underline h-8`}
                    >
                      Requests ({friendRequests && (friendRequests.length || 0)}
                      )
                    </button>
                  </div>

                  {menuOpen == showFriendsMenu.showFriends && (
                    <div className="mt-2 overflow-y-auto  h-[27vh]">
                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        filteredFriends.map((friend: any, index: number) => (
                          <div
                            className="cursor-pointer"
                            key={index}
                            onClick={() => openChat(friend)}
                          >
                            <MessageCard
                              suggestion={false}
                              name={friend.username || "Unknown"}
                              location="Jaipur"
                              avatar={friend.picture}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                  {menuOpen == showFriendsMenu.showRequests && (
                    <div className="mt-2 overflow-y-auto h-[27vh]">
                      {loading ? (
                        <div>Loading...</div>
                      ) : (
                        friendRequests?.map((request: any, index: number) => (
                          <div className="cursor-pointer" key={index}>
                            <MessageCardForRequests
                              acceptRequest={() =>
                                acceptFriendRequest(
                                  request.sender.id,
                                  request.id
                                )
                              }
                              name={request.sender.username || "Unknown"}
                              location="Jaipur"
                              avatar={request.sender.picture}
                            />
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="row-span-1 pt-4">
                  <div className="font-medium text-xl">Suggestions</div>
                  <div className=" bg-[#161616] border border-white/20 rounded-[8px] mt-4 w-full flex ">
                    <input
                      type="text"
                      value={suggestedFriendsInput}
                      onChange={(e) => {
                        setSuggestedFriendsInput(e.target.value as string);
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
                      filteredSuggestFriends?.map((friend, index) => {
                        return (
                          <MessageCard
                            sendRequest={() => sendFriendRequest(friend.id)}
                            suggestion={true}
                            key={index}
                            name={friend.username}
                            location="Delhi, India"
                            avatar={friend.picture}
                          />
                        );
                      })
                    ) : (
                      <div>Loading....</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
