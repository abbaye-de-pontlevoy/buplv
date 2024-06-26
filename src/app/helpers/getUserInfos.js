"use server";

import { cookies } from "next/headers";
import * as jose from "jose";
import prisma from "../lib/prisma";
import { isUserAdmin } from "./isUserAdmin";

/**
 * Retrieves user information based on the provided request object.
 * @param {Object} request - The request object.
 * @returns {Promise<Object|boolean>} - A promise that resolves to the user information object if successful, or false if unsuccessful.
 */
export async function getUserInfos(request) {
  // Get the cookie
  const cookie = cookies(request).get("buConnectedToken");

  if (!cookie) return false;

  // Validate it
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const jwt = cookie.value;

  try {
    // Decode the JWT
    const { payload } = await jose.jwtVerify(jwt, secret, {});

    // get the user role from prisma
    const user = await prisma.seller.findUnique({
      where: {
        id: payload.sub.id,
      },
      select: {
        firstname: true,
        name: true,
        id: true,
        email: true,
        phone: true,
        address: true,
        iban: true,
        bic: true,
        return_articles: true,
      },
    });

    return user;
  } catch (err) {
    return false;
  }
}

export const getUserInfosByID = async (id) => {
  // if user is admin
  const admin = isUserAdmin();

  if (!admin) return false; 

  const user = await prisma.seller.findUnique({
    where: {
      id: id,
    },
    select: {
      firstname: true,
      name: true,
      id: true,
      email: true,
      phone: true,
      address: true,
      iban: true,
      bic: true,
      return_articles: true,
    },
  });

  return user;
}