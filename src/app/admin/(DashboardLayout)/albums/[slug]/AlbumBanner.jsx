import {
    Grid,
    Box,
    Typography,
    Button,
    Avatar,
    Stack,
    CardMedia,
    styled,
    Fab,
  } from '@mui/material';
  import {
    IconBrandDribbble,
    IconBrandFacebook,
    IconBrandTwitter,
    IconBrandYoutube,
    IconFileDescription,
    IconUserCheck,
    IconUserCircle,
  } from '@tabler/icons-react';
  import React from 'react';
import BlankCard from '../../components/shared/BlankCard';
import UploadPhotoModal from './UploadPhotoModal';
  
  const AlbumBanner = ({shortDescription, thumbnail, name, totalCount, id}) => {
    const ProfileImage = styled(Box)(() => ({
      backgroundImage: 'linear-gradient(#50b2fc,#f44c66)',
      borderRadius: '50%',
      width: '110px',
      height: '110px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }));
  
    return (
      <>
        <BlankCard>
          <CardMedia component="img" image={thumbnail} alt={name} width="100%" height="330px" />
          <Grid container spacing={0} justifyContent="center" alignItems="center">
            {/* Post | Followers | Following */}
            <Grid
              item
              lg={4}
              sm={12}
              md={5}
              xs={12}
              sx={{
                order: {
                  xs: '2',
                  sm: '2',
                  lg: '1',
                },
              }}
            >
              <Stack direction="row" textAlign="center" justifyContent="center" gap={6} m={3}>
                <Box>
                <Typography variant="h4" fontWeight="600">
                  {totalCount || 0}
                </Typography>
                <Typography color="textSecondary" variant="h6" fontWeight={400}>
                  Photos
                </Typography>
                </Box>
               
                
              </Stack>
            </Grid>
            {/* about profile */}
            <Grid
              item
              lg={4}
              sm={12}
              xs={12}
              sx={{
                order: {
                  xs: '1',
                  sm: '1',
                  lg: '2',
                },
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                textAlign="center"
                justifyContent="center"
                
              >
                <Box>
                  
                  <Box mt={1}>
                    <Typography fontWeight={600} variant="h5">
                      {name}
                    </Typography>
                    <Typography color="textSecondary" variant="h6" fontWeight={400}>
                      {shortDescription}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
            {/* friends following buttons */}
            <Grid
              item
              lg={4}
              sm={12}
              xs={12}
              sx={{
                order: {
                  xs: '3',
                  sm: '3',
                  lg: '3',
                },
              }}
            >
              <Stack direction={'row'} gap={2} alignItems="center" justifyContent="end" my={2}>
                <UploadPhotoModal id={id} />
                
              </Stack>
            </Grid>
          </Grid>
        
        </BlankCard>
      </>
    );
  };
  
  export default AlbumBanner;
  