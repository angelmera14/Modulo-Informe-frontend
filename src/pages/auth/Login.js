// import { useEffect, useState } from 'react';
// import axios from "axios";
// import { capitalCase } from 'change-case';
// import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack,  Alert, Container, Typography } from '@mui/material';
// routes
// import { PATH_AUTH } from '../../routes/paths';
// hooks
// import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
// import Logo from '../../components/Logo';
import Logologin from '../../components/Logologin';
import Image from '../../components/Image';
// imagenes del sistema
import publicidadlogin from '../../assets/images/login/publicidad-login.png';
// sections
import { LoginForm } from '../../sections/auth/login';
// import { URLAPIGENERAL } from '../../config';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  // const { method } = useAuth();

  // const smUp = useResponsive('up', 'sm');
  const mdUp = useResponsive('up', 'md');
  
  
  return (
    <Page title="Acceso">
      <RootStyle>
        <HeaderStyle>
          <Logologin />
          {/* {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              No tienes cuenta en ADM Enterprise? {''}
              <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                Comienza Ahora!
              </Link>
            </Typography>
          )} */}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h4" sx={{ px: 5, mt: 15, mb: 5 }}>
              Bienvenido Soporte SofGreen S.A.
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              alt="login"
              src={publicidadlogin}
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  Inicio de Sesion
                </Typography>
                <Typography sx={{ color: 'text.secondary' }}>Ingrese sus datos a continuación.</Typography>
              </Box>

              {/* <Tooltip title={capitalCase(method)} placement="right">
                <>
                  <Image
                    disabledEffect
                    src={`https://minimal-assets-api.vercel.app/assets/icons/auth/ic_${method}.png`}
                    sx={{ width: 32, height: 32 }}
                  />
                </>
              </Tooltip> */}
            </Stack>

            <Alert severity="info" sx={{ mb: 3 }}>
              <strong> SOPORTE SOFTGREEN S.A. </strong> ( SISTEMA SOPORTE ) es propiedad Intelectual de
              <strong> SOFTGREEN S.A. </strong> Cualquier copia parcial o total es penado por las leyes que rigen los derechos Intelectuales
            </Alert>

            <LoginForm />

            {/* {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?{' '}
                <Link variant="subtitle2" component={RouterLink} to={PATH_AUTH.register}>
                  Get started
                </Link>
              </Typography>
            )} */}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
