import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { Navigate } from 'react-router-dom';
import { isObject, parseCookies } from '@diploma-v2/common/utils-common';
import { CookieTokenDataI, ROUTES } from '@diploma-v2/common/constants-common';

const parseJwt = (token: string) => {
  const [, base64Payload] = token.split('.');
  const payload = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payload.toString());
};

const EMPTY_COOKIES: CookieTokenDataI = {
  email: 'unknown@email.com',
  id: '01234567-0123-0123-0123-01234567',
  iat: 0,
  exp: 0,
};

export const withAuth = (WrappedComponent: React.ComponentType, shouldAuth = true) => {
  return (props: unknown) => {
    const [cookie, setCookie] = useState<CookieTokenDataI>(() => {
      let parsedCookie;
      try {
        const cookieCandidate = parseCookies(
          document.cookie,
        )[process.env['NX_AUTH_COOKIE_NAME'] as string];
        parsedCookie = parseJwt(cookieCandidate);
        if (
          parsedCookie &&
          isObject(parsedCookie) &&
          !!(parsedCookie as CookieTokenDataI).id &&
          !!(parsedCookie as CookieTokenDataI).email &&
          (parsedCookie as CookieTokenDataI).exp * 1000 > Date.now()
        ) {
          return parsedCookie;
        } else {
          return EMPTY_COOKIES;
        }
      } catch {
        return EMPTY_COOKIES;
      }
    });

    const [isAuthorised, setIsAuthorised] = useState(() => {
      let parsedCookie;
      try {
        const cookieCandidate = parseCookies(
          document.cookie,
        )[process.env['NX_AUTH_COOKIE_NAME'] as string];
        parsedCookie = parseJwt(cookieCandidate);
        if (parsedCookie) {
          return isObject(parsedCookie) &&
            !!(parsedCookie as CookieTokenDataI).id &&
            !!(parsedCookie as CookieTokenDataI).email &&
            (parsedCookie as CookieTokenDataI).exp * 1000 > Date.now();
        } else {
          return false;
        }
      } catch {
        return false;
      }
    });

    useEffect(() => {
      const intervalId = setInterval(() => {
        let parsedCookie;
        try {
          const cookieCandidate = parseCookies(
            document.cookie,
          )[process.env['NX_AUTH_COOKIE_NAME'] as string];
          parsedCookie = parseJwt(cookieCandidate);
          if (parsedCookie) {
            setIsAuthorised(
              isObject(parsedCookie) &&
              !!(parsedCookie as CookieTokenDataI).id &&
              !!(parsedCookie as CookieTokenDataI).email &&
              (parsedCookie as CookieTokenDataI).exp * 1000 > Date.now(),
            );
            setCookie(parsedCookie);
          } else {
            setCookie(EMPTY_COOKIES);
            setIsAuthorised(false);
          }
        } catch {
          setCookie(EMPTY_COOKIES);
          setIsAuthorised(false);
        }
      }, 15000);
      return () => clearInterval(intervalId);
    }, []);

    if (shouldAuth ? isAuthorised : !isAuthorised) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return <WrappedComponent {...props} parsedCookie={cookie} />;
    }
    return <Navigate to={ROUTES.LOGIN} />;
  };
};
