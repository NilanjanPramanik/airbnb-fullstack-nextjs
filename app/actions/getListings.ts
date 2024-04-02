import db from "@/lib/db"

export interface IListingsParams {
  userId?: string;
  roomCount?: string;
  guestCount?: string;
  bathroomCount?: string;
  locationValue?: string;
  startDate?: string;
  endDate?: string;
  category?: string
}

export default async function getListings(
  params: IListingsParams
) {
  try {
    const { 
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        // string to number conversion
        gte: +roomCount
      }
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount
      }
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount
      }
    }

    if (locationValue) {
      query.locationValue = locationValue
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: endDate }
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: startDate }
              }
            ]
          }
        }
      }
    }


    const listings = await db.listing.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeListing = listings.map((listing) => ({
      ...listing,
      createdAt: listing.createdAt.toISOString(),
    }));

    return safeListing;
  } catch (error: any) {
    throw new Error(error);
  }
}