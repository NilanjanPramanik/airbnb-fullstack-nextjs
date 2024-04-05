import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { listingId: string } }
  ) {
    try {
      const currentUser = await getCurrentUser();

      if(!currentUser || !currentUser.id || !currentUser.email) {
        return NextResponse.json("Unauthorized", {status:401});
      }
      
    } catch (error) {
      console.log("Payment checkout error", error);
      return NextResponse.json("Internal Error", {status: 500});
    }
}