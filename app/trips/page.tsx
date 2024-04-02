import EmptyState from "@/components/EmptyState";
import ClientOnly from "@/components/ClientOnly";
import TripsClient from "./TripsClient";

import getCurrentUser from "../actions/getCurrentUser"
import getReservations from "../actions/getReservations";


const TripsPage = async () => {

  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState
          title="Unauthorize"
          subtitle="Please login"
        />
      </ClientOnly>
    )
  }

  const reservation = await getReservations({
    userId: currentUser.id
  });

  if (reservation.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No trips found"
          subtitle="Looks like you havent reserved any trips."
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <TripsClient 
        reservations={reservation}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

export default TripsPage