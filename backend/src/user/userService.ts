import type { BunRequest } from "bun";
import type { PrintFlowUser, UserMetaData } from "shared/browser";
import { logger } from "shared/node";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import UserMetadata, { getUserMetadata } from "supertokens-node/recipe/usermetadata";
import type { AuthDetails } from "../security/withAuthentication.ts";
import { TEST_USERS } from "./testUsers.ts";

if (process.env.ALLOW_AUTH_OVERRIDE !== "true") {
  supertokens.init({
    supertokens: {
      connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
      apiKey: process.env.SUPERTOKENS_API_KEY,
    },
    appInfo: {
      appName: "Print flow",
      apiDomain: "http://localhost:8000",
      websiteDomain: "http://localhost:3000",
    },
    recipeList: [Session.init(), UserMetadata.init()],
  });
}

export const getUser = (_: BunRequest, authDetails: AuthDetails): Response => {
  return Response.json({
    userUuid: authDetails.userUuid,
    fullName: authDetails.fullName,
    email: authDetails.email,
    avatar: authDetails.avatar,
    roles: Array.from(authDetails.roles),
    permissions: Array.from(authDetails.permissions),
  } satisfies PrintFlowUser);
};

export async function getUserMetaDataById(userId: UUID): Promise<UserMetaData> {
  if (process.env.ALLOW_AUTH_OVERRIDE === "true") {
    const user = TEST_USERS[userId];
    return {
      fullName: user.fullName,
      avatar: user.avatar,
    };
  }
  return (await getUserMetadata(userId)).metadata;
}

export async function getUserMetaDataByIds(userIds: UUID[]) {
  const uniqueUserIds = Array.from(new Set(userIds));
  const metadataPromises: Promise<[UUID, UserMetaData]>[] = uniqueUserIds.map(
    async (userId): Promise<[UUID, UserMetaData]> => {
      try {
        const metadata = await getUserMetaDataById(userId);
        return [userId, metadata];
      } catch (error) {
        logger.error(`Error fetching metadata for user ${userId}:`, error);
        throw error;
      }
    },
  );

  const results = await Promise.all(metadataPromises);
  return new Map(results);
}
