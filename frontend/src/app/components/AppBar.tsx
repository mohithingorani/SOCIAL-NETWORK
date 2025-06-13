"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ContactCard } from "./ContactCard";
import { Menu, X } from "lucide-react";

export default function NavBar({ userName }: { userName: string }) {
  const [searchFriend, setSearchFriend] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const session = useSession();

  // Debounce search input (if used later – you can keep original logic)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchFriend), 1500);
    return () => clearTimeout(handler);
  }, [searchFriend]);

  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center w-full h-full bg-white/30 backdrop-blur-md rounded-md">
        <svg /* spinner omitted for brevity */ />
      </div>
    );
  }

  const drawerClasses = menuOpen
    ? "fixed inset-0 bg-black bg-opacity-70 z-40 md:static md:bg-transparent md:inset-auto"
    : "hidden md:block";

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex justify-between items-center p-4 text-white bg-[#18181A]">
        <div className="font-semibold text-lg">{session.data?.user?.name}</div>
        <button onClick={() => setMenuOpen((o) => !o)}>
          {menuOpen ? (
            <X className="w-6 h-6 z-10" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <div className={drawerClasses} onClick={() => setMenuOpen(false)}>
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-[#18181A] md:ml-6 md:bg-transparent text-white md:text-white w-64 md:w-auto h-full md:py-0 p-6 md:p-0 flex flex-col justify-between"
        >
          <div>
            {/* Profile Section */}
            <div className="flex flex-col items-center text-center">
              {session.data?.user?.image && (
                <Image
                  src={session.data.user.image}
                  alt="profile"
                  width={70}
                  height={70}
                  className="rounded-full mt-12"
                />
              )}
              <div className="text-2xl font-medium mt-2">
                {session.data?.user?.name}
              </div>
              <div className="text-sm text-white/70">College Student</div>
              <p className="text-xs text-white/60 mt-2 px-4">
                Guiding the next generation through the journey of health and
                knowledge!
              </p>
            </div>

            {/* Stats */}
            <div className="flex justify-around text-sm  mt-6 mb-4">
              <div className="text-center">
                <div className="font-bold text-xl">30</div>
                <div>Posts</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">92</div>
                <div>Followers</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-xl">56</div>
                <div>Following</div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 border border-y-1 border-x-0 py-4 border-gray-500 text-start">
              {[
                { name: "Feed", image: "icon_01" },
                { name: "Messages", image: "icon_02" },
                { name: "Notifications", image: "icon_03" },
                { name: "Settings", image: "icon_04" },
              ].map((label, key) => (
                <button
                  onClick={() => {
                    if (window.innerWidth < 768) setMenuOpen(false);
                  }}
                  key={key}
                  className={`hover:bg-[#242627] ${
                    key == 0 && "bg-[#242627]"
                  }  flex items-center gap-2  px-3 py-2 rounded-xl w-full text-start`}
                >
                  <div>
                    <Image
                      src={`/${label.image}.png`}
                      alt={label.name}
                      width={"30"}
                      height={"30"}
                    />
                  </div>
                  <div>{label.name}</div>
                </button>
              ))}
            </div>

            {/* Contacts */}
            <div className="mt-6 ">
              <div className="font-bold text-lg mb-2 md:ml-2">Contacts</div>
              <div className="space-y-3 max-h-[30vh] overflow-y-auto">
                <ContactCard avatar="avatar_01" time="3s" name="Jack Lozano" />
                <ContactCard
                  avatar="avatar_09"
                  time="24m"
                  name="Vanessa Mecann"
                />
                <ContactCard avatar="avatar_03" time="2h" name="Samson Clay" />
                <ContactCard avatar="avatar_04" time="2h" name="Another User" />
                <ContactCard
                  avatar="avatar_05"
                  time="2h"
                  name="Extra Contact"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
