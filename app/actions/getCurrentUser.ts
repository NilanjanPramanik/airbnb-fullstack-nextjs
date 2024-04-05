import { getServerSession } from "next-auth/next";

import { authOptions } from "../utils/auth";
import db from "@/lib/db"

export async function getSession() {
  // @ts-ignore
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try{
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email as string }
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      isEmailVerified: currentUser.isEmailVerified?.toISOString() || null,
    }

  } catch (error: any) {
    return null;
  }
}