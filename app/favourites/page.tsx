import ClientOnly from "@/components/ClientOnly"
import EmptyState from "@/components/EmptyState"
import getCurrentUser from "../actions/getCurrentUser"
import getFavouriteListing from "../actions/getFavouriteListing";
import FavouritesClient from "./FavouritesClient";

interface FavouritesPageProps {

}

const FavouritesPage = async () => {
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
  };

  const favListings = await getFavouriteListing();

  if (favListings.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="No favourites found"
          subtitle="Looks like you have no favourite listings."
        />
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <FavouritesClient
        listings={favListings}
        currentUser={currentUser}
      />
    </ClientOnly>
  )
}

export default FavouritesPage