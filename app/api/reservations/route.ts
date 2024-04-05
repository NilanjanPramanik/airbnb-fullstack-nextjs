import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import db from '@/lib/db'
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  try {

    if (!currentUser) {
      return NextResponse.json({ error: "You are not logged in !" }, { status: 401 });
    }

    const body = await req.json();

    const {
      listingId,
      startDate,
      endDate,
      totalPrice
    }: {
      listingId: string,
      startDate: string,
      endDate: string,
      totalPrice: number,
    } = body;


    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json({ error: "Invalid filds" });
    }

    const listing = await db.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: 'INR',
          product_data: {
            name: listing.title,
            description: listing.description,
          },
          unit_amount: Math.round(totalPrice * 100),
        },
      }
    ];

    let stripeCustomer = await db.stripeCustomer.findUnique({
      where: {
        userId: currentUser.id,
      },
      select: {
        stripeCustomerId: true,
      }
    });

    if (!currentUser.email) {
      return NextResponse.json({ error: "Email not found!" }, { status: 404 });
    }

    if (!stripeCustomer) {
      const customer = await stripe.customers.create({
        name: currentUser.name!,
        email: currentUser.email!,
      });

      stripeCustomer = await db.stripeCustomer.create({
        data: {
          userId: currentUser.id,
          stripeCustomerId: customer.id,
        }
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      line_items,
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/listings/${listingId}?canceled=1`,
      metadata: {
        userId: currentUser.id,
        listingId,
        startDate,
        endDate,
        totalPrice,
      }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.log("Payment checkout error", error);
    return NextResponse.json("Internal Error", { status: 500 });
  }
}