"use client"

import qs from 'query-string';
import { format, formatISO } from "date-fns";
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

import useCountries from "@/hooks/useCountry";

import HeartButton from "../HeartButton";
import Button from "../Button";

import { baseImageUrl } from "@/constent";
import { IListingsParams } from "@/app/actions/getListings";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  searchParams?: IListingsParams | null;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = '',
  currentUser,
  searchParams
}) => {
  const router = useRouter();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const location = getByValue(data.locationValue);

  const imageUrl = `${baseImageUrl}${data.imageSrc}`;

  const handleCancel = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    if (disabled) {
      return;
    }

    onAction?.(actionId);
  }, [disabled, onAction, actionId]);
  
  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    
    return data.price;
  }, [reservation, data.price]);
  
  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }
    
    const start = new Date(searchParams?.startDate || reservation.startDate);
    const end = new Date(searchParams?.endDate || reservation.endDate);
    
    return `${format(start, 'PP')} - ${format(end, 'PP')}`
  }, [reservation]);

  const onClick = () => {
    let currentQuery = {};
    if (params) {
      currentQuery = qs.parse(params.toString())
    }

    console.log(currentQuery)

    const url = qs.stringifyUrl({
      url: `/listings/${data.id}`,
      query: currentQuery,
    }, { skipNull: true })

    router.push(url);
  }
  
  return (
    <div
      onClick={onClick}
      className="col-span-1 cursor-pointer group"
    >
      <div className="flex flex-col gap-2 w-full">
        <div className=" aspect-square w-full relative overflow-hidden rounded-xl">
          <Image
            fill
            alt="listing"
            src={imageUrl}
            className=" object-cover h-full w-full group-hover:scale-110 transition"
          />
          <div className=" absolute top-3 right-3">
            <HeartButton
              listingId={data.id}
              currentUser={currentUser}
            />
          </div>
        </div>
        <div className=" font-semibold text-lg">
          {location?.region}, {location?.label}
        </div>
        <div className="font-light text-neutral-500">
          {reservationDate || data.category}
        </div>
        <div className="flex flex-row items-center gap-1">
          <div className="font-bold">
            ₹ {price}
          </div>
          {!reservation && (
            <div className="font-light">/night</div>
          )}
        </div>
        {onAction && actionLabel && (
          <Button
            disabled={disabled}
            small
            label={actionLabel}
            onClick={handleCancel}
          />
        )}
      </div>
    </div>
  )
}

export default ListingCard