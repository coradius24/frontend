const { Toolbar, Typography, Box,  alpha } = require("@mui/material");

const TableToolbar = (props) => {
    const { selectedCount,  renderSelectAction , renderAction, renderLeftContent, children} = props;
    if( !selectedCount && !renderAction && !renderLeftContent) {
      return null;
    }
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(selectedCount > 0 && {
            bgcolor: (theme) =>
              alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
          }),
        }}
      >
        {selectedCount > 0 ? (
          <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle2" component="div">
            {selectedCount} selected
          </Typography>
        ) : (
          <Box sx={{ flex: '1 1 100%' }}>
            {typeof renderLeftContent == 'function' ? renderLeftContent() :  renderLeftContent}
          </Box>
        )}
  
        {selectedCount > 0 ? (
          typeof renderSelectAction == 'function' ?  renderSelectAction() : renderSelectAction
        ) : (
          typeof renderAction == 'function' ? renderAction() : renderAction
        )}
      </Toolbar>
    );
  };

  export default TableToolbar;