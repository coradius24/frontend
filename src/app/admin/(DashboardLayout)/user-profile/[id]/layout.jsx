"use client";
import enrollmentService from "@/services/enrollmentService";
import userService from "@/services/userService";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import UserBanner from "./UserBanner";

function Layout({ children, params }) {
  const { data } = useQuery({
    queryKey: ["adminEnrollmentsOfAUser", params.id],
    queryFn: () => enrollmentService.getEnrollmentsOfAUser(params.id),
  });

  const { isPending, data: userInfo } = useQuery({
    queryKey: ["adminSingleUserById", params.id],
    queryFn: () => userService.getUserById(params.id),
  });

  return (
    <div>
      <UserBanner courseCount={data?.length || 0} userInfo={userInfo} />
      <Box mt={3}>{children}</Box>
    </div>
  );
}

export default Layout;
