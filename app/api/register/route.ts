import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const { email, name, password } = body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      name,
      email,
      hashedPassword
    }
  });

  return NextResponse.json(user);
}
