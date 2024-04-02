
import db from "@/lib/db"
import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

interface IParams {
  reservationId?: string;
}

export async function DELETE(
  req: Request,
  { params }: { params: IParams}
  ) {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: "Unauthenticate" }, { status: 401 }
      )
    }

    const { reservationId } = params;

    if (!reservationId || typeof reservationId !== 'string') {
      return NextResponse.json(
        { error: "Invalid Id" },
        { status: 404 }
      )
    }

    const reservation = await db.reservation.deleteMany({
      where: {
        id: reservationId,
        OR: [
          { userId: currentUser.id },
          { listing: { userId: currentUser.id }}
        ]
      }
    });

    return NextResponse.json(reservation);
}