import db from "@/lib/db"

interface IParams {
  listingId?: string;
  userId?: string;
  autherId?: string;
}

export default async function getReservations(
  params: IParams
) {
  try {

    const { listingId, userId, autherId } = params;

    const query: any = {};

    if (listingId) {
      query.listingId = listingId;
    }

    if (userId) {
      query.userId = userId;
    }

    if (autherId) {
      query.listing = { userId: autherId };
    }

    const reservations = await db.reservation.findMany({
      where: query,
      include: {
        listing: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const safeReservations = reservations.map((reservation) => ({
      ...reservation,
      createdAt: reservation.createdAt.toISOString(),
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
      },
    }));

    return safeReservations;
  } catch (error: any) {
    
    throw new Error(error)
  }
}