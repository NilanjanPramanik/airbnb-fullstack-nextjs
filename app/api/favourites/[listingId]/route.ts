import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import db from "@/lib/db"

export async function PATCH(req: Request) {
  const data = await req.json();
  const listingId = data.listingId;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json(
      {error: "You are not logged in!"}, 
      { status: 401 }
    );
  }

  if (!listingId || typeof listingId !== 'string') {
    return NextResponse.json(
      {error: "Invalid listing id"}, 
      { status: 400 }
    );
  }

  let favouriteIds = [...(currentUser?.favouriteIds || [])];
  favouriteIds.push(listingId);

  await db.user.update({
    where: {
      id: currentUser?.id
    },
    data: {
      favouriteIds
    }
  });

  return NextResponse.json("Added to favourite!");
}


export async function PUT(req: Request) {
  const data = await req.json();
  const listingId = data.listingId;

  const currentUser = await getCurrentUser();

  if (!listingId || typeof listingId !== 'string') {
    return NextResponse.json(
      {error: "Invalid listing id"}, 
      { status: 400 }
    );
  };

  let favouriteIds = [...(currentUser?.favouriteIds || [])];
  favouriteIds = favouriteIds.filter((id) => id !== listingId);

  await db.user.update({
    where: { id: currentUser?.id },
    data: {
      favouriteIds
    }
  });

  return NextResponse.json("Removed from favourite!");
}