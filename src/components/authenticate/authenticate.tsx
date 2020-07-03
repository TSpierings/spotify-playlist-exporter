import { useLocation, Redirect } from "react-router-dom";
import { isNullOrUndefined } from "util";
import React from 'react';

export function Authenticate({ children, ...rest }: any) {
  let query = new URLSearchParams(useLocation().hash);;

  const accessToken = query.get('#access_token')!;

  // User denied access
  if(isNullOrUndefined(accessToken)) {
    return <Redirect to="/"/>
  }

  const validUntil = Date.now() + parseInt(query.get('expires_in')!) * 1000;

  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('valid_until', validUntil.toString());

  return <Redirect to="/exporter"/>;
}
