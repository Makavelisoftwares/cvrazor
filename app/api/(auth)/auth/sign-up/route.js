import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { db } from "@/utils/db";

export const POST = async (req) => {
  try {
    const { firstname, lastname, password, email } = await req.json();

    if (!firstname || !lastname || !email || !password) {
      return NextResponse.json("missing fields", { status: 400 });
    }

    // CHECK IF EMAIL ALREADY TAKEN
    const isEmailTaken = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (isEmailTaken) {
      return NextResponse.json("Email is already taken", { status: 400 });
    }

    // HASH USER'S PASSWORD
    const hashPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    await db.user.create({
      data: {
        email,
        name: `${firstname} ${lastname}`,
        password: hashPassword,
      },
    });

    return NextResponse.json("account creation successful", { status: 200 });
  } catch (err) {
    console.log(err);
  }
};
