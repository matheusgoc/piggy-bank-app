import React, { useState } from 'react'
import { showLoading } from '../../helpers'
import BankingServiceApi from '../../services/BankingServiceApi'
import PlaidLink from '../../components/plaid-link/PlaidLink'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'
import * as WebBrowser from 'expo-web-browser'
import { COLORS, TOAST } from '../../constants'
import { useNavigation } from '@react-navigation/native'

const AddInstitution = () => {

  const navigation = useNavigation()

  const [linkToken, setLinkToken] = useState(null)

  const getLinkToken = async () => {
    showLoading(true)
    const bankingServiceApi = new BankingServiceApi()
    const token = await bankingServiceApi.getLinkToken()
    showLoading(false)

    return token
  }

  const handleLink = async () => {
    const token = await getLinkToken()
    setLinkToken(token)
  }

  const handleConnect = (params, attempts = 0) => {

    console.log('handleConnect', params)

    const bankingServiceApi = new BankingServiceApi()

    showLoading(true)
    bankingServiceApi.exchangePublicToken(params.public_token).then((institution) => {

      TOAST.ref.alertWithType(
        'success',
        'New Institution Add',
        `The ${institution.name} institution was add!`,
      )

      navigation.goBack()

    }).catch((error) => {

      // try to save up to 3 times when get an error
      if (attempts < 3) {
        handleConnect(params, ++attempts)
        return
      }

      TOAST.ref.alertWithType(
        'error',
        'Server Error',
        "Unable to add an institution!",
      )
      console.warn('Transaction.handleConnect: ' + error.message)

    }).finally(() => {
      showLoading(false)
    })
  }

  const handleExit = (params) => {
    console.log('handleExit', params)
    setLinkToken(null)
  }

  const openInfoUrl = async () => {
    const url = 'https://plaid.com/legal/#consumers'
    await WebBrowser.openBrowserAsync(url)
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
  )
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
})

export default AddInstitution