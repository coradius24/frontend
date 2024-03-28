import userService from "@/services/userService";
import { debounce } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import CustomAutoComplete from "./theme-elements/CustomAutoComplete";

function StudentSearchAutoComplete({ name, value, onChange, placeholder }) {
  const [searchTerm, setSearchTerm] = useState("");
  // const [options, setOptions] = useState([])
  const { isPending, data: users } = useQuery({
    queryKey: ["userSearchByAdmin", searchTerm],
    queryFn: () => userService.searchUser(searchTerm),
  });
  const debouncedSetter = useMemo(
    () => debounce((keyword) => setSearchTerm(keyword), 500),
    []
  );
  const handleKeyPress = (value) => {
    debouncedSetter(value);
    // setSearchTerm(value)
  };

  return (
    <>
      <CustomAutoComplete
        name={name}
        value={value}
        onChange={onChange}
        options={
          users?.results?.map((user) => ({
            label: `${user.email}`,
            value: user.id,
          })) || []
        }
        placeholder={placeholder}
        handleKeyPress={handleKeyPress}
      />
    </>
  );
}

export default StudentSearchAutoComplete;
