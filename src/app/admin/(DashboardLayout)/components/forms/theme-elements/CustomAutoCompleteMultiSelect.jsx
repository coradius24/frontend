import { Autocomplete, Chip, CircularProgress, TextField } from "@mui/material";
import React from "react";

export default function CustomAutoCompleteMultiSelect({
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
        multiple
        value={value}
        onChange={(_, newValues) =>
          onChange({
            target: {
              value: newValues,
              name,
            },
          })
        }
        options={options?.map((p) => p.value) ?? []}
        onInputChange={(_, newInputValue) =>
          handleKeyPress ? handleKeyPress(newInputValue) : null
        }
        getOptionLabel={(option) =>
          options.find((p) => p.value === option)?.label ?? ""
        }
        loadingText="Loading..."
        renderInput={(params) => (
          <TextField
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {rest?.loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}{" "}
                  Lol Lol Lol
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
            {...params}
            placeholder={placeholder || "Select"}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={options.find((p) => p.value === option)?.label ?? ""}
              {...getTagProps({ index })}
            />
          ))
        }
        {...rest}
      />
    </>
  );
}
