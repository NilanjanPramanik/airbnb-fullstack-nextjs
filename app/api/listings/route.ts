import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: NextRequest) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const body = await req.json();

  const {
    title,
    description,
    imageSrc,
    category,
    location,
    guestCount,
    roomCount,
    bathroomCount,
    price,
  } = body;

  const listing = await db.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      guestCount,
      roomCount,
      bathroomCount,
      price: parseInt(price, 10),
      locationValue: location.value,
      userId: currentUser.id
    },
    include: {
      user: true
    }
  });

  return NextResponse.json(listing);
}