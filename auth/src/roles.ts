import UserRoles from "supertokens-node/recipe/userroles";

export const userRoles = {
  ADMIN: {
    name: "ADMIN",
    permissions: ["read", "write", "request_print", "approve_print"],
  },
  USER: {
    name: "USER",
    permissions: ["read", "request_print"],
  },
} as const;

export async function inituserRoles() {
  for (const role of Object.values(userRoles)) {
    const response = await UserRoles.createNewRoleOrAddPermissions(role.name, role.permissions);
    console.log({ ...response, role });
  }
  // const responses = await Promise.allSettled(
  //   Object.values(userRoles).map((role) => UserRoles.createNewRoleOrAddPermissions(role.name, role.permissions)),
  // );
  // for (const response of responses) {
  //   console.log(response);
  // }
}
