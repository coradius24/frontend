import { Paper, useTheme } from "@mui/material";
import React from "react";
import BlankCard from "../shared/BlankCard";
import DataTable from "./DataTable";
import TableToolbar from "./TableToolbar";

function DataTableWithToolbar({
  renderLeftContent,
  renderAction,
  renderSelectAction,
  ...tableProps
}) {
  const [selected, setSelected] = React.useState([]);
  const unSelectAll = () => setSelected([])
  const theme = useTheme();
  const borderColor = theme.palette.divider;
  return (
    <BlankCard>
      <TableToolbar
        selectedCount={selected.length}
        renderLeftContent={renderLeftContent}
        renderAction={renderAction}
        renderSelectAction={() => renderSelectAction(selected, unSelectAll)}
      />
      <Paper

        variant="outlined"
        sx={{ mx: 2, my: 2, border: `1px solid ${borderColor}` }}
      >
        <DataTable
          selected={selected}
          setSelected={setSelected}
          {...tableProps}
        />
      </Paper>
    </BlankCard>
  );
}

export default DataTableWithToolbar;
