"use client"

import { SafeUser } from "@/app/types";
import useFavourite from "@/hooks/useFavourite";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface HeartButtonProps {
  listingId: string;
  currentUser?: SafeUser | null;
}

const HeartButton: React.FC<HeartButtonProps> = ({
  listingId,
  currentUser
}) => {

  const { hasFavourited, toggleFavourite}  = useFavourite({
    listingId,
    currentUser
  });

  // const hasFavorited = currentUser?.favouriteIds.includes( listingId )

  // const toggleFavorite = async () => {

  //   if (!hasFavorited) {
  //     axios.patch(`/api/favourites/${listingId}`, {
  //       listingId
  //     })
  //     .then((res) => {
  //       toast.success(res.data);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.error);
  //     })

  //   } else {
  //     axios.put(`/api/favourites/${listingId}`, {
  //       listingId
  //     })
  //     .then((res) => {
  //       toast.success(res.data);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.error);
  //     })
  //   }
  // };


  return (
    <div
      onClick={toggleFavourite}
      className=" relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={24}
        className={
          hasFavourited ? 'fill-rose-500' : 'fill-neutral-500/70'
        }
      />
    </div>
  )
}

export default HeartButton