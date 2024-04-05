import { useSearchParams } from "next/navigation";
import { SafeListing, SafeUser } from "./types";

import { IListingsParams } from "./actions/getListings";
import getListings from "./actions/getListings";
import getCurrentUser from "./actions/getCurrentUser";

import ClientOnly from "@/components/ClientOnly";
import Container from "@/components/Container";
import EmptyState from "@/components/EmptyState";
import ListingCard from "@/components/listings/ListingCard";
import { getServerSession } from "next-auth";
import { authOptions } from "./utils/auth";

interface HomeProps {
  searchParams: IListingsParams;
}


const Home = async ({ searchParams }: HomeProps) => {
  // As the Home page is a server component so we can use server actions insted of api routes.
  const currentUser = await getCurrentUser();
  const listings = await getListings(searchParams);


  return (

      listings.length === 0 ? (
      <ClientOnly>
        <EmptyState showReset />
      </ClientOnly>
      ) : (

      <ClientOnly>
        <Container>
          <div
            className="pt-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
          >
            {listings && listings?.map((list: SafeListing) => (
              <ListingCard
                currentUser={currentUser}
                key={list.id}
                data={list}
                searchParams={searchParams}
              />
            ))}
          </div>
        </Container>
      </ClientOnly>
      )
  );
}

export default Home;
