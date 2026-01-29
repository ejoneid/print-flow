import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PrintQueueItem } from "@/components/PrintQueueItem";
import { QUERIES } from "@/queries";
import { useQuery } from "@tanstack/react-query";
import { Mail, Package, User } from "lucide-react";
import { Link, useParams } from "react-router";
import type { PrintFlowUserInfo, PrintQueueItem as PrintQueueItemType } from "shared/browser";
import { z } from "zod";

export function ProfilePage() {
  const params = useParams();
  const userUuid = z.uuid().optional().safeParse(params.userUuid).data as UUID | undefined;

  if (!userUuid) {
    return <NoProfile />;
  }

  return <Profile userUuid={userUuid} />;
}

function NoProfile() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center border-2 border-border mb-6 sm:h-32 sm:w-32">
          <User className="h-12 w-12 text-muted-foreground sm:h-16 sm:w-16" />
        </div>
        <h1 className="text-2xl font-bold mb-3 md:text-3xl">Profile Not Found</h1>
        <p className="text-muted-foreground text-base mb-6 max-w-md">
          The profile you're looking for doesn't exist or the link is invalid.
        </p>
        <Button variant="default" className="min-h-[44px] px-6" asChild>
          <Link to="/">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

function Profile({ userUuid }: { userUuid: UUID }) {
  const { data: user, isPending: userIsPending } = useQuery(QUERIES.user({ userUuid }));
  const { data: userPrints, isPending: userPrintsIsPending } = useQuery(QUERIES.userPrints({ userUuid }));

  if (userIsPending) {
    return <UserInfoLoading />;
  }

  if (!user) {
    return <NoProfile />;
  }

  return <UserInfo user={user} userPrints={userPrints} userPrintsIsPending={userPrintsIsPending} />;
}

function UserInfoLoading() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <Skeleton className="h-9 w-32 mb-6" />

      {/* Avatar and Name Section Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <Skeleton className="h-20 w-20 rounded-full sm:h-24 sm:w-24" />
            <div className="flex-1 space-y-3 text-center sm:text-left w-full">
              <Skeleton className="h-7 w-48 mx-auto sm:mx-0" />
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contact Information Skeleton */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-4 w-28 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-4 w-72" />
          </div>
        </CardContent>
      </Card>

      {/* Actions Skeleton */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-10 w-full sm:w-32" />
        <Skeleton className="h-10 w-full sm:w-40" />
      </div>
    </div>
  );
}

function UserInfo({
  user,
  userPrints,
  userPrintsIsPending,
}: {
  user: PrintFlowUserInfo;
  userPrints?: PrintQueueItemType[];
  userPrintsIsPending: boolean;
}) {
  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6 md:text-3xl">Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName}
                className="h-20 w-20 rounded-full object-cover border-2 border-border sm:h-24 sm:w-24"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center border-2 border-border sm:h-24 sm:w-24">
                <User className="h-10 w-10 text-muted-foreground sm:h-12 sm:w-12" />
              </div>
            )}
            <div className="flex-1 text-center sm:text-left">
              <CardTitle className="text-xl mb-2 md:text-2xl">{user.fullName}</CardTitle>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {user.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="capitalize">
                    {role.toLowerCase()}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Email Address</p>
            <p className="text-base mt-1 break-all">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">User ID</p>
            <p className="text-sm mt-1 font-mono text-muted-foreground break-all">{user.userUuid}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            Print History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {userPrintsIsPending ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : !userPrints || userPrints.length === 0 ? (
            <div className="text-center py-8">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No print requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userPrints.map((print) => (
                <PrintQueueItem key={print.uuid} item={print} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
