"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { ContactCard } from "./ContactCard";

export default function NavBar({ userName }: { userName: string }) {
  const [users, setUsers] = useState([]);
  const [showAddFriend, setShowAddFriend] = useState<boolean>(false);
  const [showRequests, setShowRequests] = useState<boolean>(false);
  const [searchFriend, setSearchFriend] = useState<string>("");
  const [recienvedRequests, setRecievedRequests] = useState([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const session = useSession();

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchFriend);
    }, 1500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchFriend]);

  // Fetch users based on debounced search term
  const getUsersList = useCallback(
    async (searchFriend: string) => {
      try {
        console.log("searchFriend is", searchFriend);
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/search?username=${searchFriend}&selfUsername=${userName}`;
        const res = await axios.get(url);
        setUsers(res.data);
        console.log("Users fetched successfully", res.data);
      } catch (err) {
        console.error("Error getting users", err);
      }
    },
    [userName]
  );

  useEffect(() => {
    if (debouncedSearch) {
      getUsersList(debouncedSearch);
    }
  }, [debouncedSearch, getUsersList]);

  const mouseOutAddFriend = () => {
    setShowAddFriend(false);
  };
  const mouseOutRecievedRequests = () => {
    setShowRequests(false);
  };

  // Fetch friend requests
  const getRequests = useCallback(async () => {
    try {
      console.log("Fetching requests for userName:", userName);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/friend/requests?username=${userName}`
      );
      setRecievedRequests(res.data.requests);
    } catch (err) {
      console.error("Error fetching friend requests", err);
    }
  }, [userName]);

  // Fetch friend requests periodically
  useEffect(() => {
    const interval = setInterval(() => {
      getRequests();
    }, 5000);

    return () => clearInterval(interval);
  }, [getRequests]);

  // Fetch requests on userName change
  useEffect(() => {
    if (userName) {
      getRequests();
    }
  }, [userName, getRequests]);

  // Conditional rendering based on session status
  if (session.status === "loading") {
    return (
      <div className="flex justify-end gap-4 bg-white rounded-md bg-opacity-55 text-white backdrop-blur-md text-2xl">
        <div role="status" className="flex justify-center items-center w-full">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-3 h-screen  text-white px-4 py-12 ">
      <div className="flex justify-center  row-span-1  items-center flex-col ">
        {session.data ? (
          <div className=" rounded-full group mb-4 ">
            <Image
              className="rounded-full "
              src={`${session.data.user?.image}`}
              width="70"
              height="70"
              alt="profile image"
            />
          </div>
        ) : null}
        <div className="text-3xl font-medium ">
          {session.data && session.data.user?.name}
        </div>
        <div className="text-sm opacity-70 mb-2">College Student</div>
        <div className="text-sm opacity-70 text-center mx-10 mb-8">
          Guiding the next generation through the journey of health and
          knowledge!
        </div>
        <div className="flex w-full justify-around items-center">
          <div className="justify-center  items-center text-center">
            <div className="font-bold text-xl">368</div>
            <div className="text-sm ">Posts</div>
          </div>
          <div className="justify-center  items-center text-center">
            <div className="font-bold text-xl">184.3K</div>
            <div className="text-sm ">Followers</div>
          </div>
          <div className="justify-center  items-center text-center">
            <div className="font-bold text-xl">1.04M</div>
            <div className="text-sm ">Following</div>
          </div>
        </div>
      </div>

      <div className="row-span-1 flex flex-col justify-center items-start w-full text-md">
        <button className="hover:bg-[#242627] px-3 py-4 rounded-xl w-full text-start">
          Feed
        </button>
        <button className="hover:bg-[#242627] px-3 py-4 rounded-xl w-full text-start">
          Messages
        </button>
        <button className="hover:bg-[#242627] px-3 py-4 rounded-xl w-full text-start">
          Notifications
        </button>
        <button className="hover:bg-[#242627] px-3 py-4 rounded-xl w-full text-start">
          Settings
        </button>
      </div>
      <div className="row-span-1 flex flex-col ">
        <div className="font-bold text-lg mb-4">Contacts</div>
        <div className="overflow-y-scroll">
          <ContactCard avatar="avatar_01" time="3s" name="Jack Lozano" />
          <ContactCard avatar="avatar_09" time="24m" name="Vanessa Mecann" />
          <ContactCard avatar="avatar_03" time="2h" name="Samson Clay" />
          <ContactCard avatar="avatar_04" time="2h" name="Samson Clay" />
          <ContactCard avatar="avatar_05" time="2h" name="Samson Clay" />
        </div>
      </div>
    </div>
  );
}

