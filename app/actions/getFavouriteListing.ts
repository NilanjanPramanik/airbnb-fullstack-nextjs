import db from '@/lib/db';
import getCurrentUser from "./getCurrentUser";

export default async function getFavouriteListing() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favourites = await db.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favouriteIds || [])]
        }
      }
    });

    const safeFavourites = favourites.map((favourite) => ({
      ...favourite,
      createdAt: favourite.createdAt.toISOString()
    }));

    return safeFavourites;
  } catch (error: any) {
    
    throw new Error(error)
  }
}