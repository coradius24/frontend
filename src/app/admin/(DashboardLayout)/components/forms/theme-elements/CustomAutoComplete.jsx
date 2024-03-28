import { Autocomplete, Stack, TextField } from "@mui/material";
import CustomTextField from "./CustomTextField";

export default function CustomAutoComplete({
  name,
  value,
  onChange,
  handleKeyPress,
  options = [],
  placeholder,
  ...rest
}) {
  return (
    <>
      <Autocomplete
        value={value}
        //   onChange={onChange}
        onChange={(_, newValue) =>
          onChange({
            target: {
              value: newValue,
              name,
            },
          })
        }
        options={options?.map((p) => p.value) ?? []}
        onInputChange={(_, newInputValue) =>
          handleKeyPress ? handleKeyPress(newInputValue) : null
        }
        getOptionLabel={(option) => {
          return options.find((p) => p.value === option)?.label ?? "";
        }}
        renderInput={(params) => (
          <CustomTextField {...params} placeholder={placeholder || "Select"} />
        )}
        //   renderOption={(option: ICountry) => (
        //     <Box display="flex" flexDirection="row" alignItems="center">
        //       <Box mr={1}>{isoToFlag(option.iso)}</Box>
        //       <Box>
        //         <Typography variant="body2">{option.label}</Typography>
        //       </Box>
        //     </Box>
        //   )}
        {...rest}
      />
    </>
  );
}

export const MultiSelectAutoComplete = ({
  courses,
  value,
  onChangeHandler,
  placeHolder,
}) => {
  return (
    <Stack spacing={3}>
      <Autocomplete
        multiple
        id="tags-standard"
        onChange={(_, values) => {
          onChangeHandler(values);
        }}
        value={value}
        defaultValue={value}
        options={courses || []}
        getOptionLabel={(course) => course.title}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label={placeHolder || "Select Courses"}
            placeholder="Favorites"
          />
        )}
      />
    </Stack>
  );
};
