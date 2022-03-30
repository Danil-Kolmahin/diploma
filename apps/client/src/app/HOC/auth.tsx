import React from 'react';
import { Buffer } from 'buffer';
import { Navigate } from 'react-router-dom';

const getCookies = () => {
  const keysValues = document.cookie.split('; ');
  const result: { [key: string]: string } = {};
  for (const keyValue of keysValues) {
    const [key, value] = keyValue.split('=');
    result[key] = value;
  }
  return result;
};

const parseJwt = (token: string) => {
  const [, base64Payload] = token.split('.');
  const payload = Buffer.from(base64Payload, 'base64');
  return JSON.parse(payload.toString());
};

const isObject = (candidate: unknown) => {
  return typeof candidate === 'object' &&
    !Array.isArray(candidate) &&
    candidate !== null;
};

export const withAuth = (WrappedComponent: React.ComponentType, shouldAuth = true) => {
  let cookie = '';
  try {
    const cookieCandidate = getCookies()[process.env['NX_AUTH_COOKIE_NAME'] as string];
    const parsedCookie = parseJwt(cookieCandidate);
    if (parsedCookie) cookie = parsedCookie;
  } catch (e) {
    /* none */
  }
  const isAuthorised = isObject(cookie) &&
    (cookie as any).id &&
    (cookie as any).email;

  return (props: unknown) => {
    if (shouldAuth ? isAuthorised : !isAuthorised) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return <WrappedComponent {...props} parsedCookie={cookie} />;
    }
    return <Navigate to={'/login'} />;
  };
};
