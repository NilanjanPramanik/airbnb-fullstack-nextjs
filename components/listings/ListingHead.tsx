"use client";

import { SafeUser } from "@/app/types";
import useCountries from "@/hooks/useCountry";
import Heading from "../Heading";
import Image from "next/image";
import { baseImageUrl } from "@/constent";
import HeartButton from "../HeartButton";

interface ListingHeadProps {
  id: string;
  title: string;
  locationValue: string;
  imageSrc: string;
  currentUser?: SafeUser | null;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  id,
  title,
  locationValue,
  imageSrc,
  currentUser
}) => {

  const { getByValue } = useCountries();

  const location = getByValue(locationValue);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="w-full h-[60vh] overflow-hidden rounded-xl relative">
        <Image
          alt="Image"
          src={`${baseImageUrl}${imageSrc}`}
          fill
          className=" object-cover w-full"
        />
        <div className=" absolute top-5 right-5">
          <HeartButton
            listingId={id}
            currentUser={currentUser}
          />
        </div>
      </div>
    </>
  )
}

export default ListingHead