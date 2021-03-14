import React, { useState } from 'react';
import { showLoading } from '../../helpers';
import BankingServiceApi from '../../services/BankingServiceApi';
import PlaidLink from '../../components/plaid-link/PlaidLink';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import * as WebBrowser from 'expo-web-browser';
import { COLORS } from '../../constants';

const AddBankAccount = () => {

  const [linkToken, setLinkToken] = useState(null);

  const getLinkToken = async () => {
    showLoading(true);
    const bankingServiceApi = new BankingServiceApi();
    const token = await bankingServiceApi.getLinkToken();
    showLoading(false);

    return token;
  }

  const handleLink = async () => {
    const token = await getLinkToken();
    setLinkToken(token);
  }

  const handleConnect = (params) => {
    console.log('handleConnect', params);
  }

  const handleExit = (params) => {
    console.log('handleExit', params);
    setLinkToken(null);
  }

  const openInfoUrl = async () => {
    const url = 'https://plaid.com/legal/#consumers';
    await WebBrowser.openBrowserAsync(url);
  }

  return (
    <>
      {
        linkToken ? (
          <PlaidLink
            linkToken={linkToken}
            onConnect={handleConnect}
            onExit={handleExit} />
        ) : (
          <SafeAreaView>
            <View style={style.container}>
              <Text style={style.info}>
                In order to retrieve your bank account's transactions,
                you need to authenticate yourself and grant the Piggy Bank App
                the authority to access your transactions on behalf you through
                a security environment provided by Plaid Inc.
              </Text>
              <Button
                icon={{
                  name: "university",
                  size: 15,
                  color: COLORS.secondary,
                  type: 'font-awesome-5',
                }}
                title="Access your Account"
                onPress={handleLink}
                containerStyle={style.linkButton}
              />
              <Button
                title="Get more information about Plaid Inc"
                onPress={openInfoUrl}
                type="clear"
              />
            </View>
          </SafeAreaView>
        )
      }
    </>
  );
}

const style = StyleSheet.create({
  container: {
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: 10,
  },
  info: {
    fontSize: 20,
    color: COLORS.gray,
  },
  linkButton: {
    width: '70%',
  },
  infoButton: {
    textDecorationLine: 'underline',
  },
});

export default AddBankAccount;