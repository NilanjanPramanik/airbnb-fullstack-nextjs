import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import db from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.messege}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;
  const listingId = session?.metadata?.listingId;
  const startDate = session?.metadata?.startDate;
  const endDate = session?.metadata?.endDate;
  const totalPrice = parseInt(session?.metadata?.totalPrice! ,10);

  if (event.type === "checkout.session.completed") {
    if (!userId || !listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json('Webhook Erro: Missing metadata', { status: 400 });
    }

    const reservation = await db.listing.update({
      where: { id: listingId },
      data: {
        reservations: {
          create: {
            userId,
            startDate,
            endDate,
            totalPrice
          }
        }
      },
      include: {
        reservations: true,
      }
    });

    console.log("Reservations: ",reservation);


  } else {
    return NextResponse.json(`Webhook Error: Unhandled event type ${event.type}`, {status: 200})
  }

  return NextResponse.json('Success', { status: 200 });
}