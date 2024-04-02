import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import db from '@/lib/db'

export async function POST( req: Request ) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({error: "You are not logged in !"}, { status: 401 });
  }

  const body = await req.json();
  
  const {
    listingId,
    startDate,
    endDate,
    totalPrice
  } = body;

  // console.log(body);

  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.json({error: "Invalid filds"});
  }

  const listingAndReservation = await db.listing.update({
    where: { id: listingId },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice
        }
      }
    },
    include: {
      reservations: true,
    }
  })

  return NextResponse.json(listingAndReservation);
}