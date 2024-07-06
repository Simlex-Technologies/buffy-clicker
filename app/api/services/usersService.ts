import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
// import { v4 as uuidv4 } from "uuid";
import { ApplicationError } from "@/app/constants/applicationError";
import { StatusCodes } from "@/app/models/IStatusCodes";
import { UserProfileInformation } from "@/app/models/IUser";
import { PointsUpdateRequest } from "@/app/models/IPoints";

export async function createUser(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as UserProfileInformation;

  // Check if all required fields are provided
  if (!request.userId || !request.username) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if user already exists
  const user = await prisma.users.findUnique({
    where: {
      userId: request.userId,
    },
  });

  // If user exists, return message
  if (user) {
    // return fetchUsers({ ...req, url: `/api/users?userId=${request.userId}` } as NextRequest);
    return { user };
  }

  // If user does not exist, create a new user...
  const newUser = await prisma.users.create({
    data: {
      userId: request.userId,
      username: request.username,
      referralCode: `${request.username}${request.userId}`,
    },
  });

  // Return the response
  return { user };
}

export async function fetchUsers(req: NextRequest) {
  // Get the search params from the request url
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  // Get the userId from the search params
  const userId = searchParams.get("userId");

  // Get the userName from the search params
  const userName = searchParams.get("userName");

  // If a userId is provided, find the user with that id
  if (userId) {
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

    // If user is found, return it
    return { data: user };
  }

  // If a userName is provided, find the user with that username
  if (userName) {
    const user = await prisma.users.findUnique({
      where: {
        username: userName,
      },
    });

    // If user is not found, return 404
    if (!user) {
      return {
        error: ApplicationError.UserWithUsernameNotFound.Text,
        errorCode: ApplicationError.UserWithUsernameNotFound.Code,
        statusCode: StatusCodes.NotFound,
      };
    }

    // If user is found, return it
    return { data: user };
  }

  // Fetch all users
  const users = await prisma.users.findMany({
    orderBy: {
      points: "asc",
    },
  });

  // Return all users
  return { data: users };
}

export async function updateUserPoints(req: NextRequest) {
  // Get the body of the request
  const request = (await req.json()) as PointsUpdateRequest;

  // Check if all required fields are provided
  if (!request.username) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if user exists
  const user = await prisma.users.findUnique({
    where: {
      username: request.username,
    },
  });

  // If user exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithUsernameNotFound.Text,
      errorCode: ApplicationError.UserWithUsernameNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // Update the user's points
  const updatedUser = await prisma.users.update({
    where: {
      username: request.username,
    },
    data: {
      points: request.points,
    },
  });

  // Return the response
  return { message: "Successfully updated user's point", data: updatedUser };
}

async function fetchUserByUserId(userId: string) {
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

  // If user is found, return it
  return { user };
}

export async function fetchUserByUsername(userName: string) {
  const user = await prisma.users.findUnique({
    where: {
      username: userName,
    },
  });

  // If user is not found, return 404
  if (!user) {
    return {
      error: ApplicationError.UserWithUsernameNotFound.Text,
      errorCode: ApplicationError.UserWithUsernameNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  // If user is found, return it
  return { user };
}

export async function fetchLeaderboard(req: NextRequest) {
  // Fetch all users
  const users = await prisma.users.findMany({
    orderBy: {
      // order by points in descending order
      points: "desc",
    },
  });

  // Return all users
  return { data: users };
}

export async function updateFreeDailyBoosters(req: NextRequest) {
  // Use search params to get the username
  const searchParams = new URLSearchParams(req.url.split("?")[1]);

  const username = searchParams.get("username");

  const mode = searchParams.get("mode");

  // Check if all required fields are provided
  if (!username) {
    return {
      error: ApplicationError.MissingRequiredParameters.Text,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Check if user exists
  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
  });

  // If user exists, return error
  if (!user) {
    return {
      error: ApplicationError.UserWithUsernameNotFound.Text,
      errorCode: ApplicationError.UserWithUsernameNotFound.Code,
      statusCode: StatusCodes.NotFound,
    };
  }

  if (mode === "fetch") {
    // If the expiration date is in the past, reset the user's free daily boosters
    if (user.dailyBoostersExp && user.dailyBoostersExp < new Date()) {
      const updatedUser = await prisma.users.update({
        where: {
          username: username,
        },
        data: {
          dailyFreeBoosters: 6,
          dailyBoostersExp: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      });

      return {
        message: "Successfully updated user's free daily boosters",
        data: updatedUser,
      };
    } else {
        return {
            message: "Successfully fetched user's free daily boosters",
            data: user,
        };
    }
  }

  // if we are updating the user's free daily boosters...

  // Check if user has no free daily boosters and the expiration date is in the future
  if (
    user.dailyFreeBoosters <= 0 &&
    user.dailyBoostersExp &&
    user.dailyBoostersExp > new Date()
  ) {
    // We can not give the user more free daily boosters today
    return {
      error: ApplicationError.NoFreeBoosters.Text,
      errorCode: ApplicationError.NoFreeBoosters.Code,
      statusCode: StatusCodes.BadRequest,
    };
  }

  // Update the user's free daily boosters and expiration date
  const updatedUser = await prisma.users.update({
    where: {
      username: username,
    },
    data: {
      dailyFreeBoosters: {
        decrement: 1,
      },
      // set the expiration date to 24 hours from now if it is not set or if it is set to a date in the past
      dailyBoostersExp:
        user.dailyBoostersExp && user.dailyBoostersExp > new Date()
          ? user.dailyBoostersExp
          : new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  // Return the response
  return {
    message: "Successfully updated user's free daily boosters",
    data: updatedUser,
  };
}
