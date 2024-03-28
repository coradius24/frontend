import { useAdminContext } from "@/app/admin/AdminContext";
import { Button } from "@mui/material";
import Link from "next/link";

const AppDD = () => {
  const { features } = useAdminContext();
  return (
    <>
      {features?.adminHeaderNav?.map((item) => (
        <Button
          color="inherit"
          sx={{ color: (theme) => theme.palette.text.secondary }}
          variant="text"
          href={item.href || "#"}
          component={Link}
          key={item.id}
        >
          {item.title}
        </Button>
      ))}

      {/* <Button
        color="inherit"
        sx={{ color: theme => theme.palette.text.secondary }}
        variant="text"
        href="/admin/chats"
        component={Link}
      >
        Chat
      </Button>
      <Button
        color="inherit"
        sx={{ color: theme => theme.palette.text.secondary }}
        variant="text"
        href="/admin/notice"
        component={Link}
      >
        Notice
      </Button>
      <Button
        color="inherit"
        sx={{ color: theme => theme.palette.text.secondary }}
        variant="text"
        href="/admin/sms"
        component={Link}
      >
        SMS
      </Button>
      */}
    </>
  );
};

export default AppDD;
