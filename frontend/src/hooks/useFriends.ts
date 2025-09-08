"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";

export const useFriends = () => {
  const { data: session } = useSession();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = useCallback(async () => {
    setLoading(true);
    try {
      if (session?.user?.email) {
        const { data: userData } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/details?email=${session.user.email}`
        );
        const userId = userData.id;

        const { data: friendsData } = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/friends?userId=${userId}`
        );

        setFriends(friendsData.friends);
      }
    } catch (error) {
      console.error("Failed to fetch friends:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.email]);

  useEffect(() => {
    if (session?.user?.email) {
      fetchFriends();
    }
  }, [session, fetchFriends]);

  return { friends, loading, refetch: fetchFriends };
};
