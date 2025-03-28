import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import '../styles/remixicon.css'
import 'react-tabs/style/react-tabs.css';
import "swiper/css";
import "swiper/css/bundle";

// Styles
import '../styles/chat.css'
import '../styles/globals.css'
import '../styles/rtl.css'
import '../styles/dark.css'
import '../styles/leftSidebarDark.css'
import theme from '../styles/theme'

import { ThemeProvider, CssBaseline } from "@mui/material";
import Layout from "@/components/_App/Layout";

function AuthWrapper({ children }) {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isLoginPage = router.pathname === '/authentication/sign-in' || router.pathname === '/authentication/logout';

    if (!token && !isLoginPage) {
      router.push('/authentication/sign-in/');
    }
     
    setCheckingAuth(false);
  }, [router]);

  if (checkingAuth) return null;

  return <>{children}</>;
}

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <AuthWrapper>
          <Component {...pageProps} />
        </AuthWrapper>
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
