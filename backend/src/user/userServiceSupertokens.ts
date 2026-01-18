import type { PrintFlowUserInfo, UpdateableUserField, UserMetaData, UserRole, UserUpdate } from "shared/browser";
import { logger } from "shared/node";
import { getUser, getUsersNewestFirst } from "supertokens-node";
import { getUserMetadata } from "supertokens-node/recipe/usermetadata";
import { addRoleToUser, getRolesForUser, removeUserRole } from "supertokens-node/recipe/userroles";
import { NotFoundError, NotImplementedError, UnauthorizedError } from "../errors";
import type { AuthDetails } from "../security/withAuthentication";
import { getKeys } from "../utils/objectUtils";
import { isUserRoles } from "../utils/typeGuards";
import { getPermittedFields } from "./userPermissionService";
import type { UserService } from "./userService";

const TENANT = "public";

export class UserServiceSupertokens implements UserService {
  getUser = async (userUuid: UUID): Promise<PrintFlowUserInfo | undefined> => {
    const user = await getUser(userUuid);
    if (!user) return undefined;
    const userMetadata = await this.getUserMetaDataById(user.id as UUID);
    const userRoles = (await this.getUserRolesByIds([user.id as UUID])).get(user.id as UUID);
    return {
      userUuid: user.id as UUID,
      fullName: userMetadata.fullName,
      email: user.emails[0],
      avatar: userMetadata.avatar,
      roles: userRoles ?? [],
    };
  };

  getUserMetaDataById = async (userId: UUID): Promise<UserMetaData> => {
    return (await getUserMetadata(userId)).metadata;
  };

  getUsers = async (authDetails: AuthDetails): Promise<PrintFlowUserInfo[]> => {
    if (!authDetails.permissions.has("view_users"))
      throw new UnauthorizedError(`user ${authDetails.userUuid} does not have permission to see all users`);
    const authResponse = await getUsersNewestFirst({
      tenantId: "public",
      limit: 100,
    });
    const userIds = authResponse.users.map((user) => user.id as UUID);
    const userMetadata = await this.getUserMetaDataByIds(userIds);
    const userRoles = await this.getUserRolesByIds(userIds);
    return authResponse.users.map((user) => ({
      userUuid: user.id as UUID,
      fullName: userMetadata.get(user.id as UUID)!.fullName,
      email: user.emails[0],
      avatar: userMetadata.get(user.id as UUID)?.avatar,
      roles: userRoles.get(user.id as UUID) ?? [],
    }));
  };

  getUserMetaDataByIds = async (userIds: UUID[]) => {
    const uniqueUserIds = Array.from(new Set(userIds));
    const metadataPromises: Promise<[UUID, UserMetaData]>[] = uniqueUserIds.map(
      async (userId): Promise<[UUID, UserMetaData]> => {
        try {
          const metadata = await this.getUserMetaDataById(userId);
          return [userId, metadata];
        } catch (error) {
          logger.error(`Error fetching metadata for user ${userId}:`, error);
          throw error;
        }
      },
    );

    const results = await Promise.all(metadataPromises);
    return new Map(results);
  };

  private getUserRolesByIds = async (userIds: UUID[]) => {
    const uniqueUserIds = Array.from(new Set(userIds));
    const rolesPromises: Promise<[UUID, UserRole[]]>[] = uniqueUserIds.map(
      async (userId): Promise<[UUID, UserRole[]]> => {
        try {
          const rolesRequest = await getRolesForUser(TENANT, userId);
          if (!isUserRoles(rolesRequest.roles)) throw new Error("Invalid roles");
          return [userId, rolesRequest.roles];
        } catch (error) {
          logger.error(`Error fetching roles for user ${userId}:`, error);
          throw error;
        }
      },
    );

    const results = await Promise.all(rolesPromises);
    return new Map(results);
  };

  updateUser = async (userUuid: UUID, update: UserUpdate, authDetails: AuthDetails) => {
    const permittedFields = getPermittedFields(userUuid, authDetails);
    console.log("permittedFields:", permittedFields);
    const fieldsToUpdate = getKeys(update);
    console.log("fieldsToUpdate:", fieldsToUpdate);

    for (const field of fieldsToUpdate) {
      if (!permittedFields.includes(field)) {
        console.log("includes:");
        return Promise.reject(
          new UnauthorizedError(
            `user: ${authDetails.userUuid} not allowed to update field ${field} on user ${userUuid}`,
          ),
        );
      }
    }

    const user = await this.getUser(userUuid);
    console.log("user:", user);
    if (!user) throw new NotFoundError(`User ${userUuid} not found`);
    for (const field of fieldsToUpdate) {
      await this.updateUserField(user, field, update[field]);
    }

    return (await this.getUser(userUuid))!;
  };

  private updateUserField = async <T extends UpdateableUserField>(
    user: PrintFlowUserInfo,
    field: T,
    value: PrintFlowUserInfo[T],
  ) => {
    switch (field) {
      case "email":
      case "fullName":
      case "avatar":
        throw new NotImplementedError(`Field ${field} not implemented`);
      case "roles": {
        if (!convertTypeToRoles(value)) return;
        const rolesToAdd = value.filter((role) => !user.roles.includes(role));
        const rolesToRemove = user.roles.filter((role) => !value.includes(role));
        console.log("rolesToRemove:", rolesToRemove);
        console.log("rolesToAdd:", rolesToAdd);
        const rolesToAddResults = rolesToAdd.map((role) => addRoleToUser(TENANT, user.userUuid, role));
        const rolesToRemoveResults = rolesToRemove.map((role) => removeUserRole(TENANT, user.userUuid, role));
        const results = await Promise.all([...rolesToAddResults, ...rolesToRemoveResults]);
        const failures = results.filter((result) => result.status !== "OK");
        if (failures.length > 0) {
          throw new Error(`Failed to update roles for user ${user.userUuid} to ${value}`);
        }
        break;
      }
    }
  };
}

function convertTypeToRoles(roles: unknown): roles is PrintFlowUserInfo["roles"] {
  return true;
}
