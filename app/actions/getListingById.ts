import db from "@/lib/db"

interface ParamsProps {
  listingId?: string
}

export default async function getListingById(
  params: ParamsProps
) {
  const { listingId } = params;
  try {

    const listing = await db.listing.findUnique({
      where: {
        id: listingId
      },
      include: {
        user: true
      }
    });

    if (!listing) {

      return null;
    }

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        isEmailVerified: listing.user.isEmailVerified?.toISOString() || null,
      }
    }

  } catch (err: any) {
    throw new Error(err);
  }
}