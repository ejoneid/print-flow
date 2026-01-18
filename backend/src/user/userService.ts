import type {
  PrintFlowUserInfo,
  UserMetaData,
  UserUpdate,
} from "shared/browser";
import supertokens from "supertokens-node";
import Session from "supertokens-node/recipe/session";
import UserMetadata from "supertokens-node/recipe/usermetadata";
import UserRoles from "supertokens-node/recipe/userroles";
import type { AuthDetails } from "../security/withAuthentication.ts";
import { UserServiceMock } from "./userServiceMock.ts";
import { UserServiceSupertokens } from "./userServiceSupertokens.ts";

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
    recipeList: [Session.init(), UserMetadata.init(), UserRoles.init()],
  });
}

export interface UserService {
  getUser: (userUuid: UUID) => Promise<PrintFlowUserInfo | undefined>;
  getUserMetaDataById: (userUuid: UUID) => Promise<UserMetaData>;
  getUserMetaDataByIds: (userUuids: UUID[]) => Promise<Map<UUID, UserMetaData>>;
  getUsers: (authDetails: AuthDetails) => Promise<PrintFlowUserInfo[]>;
  updateUser: (
    userUuid: UUID,
    update: UserUpdate,
    authDetails: AuthDetails,
  ) => Promise<PrintFlowUserInfo>;
}

export const userService: UserService =
  process.env.ALLOW_AUTH_OVERRIDE === "true"
    ? new UserServiceMock()
    : new UserServiceSupertokens();
