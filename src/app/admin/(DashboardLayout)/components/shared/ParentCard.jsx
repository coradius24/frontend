'use client'
import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, CardContent, Divider, Box } from '@mui/material';
import { customizer } from '@/utils/admin/theme/constants';


const ParentCard = ({ title, children,action, footer, padding=0 }) => {

  const theme = useTheme();
  const borderColor = theme.palette.divider;

  return (
    <Card
      sx={{ padding, border: !customizer.isCardShadow ? `1px solid ${borderColor}` : 'none' }}
      elevation={customizer.isCardShadow ? 9 : 0}
      variant={!customizer.isCardShadow ? 'outlined' : undefined}
    >
      <CardHeader title={title} action={action} />
      <Divider />

      <CardContent>{children}</CardContent>
      {footer ? (
        <>
          <Divider />
          <Box p={3}>{footer}</Box>
        </>
      ) : (
        ''
      )}
    </Card>
  );
};

export default ParentCard;
