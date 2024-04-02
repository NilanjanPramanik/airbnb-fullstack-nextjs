'use client'


import { SafeUser } from "../types";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "@/components/listings/ListingCard";
import { Reservation } from "@prisma/client";

interface TripsClientProps {
  reservations: Reservation[];
  currentUser?: SafeUser;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser
}) => {

  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success("Reservaion cancelled");
      router.refresh();
    })
    .catch((err: any) => {
      toast.error(err?.response?.data?.error)
    })
    .finally(() => {
      setDeletingId('');
    });

  }, [router]);


  return (
    <Container>
      <Heading
        title="Trips"
        subtitle="Where you've been and where you're going"
      />
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {
          reservations.map((reservation) => (
            <ListingCard
              key={reservation.id}
              data={reservation.listings}
              reservation={reservation}
              actionId={reservation.id}
              actionLabel="Cancel reservaion"
              onAction={onCancel}
              disabled={deletingId === reservation.id}
              currentUser={currentUser}
            />
          ))
        }
      </div>
    </Container>
  )
}

export default TripsClient