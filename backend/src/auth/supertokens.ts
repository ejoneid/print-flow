import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import UserMetadata, {getUserMetadata} from "supertokens-node/recipe/usermetadata";
import type {UserMetaData} from "shared/browser";
import {TEST_USERS} from "./testUsers.ts";
import {logger} from "shared/node";

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
    recipeList: [
        Session.init(),
        UserMetadata.init(),
    ],
});

export async function getUserMetaDataById(userId: UUID): Promise<UserMetaData> {
    if (process.env.ALLOW_AUTH_OVERRIDE === "true") {
        const user = TEST_USERS[userId]
        return {
            fullName: user.fullName,
            avatar: user.avatar
        }
    }
    return (await getUserMetadata(userId)).metadata;
}

export async function getUserMetaDataByIds(userIds: UUID[]) {
    const uniqueUserIds = Array.from(new Set(userIds));
    const metadataPromises: Promise<[UUID, UserMetaData]>[] = uniqueUserIds.map(async (userId): Promise<[UUID, UserMetaData]> => {
        try {
            const metadata = await getUserMetaDataById(userId);
            return [userId, metadata];
        } catch (error) {
            logger.error(`Error fetching metadata for user ${userId}:`, error);
            throw error
        }
    });

    const results = await Promise.all(metadataPromises);
    return new Map(results);
}