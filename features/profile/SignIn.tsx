import React, { useContext } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Button, Input, ThemeContext } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const SignIn = (props) => {

  const { theme } = useContext(ThemeContext);

  StatusBar.setBarStyle('dark-content');

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: '#ffffff' }}
      contentContainerStyle={styles.container}
      resetScrollToCoords={{ x: 0, y: 0 }}
      scrollEnabled={true}>
      <Image source={require('../../images/logo/logomark.png')}
             style={styles.logo} />
      <View style={styles.inputGroup}>
        <Input
          label='Email'
          placeholder='Enter your email'
          leftIcon={{ name: 'email-outline', type: 'material-community', color: theme.colors.primary }}
        />
        <Input
          label='Password'
          placeholder='Enter your password'
          leftIcon={{ name: 'lock-outline', type: 'material-community', color: theme.colors.primary }}
          errorStyle={{display: 'none'}}
        />
        <TouchableOpacity>
          <Text style={styles.linkForgotten}>Forgotten password?</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Button style={styles.btSignIn} title="Sign In" />
        <View style={styles.signUp}>
          <Text>Don't you have a profile?</Text>
          <TouchableOpacity onPress={() => { props.navigation.navigate('Terms'); }}>
            <Text style={styles.linkSignUp}>Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  logo: {
    alignSelf: 'center',
    width: 200,
    height: 210,
    marginTop: '25%',
  },
  inputGroup: {
    width:'90%',
    alignSelf: 'center',
  },
  btSignIn: {
    width: '85%',
    alignSelf: 'center',
  },
  linkForgotten: {
    color: 'blue',
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  signUp: {
    display: "flex",
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkSignUp: {
    color: 'blue',
    paddingLeft: 5,
    padding:20,
    fontWeight: 'bold',
  },
});

export default SignIn;