"use client"

import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Range } from "react-date-range";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import toast from "react-hot-toast";

import { SafeListing, SafeReservation, SafeUser } from "@/app/types";

import useLoginModal from "@/hooks/useRentModal";

import { categories } from "@/components/navber/Categories";
import Container from "@/components/Container";
import ListingHead from "@/components/listings/ListingHead";
import ListingInfo from "@/components/listings/ListingInfo";
import ListingReservation from "@/components/listings/ListingReservation";

let initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
}

interface ListingClientProps {
  reservations?: SafeReservation[];
  listing: SafeListing & {
    user: SafeUser
  };
  currentUser?: SafeUser | null;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listing,
  reservations = [],
  currentUser,
}) => {

  const loginModal = useLoginModal();
  const router = useRouter();
  const params = useSearchParams();

  const start = params.get('startDate');
  const end = params.get('endDate');

  if (start && end ) {
    initialDateRange = {
      startDate: new Date(start),
      endDate: new Date(end),
      key: 'selection',
    }
  }

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    reservations.forEach((reservation) => {
      const range = eachDayOfInterval({
        start: new Date(reservation.startDate),
        end: new Date(reservation.endDate)
      });

      dates = [...dates, ...range];
    });

    return dates;
  }, [reservations]);

  const [isLoading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(listing.price);
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);

  console.log(currentUser)

  const onCreateReservation = useCallback(() => {
    if (!currentUser) {
      return;
    }

    console.log(currentUser)

    setLoading(true);

    axios.post('/api/reservations', {
      totalPrice,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
      listingId: listing?.id,
    })
    .then((res) => {
      toast.success("Checking out!");
      setDateRange(initialDateRange);
      // router.push('/trips');
      window.location.assign(res.data?.url);
    })
    .catch((err) => {
      console.log(err)
      toast.error('Something went wrong!');
    })
    .finally(() => {
      setLoading(false);
    })
  }, [totalPrice, dateRange, listing?.id, router, loginModal, currentUser]);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      const dayCount = differenceInCalendarDays(
        dateRange.endDate,
        dateRange.startDate
      );

      if (dayCount && listing.price) {
        setTotalPrice(dayCount * listing.price);
      } else {
        setTotalPrice(listing.price);
      }
    }
  }, [dateRange.startDate, dateRange.endDate, listing.price])

  const category = useMemo(() => {
    return categories.find((item) => item.label === listing.category);
  }, [categories, listing.category])

  return (
    <Container>
      <div className=" max-w-screen-lg mx-auto">
        <div className="flex flex-col gap-6">
          <ListingHead 
            id={listing.id}
            title={listing.title}
            imageSrc={listing.imageSrc}
            locationValue={listing.locationValue}
            currentUser={currentUser}
          />
          <div className="grid grid-cols-1 md:grid-cols-7 md:gap-10 mt-6">
            <ListingInfo 
              user={listing.user}
              category={category}
              description={listing.description}
              roomCount={listing.roomCount}
              guestCount={listing.guestCount}
              bathroomCount={listing.bathroomCount}
              locationValue={listing.locationValue}
            />
            <div className="order-first mb-10 md:order-last md:col-span-3">
              <ListingReservation 
                price={listing.price}
                totalPrice={totalPrice}
                onChangeDate={(value) => setDateRange(value)}
                dateRange={dateRange}
                onSubmit={onCreateReservation}
                disabled={isLoading || !currentUser}
                disabledDates={disabledDates}
                buttonLabel={currentUser ? "Reserve" : "Sign in to reserve"}
              />
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default ListingClient