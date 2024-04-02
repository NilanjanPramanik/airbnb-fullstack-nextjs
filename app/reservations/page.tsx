import ClientOnly from "@/components/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "@/components/EmptyState";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";


const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState 
          title="Unauthorized"
          subtitle="Please login"
        />
      </ClientOnly>
    )
  }
  
  const reservations = await getReservations({
    autherId: currentUser.id
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No reservaions found"
          subtitle="Looks like you have no reservaions on your property"
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <ReservationsClient 
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

export default ReservationsPage;