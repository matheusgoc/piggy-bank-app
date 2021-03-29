import React, { useEffect } from 'react'
import Onboarding from 'react-native-onboarding-swiper'
import { Image, Platform, StatusBar, Text, View } from 'react-native'
import { Button, Icon } from 'react-native-elements'
import { useDispatch } from 'react-redux'
import { setOnboard } from './ProfileSlice'

export default function Onboard(props) {

  const dispatch = useDispatch()

  useEffect(() => {
    if (Platform.OS == 'android') {
      StatusBar.setBackgroundColor('transparent')
      StatusBar.setTranslucent(true)
    }
    StatusBar.setBarStyle('light-content')
    return () => {
      StatusBar.setTranslucent(false)
      StatusBar.setBarStyle('dark-content')
    }
  }, [])

  const startView = (
    <View style={{ marginTop: 20 }}>
      <Button
        title={'Get Started'}
        buttonStyle={{
          backgroundColor: 'white',
          paddingLeft: 30,
          paddingRight: 30,
          paddingTop: 15,
          paddingBottom: 15,
          borderRadius: 30,
        }}
        titleStyle={{ color: '#006600', fontWeight: 'bold', }}
        onPress={() => {
          StatusBar.setTranslucent(false)
          StatusBar.setBarStyle('dark-content')
          props.navigation.navigate('Terms')
        }}
      />
      <Text style={{ color: '#ffffff', marginTop: 20, }}>
        Do you have an account?
      </Text>
      <Button
        title='Sign In'
        type='clear'
        titleStyle={{
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: 16,
          textDecorationLine: 'underline',
        }}
        onPress={() => {
          dispatch(setOnboard(false))
          StatusBar.setTranslucent(false)
          StatusBar.setBarStyle('dark-content')
          props.navigation.navigate('SignIn')
        }}
      />
    </View>
  )

  return (
    <Onboarding
      showDone={ false }
      skipToPage={ 3 }
      controlStatusBar={false}
      pages={[
        {
          title: 'Welcome!',
          subtitle: 'Track your expenses and save money!',
          backgroundColor: '#339966',
          image: <Image source={require('../../images/logo/logomark-white.png')}
                        style={{width: 200, height: 210}} />,
        },
        {
          title: 'Manage your transactions',
          subtitle: 'Take the control over your balance!',
          backgroundColor: '#006633',
          image: (
              <Icon name='exchange-alt' type='font-awesome-5' size={100} color='white' />
          ),
        },
        {
          title: 'View Reports',
          subtitle: 'Analyse your savings and outgoings!',
          backgroundColor: '#669999',
          image: (
              <Icon name='chart-line' type='font-awesome-5' size={100} color='white' />
          ),
        },
        {
          title: 'Ready to save money?',
          subtitle: startView,
          backgroundColor: '#339933',
          image: (
            <Icon name='coins' type='font-awesome-5' size={100} color='white' />
          ),
        },
      ]}
    />
  )
}