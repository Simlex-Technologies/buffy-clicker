import axios from "axios";
import { ApiRoutes } from "./apiRoutes";
import { UserProfileInformation } from "../models/IUser";
import { PointsUpdateRequest } from "../models/IPoints";
import { ReferralCreationRequest } from "../models/IReferral";
import { MultiLevelRequest } from "../models/ILevel";

export const API = axios.create({
  baseURL: ApiRoutes.BASE_URL_LIVE,
});

//#region user

export function useCreateUser() {
  async function createUser(user: UserProfileInformation) {
    return API.post(ApiRoutes.Users, user);
  }

  return createUser;
}

export function useFetchUserInformation() {
  async function fetchUserInformation(userId: string) {
    return API.get(`${ApiRoutes.Users}?userId=${userId}`);
  }

  return fetchUserInformation;
}

export function useFetchUserInformationByUserName() {
  async function fetchUserInformationByUserName(data: {
    username?: string;
    userId?: string;
  }) {
    return API.get(
      `${ApiRoutes.Users}${data.username ? `?userName=${data.username}` : ""}${
        data.userId ? `?userId=${data.userId}` : ""
      }`
    );
  }

  return fetchUserInformationByUserName;
}

export function useUpdateUserPoints() {
  async function updateUserPoints(data: PointsUpdateRequest) {
    return API.post(ApiRoutes.Points, data);
  }

  return updateUserPoints;
}

export function useUpdateUserLevels() {
    async function updateUserLevels(data: MultiLevelRequest) {
        return API.post(ApiRoutes.UsersMultiLevels, data);
    }
    
    return updateUserLevels;    
}

export function useCreateReferral() {
  async function createReferral(data: ReferralCreationRequest) {
    return API.post(ApiRoutes.Referrals, data);
  }

  return createReferral;
}

export function useFetchLeaderboard() {
  async function fetchLeaderboard() {
    return API.get(ApiRoutes.Leaderboard);
  }

  return fetchLeaderboard;
}

export function useUpdateDailyBoosts() {
  async function updateDailyBoosts(username: string, mode: "fetch" | "update") {
    return API.post(`${ApiRoutes.UsersDailyBoosts}/?username=${username}&mode=${mode}`);
  }

  return updateDailyBoosts;
}

//#endregion
