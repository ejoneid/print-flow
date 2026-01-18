import type { PrintFlowUser, PrintFlowUserInfo, UserMetaData, UserUpdate } from "shared/browser";
import { UnauthorizedError } from "../errors";
import type { AuthDetails } from "../security/withAuthentication";
import { getKeys } from "../utils/objectUtils";
import { authDetailsToUser, authDetailsToUserInfo } from "./mappers";
import { TEST_USERS, userUpdateToAuthDetails } from "./testUsers";
import { getPermittedFields } from "./userPermissionService";
import type { UserService } from "./userService";

export class UserServiceMock implements UserService {
  getUser = (userUuid: UUID): Promise<PrintFlowUser> => {
    return Promise.resolve(authDetailsToUser(TEST_USERS[userUuid]));
  };

  getUserMetaDataById = (userUuid: UUID) => {
    const user = TEST_USERS[userUuid];
    return Promise.resolve({
      fullName: user.fullName,
      avatar: user.avatar,
    });
  };

  getUserMetaDataByIds = (userUuids: UUID[]): Promise<Map<UUID, UserMetaData>> => {
    const userMetaDataMap = new Map<UUID, UserMetaData>();
    for (const userId of userUuids) {
      const user = TEST_USERS[userId];
      userMetaDataMap.set(userId, {
        fullName: user.fullName,
        avatar: user.avatar,
      });
    }
    return Promise.resolve(userMetaDataMap);
  };

  getUsers = (authDetails: AuthDetails): Promise<PrintFlowUserInfo[]> => {
    if (!authDetails.permissions.has("view_users"))
      throw new UnauthorizedError(`user ${authDetails.userUuid} does not have permission to see all users`);

    const users = Object.values(TEST_USERS);
    return Promise.resolve(
      users.map((user) => ({
        userUuid: user.userUuid,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        roles: Array.from(user.roles),
        permissions: Array.from(user.permissions),
      })),
    );
  };

  updateUser = (userUuid: UUID, update: UserUpdate, authDetails: AuthDetails) => {
    const permittedFields = getPermittedFields(userUuid, authDetails);
    const fieldsToUpdate = getKeys(update);

    for (const field of fieldsToUpdate) {
      if (!permittedFields.includes(field)) {
        return Promise.reject(
          new UnauthorizedError(
            `user: ${authDetails.userUuid} not allowed to update field ${field} on user ${userUuid}`,
          ),
        );
      }
    }

    TEST_USERS[userUuid] = {
      ...TEST_USERS[userUuid],
      ...userUpdateToAuthDetails(update),
    };
    return Promise.resolve(authDetailsToUserInfo(TEST_USERS[userUuid]));
  };
}
