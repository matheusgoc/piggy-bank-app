import React, { useEffect } from 'react';
import WebView from 'react-native-webview';
import URLSearchParams from '@ungap/url-search-params';
import { PLAID_VIEW_URL } from '../../constants';

interface PlaidLinkProps {
  linkToken: string,
  onConnect(params): void,
  onExit(params): void,
  onError?(params): void,
  onEvent?(params): void,
}

const PlaidLink = (props: PlaidLinkProps) => {

  const uri = PLAID_VIEW_URL + props.linkToken;
  const handleStateChange = (event: any) => {

    const url: string = event.url;
    const queryString: string = url.split(/\?(.+)?/,2)[1] || '';
    const searchParams = new URLSearchParams(queryString);
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    if (url.startsWith('plaidlink://')) {

      if (url.startsWith('plaidlink://connected') && props.onConnect) {

        props.onConnect({
          'public_token' : searchParams.get('public_token'),
          'institution_name' : searchParams.get('institution_name'),
          'institution_id' : searchParams.get('institution_id'),
          'accounts' : searchParams.get('accounts'),
          'link_session_id' : searchParams.get('link_session_id'),
          ...params
        });

      } else if (url.startsWith('plaidlink://event') && props.onEvent) {

        props.onEvent(params);

      } else if (url.startsWith('plaidlink://error') && props.onError) {

        props.onError(params);

      } else if (url.startsWith('plaidlink://exit') && props.onExit) {

        props.onExit(params);
      }

      return false
    }

    return true
  }

  return (
    <WebView
      source={{ uri }}
      onShouldStartLoadWithRequest={handleStateChange}
      originWhitelist={['https://*', 'plaidlink://*']}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error: ', nativeEvent);
      }}
      onLoad={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.log('WebView load: ', nativeEvent);
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn(
          'WebView error status code: ',
          nativeEvent.statusCode,
        );
      }}
    />
  );
}

export default PlaidLink;