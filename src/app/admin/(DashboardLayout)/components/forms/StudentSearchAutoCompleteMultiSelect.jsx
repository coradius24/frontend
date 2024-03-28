import userService from "@/services/userService";
import { Avatar, Box, debounce, Stack, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import CustomAutoCompleteMultiSelect from "./theme-elements/CustomAutoCompleteMultiSelect";

function StudentSearchAutoCompleteMultiSelect({
  name,
  value,
  onChange,
  placeholder,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  // const [options, setOptions] = useState([])
  const { isPending, data: users } = useQuery({
    queryKey: ["userSearchByAdmin", searchTerm],
    queryFn: () => userService.searchUser(searchTerm),
  });
  const { isPending: isSelectedUserLoading, data: selectedUsers } = useQuery({
    queryKey: ["userSelectedByAdmin", value],
    queryFn: () => userService.getSelectedUsers(value),
  });

  const selectedUsersOptions =
    selectedUsers?.map((user) => ({
      label: `${user.email}`,
      value: user.id,
      fullName: user?.fullName,
      photo: user?.photo?.url || null,
    })) || [];

  const usersResultsOptions =
    users?.results?.map((user) => ({
      label: `${user.email}`,
      value: user.id,
      fullName: user?.fullName,
      photo: user?.photo?.url || null,
    })) || [];

  const combinedOptions = [...selectedUsersOptions, ...usersResultsOptions];

  // Use an object to efficiently track uniqueness based on the 'value' property
  const uniqueOptionsMap = {};
  const uniqueOptions = [];

  combinedOptions.forEach((option) => {
    if (!uniqueOptionsMap[option.value]) {
      uniqueOptionsMap[option.value] = true;
      uniqueOptions.push(option);
    }
  });

  // getSelectedUsers
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
      <CustomAutoCompleteMultiSelect
        name={name}
        value={value}
        onChange={(data) => {
          onChange(data);
        }}
        options={uniqueOptions}
        loading={isPending || isSelectedUserLoading}
        placeholder={placeholder}
        handleKeyPress={handleKeyPress}
        renderOption={(props, option, { inputValue }) => {
          const theOption = uniqueOptions.find((p) => p.value === option);

          return (
            <Stack {...props} direction="row" spacing={2}>
              <Avatar src={theOption?.photo} sx={{ width: 40, height: 40 }} />
              <Box>
                <Typography variant="h6" fontWeight="600">
                  {theOption?.fullName}
                </Typography>
                <Typography color="textSecondary" variant="subtitle2">
                  {theOption?.label}
                </Typography>
              </Box>
            </Stack>
          );
        }}
      />
    </>
  );
}

export default StudentSearchAutoCompleteMultiSelect;
