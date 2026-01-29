import type { PrintFlowUser, PrintFlowUserInfo, UserMetaData, UserUpdate } from "shared/browser";
import { getKeys } from "shared/browser/objectUtils";
import { UnauthorizedError } from "../errors";
import { getAuthDetails } from "../security/requestContext";
import { authDetailsToUser, authDetailsToUserInfo } from "./mappers";
import { TEST_USERS, userUpdateToAuthDetails } from "./testUsers";
import { userPermissionService } from "./userPermissionService";
import type { UserService } from "./userService";

export class UserServiceMock implements UserService {
  getUser = (userUuid: UUID): Promise<PrintFlowUser> => {
    userPermissionService.canViewUserOrError(userUuid);
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

  getUsers = (): Promise<PrintFlowUserInfo[]> => {
    const authDetails = getAuthDetails();
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

  updateUser = (userUuid: UUID, update: UserUpdate) => {
    const authDetails = getAuthDetails();
    const permittedFields = userPermissionService.getPermittedFields(userUuid, authDetails);
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
