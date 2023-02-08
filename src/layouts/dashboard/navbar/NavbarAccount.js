import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// hooks
// import useAuth from '../../../hooks/useAuth';
// routes
// import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import MyAvatar from '../../../components/MyAvatar';
// contexto
// import useLogin from '../../../hooks/useLogin';
// import { usuario } from '../../../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}));

// ----------------------------------------------------------------------

NavbarAccount.propTypes = {
  isCollapse: PropTypes.bool,
};

export default function NavbarAccount({ isCollapse }) {
  // const { usuario, nombreusuario } = useLogin();
  // eslint-disable-next-line camelcase
  
  const usuario = JSON.parse(window.localStorage.getItem('usuariosoporte'));
  return (
    <Link underline="none" color="inherit" component={RouterLink} to="/">
      <RootStyle
        sx={{
          ...(isCollapse && {
            bgcolor: 'transparent',
          }),
        }}
      >
        <MyAvatar />

        <Box
          sx={{
            ml: 2,
            transition: (theme) =>
              theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            ...(isCollapse && {
              ml: 0,
              width: 0,
            }),
          }}
        >
          <Typography variant="subtitle2" noWrap={isCollapse}>
            { usuario?.displayName || 'USUARIO'  }
          </Typography>
          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {/* {user?.role} */}
            {usuario?.email || 'USER'}
          </Typography>
        </Box>
      </RootStyle>
    </Link>
  );
}
