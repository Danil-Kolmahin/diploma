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
  id: '01234567-0123-0123-0123-01234567',
  email: 'unknown@email.com',
  exp: 0,
  iat: 0,
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
          !!(parsedCookie as CookieTokenDataI).email
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
            !!(parsedCookie as CookieTokenDataI).email;
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
              !!(parsedCookie as CookieTokenDataI).email,
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
      }, 15000)
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
