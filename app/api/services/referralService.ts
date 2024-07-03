import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function fetchReferrals(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // if userid is not provided, return 400
  if (!userId) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If a userId is provided, find the user with that id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Get all referrals for the user
  const referrals = await prisma.referrals.findMany({
    where: {
      userId: userId,
    },
  });

  // Return all users
  return { data: referrals };
}

export async function createReferral(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the referredId from the search params
  const referredId = searchParams.get("ref");

  // if userid is not provided, return 400
  if (!userId || !referredId) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // If a userId is provided, find the user with that id
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithIdNotFound.Text,
      errorCode: ApplicationError.UserWithIdNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Create a referral record for the user, and update the points and referral count for the referrer
  await prisma.$transaction([
    prisma.referrals.create({
      data: {
        userId: userId,
        referredId: referredId,
      },
    }),
    prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        points: {
          increment: 1000,
        },
        referralCount: {
          increment: 1,
        },
      },
    }),
    // prisma.users.update({
    //   where: {
    //     id: referredId,
    //   },
    //   data: {
    //     points: {
    //       increment: 1,
    //     },
    //   },
    // }),
  ]);

  // Return the response
  return { message: "Referral created successfully" };
}
