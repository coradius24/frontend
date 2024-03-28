import {
  Chip,
  CircularProgress,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
// import BlankCard from "../shared/BlankCard"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box } from "@mui/system";
import CustomCheckbox from "../forms/theme-elements/CustomCheckbox";
import TablePaginationActions from "./pagination/TablePaginationActions";

const DataTable = ({
  pagination,
  limit = 10,
  page = 1,
  setQuery,
  columns = [],
  rows,
  rowsCount,
  selectable,
  selectorKey,
  selected = [],
  setSelected,
  isLoading,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleChangePage = (event, page) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: page + 1,
    }));
  };

  const handleChangePageLimit = (event) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      page: 1,
      limit: parseInt(event.target.value, 10),
    }));
  };
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    event.persist();
    setAnchorEl(event.currentTarget.parentElement);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // This is for select all the row
  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n[selectorKey]);
      setSelected(newSelecteds);

      return;
    }
    setSelected([]);
  };

  // This is for the single row sleect
  const handleSelectClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const RenderColum = ({
    columnType,
    variant = "subtitle2",
    sx = {},
    value,
    menu = [],
    row,
    selectable,
    mapLabel,
  }) => {
    const [isOpen, setIsOpen] = useState({
      open: false,
      type: "add",
      data: {},
    });

    switch (columnType) {
      case "status":
        return (
          <Chip
            label={mapLabel ? mapLabel() : value}
            sx={{
              textTransform: "uppercase",
              bgcolor: ["1", "approved", "active", "success", "true"].includes(
                String(value)?.toLowerCase()
              )
                ? (theme) => theme.palette.success.light
                : ["0", "pending", "scheduled", "private"].includes(
                    String(value)?.toLowerCase()
                  )
                ? (theme) => theme.palette.warning.light
                : ["completed"].includes(String(value)?.toLowerCase())
                ? (theme) => theme.palette.primary.light
                : [
                    "3",
                    "rejected",
                    "cancelled",
                    "expired",
                    "false",
                    "blocked",
                  ].includes(String(value)?.toLowerCase())
                ? (theme) => theme.palette.error.light
                : (theme) => theme.palette.secondary.light,
              color: ["1", "approved", "active", "success"].includes(
                String(value)?.toLowerCase()
              )
                ? (theme) => theme.palette.success.main
                : ["0", "pending", "scheduled", "private"].includes(
                    String(value)?.toLowerCase()
                  )
                ? (theme) => theme.palette.warning.main
                : ["completed", "paid"].includes(String(value)?.toLowerCase())
                ? (theme) => theme.palette.primary.main
                : [
                    "3",
                    "rejected",
                    "cancelled",
                    "expired",
                    "false",
                    "blocked",
                  ].includes(String(value)?.toLowerCase())
                ? (theme) => theme.palette.error.main
                : (theme) => theme.palette.secondary.main,
              borderRadius: "8px",
            }}
          />
        );
      case "datetime":
        return (
          <Typography variant={variant} sx={sx}>
            {moment(value).format("lll")}
          </Typography>
        );
      case "bdt":
        return (
          <Typography variant={variant} sx={sx}>
            {value || 0} TK{" "}
          </Typography>
        );
      case "usd":
        return (
          <Typography variant={variant} sx={sx}>
            ${typeof value === "number" ? (value || 0)?.toFixed(2) : value}
          </Typography>
        );
      case "menu":
        return (
          <>
            <ActionToolTip
              setIsOpen={setIsOpen}
              isOpen={isOpen}
              data={row}
              menu={menu}
            />
            {/* <IconButton
              id={`basic-button-${row.id}`}
              aria-controls={open ? `basic-button-${row.id}` : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleClick}
            >
              <IconDotsVertical width={18} />
            </IconButton>
            <Menu
              key={`basic-button-${row.id}`}
              id={`basic-button-${row.id}`}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": `basic-button-${row.id}`,
              }}
            >
              {menu?.map((item, i) => {
                console.log(row, i);
                return (
                  <MenuItem
                    data-id={row.id}
                    key={Math.random()}
                    onClick={(_, _row = row) => {
                      console.log({ _row }, "asdasdf");
                      // item.fn(row, handleClose);
                    }}
                  >
                    {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}

                    {item.label}
                  </MenuItem>
                );
              })}
            </Menu> */}
          </>
        );
      default:
        return (
          <Typography variant={variant} sx={sx}>
            {value || "-"}
          </Typography>
        );
    }
  };
  return (
    <>
      <TableContainer sx={{ position: "relative" }}>
        <Table
          aria-label="custom pagination table"
          sx={{
            // whiteSpace: "nowrap",
            minHeight: isLoading ? "400px" : "unset",
            verticalAlign: "super",
          }}
        >
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <CustomCheckbox
                    color="primary"
                    checked={
                      rows?.length > 0 && selected.length === rows?.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{
                      "aria-label": "select all desserts",
                    }}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell key={column.key}>
                  <Typography variant="h6">{column.name}</Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows?.map((row, i) => {
              const isItemSelected = isSelected(row[selectorKey]);
              const labelId = `enhanced-table-checkbox-${i}`;
              return (
                <TableRow tabIndex={-1} selected={isItemSelected} key={i}>
                  {selectable && (
                    <TableCell
                      onClick={(event) =>
                        handleSelectClick(event, row[selectorKey])
                      }
                      padding="checkbox"
                    >
                      <CustomCheckbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                      />
                    </TableCell>
                  )}
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {col.template &&
                        (typeof col.template === "function"
                          ? col.template(row)
                          : col.template)}
                      {!col.template && (
                        <RenderColum
                          row={row}
                          columnType={col.type}
                          sx={col.sx}
                          variant={col.variant}
                          menu={col.menu}
                          value={row[col.key]}
                          mapLabel={
                            col?.mapLabel && (() => col?.mapLabel(row[col.key]))
                          }
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
          {pagination && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  limitoptions={[
                    5,
                    10,
                    25,
                    50,
                    100,
                    { label: "All", value: -1 },
                  ]}
                  colSpan={6}
                  count={parseInt(rowsCount || 0)}
                  rowsPerPage={parseInt(limit || 10)}
                  page={page - 1}
                  SelectProps={{
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangePageLimit}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              position: "absolute",
              zIndex: 999,
              top: 0,
              right: 0,
              minHeight: "100%",
              background: "#d8e0ed36",
            }}
          >
            <CircularProgress />
          </Box>
        )}
      </TableContainer>
    </>
  );
};

export default DataTable;

const ActionToolTip = ({ data, menu }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{ display: "inline" }}>
      <IconButton
        aria-label="more"
        id={`action__item-${data.id}`}
        aria-controls={open ? `action__item-${data.id}` : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id={`action__item-${data.id}`}
        MenuListProps={{
          "aria-labelledby": data.id,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {menu?.map((item) => {
          return (
            <MenuItem
              key={Math.random()}
              onClick={() => {
                item.fn(data, handleClose);
              }}
            >
              {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
              {item.label}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};
