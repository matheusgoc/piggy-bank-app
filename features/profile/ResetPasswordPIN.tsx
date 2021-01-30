import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell, } from 'react-native-confirmation-code-field';
import { Button, Icon } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ACTIONS, COLORS } from '../../constants';
import ProfileServiceApi from '../../services/ProfileServiceApi';
import { showLoading } from '../../helpers';
import * as Progress from 'react-native-progress';

const CELL_COUNT = 6;
const PIN_TIME = 5 * 60;
const ResetPasswordPIN = ({navigation, route}) => {

  let keyboard = useRef(null);
  const windowWidth = useWindowDimensions().width;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [timer, setTimer] = useState(PIN_TIME);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const serviceApi = new ProfileServiceApi();

  const generatePIN = () => {
    const profileServiceApi = new ProfileServiceApi();
    showLoading(true);
    profileServiceApi.requestPIN(route.params.email).then(() => {

      setValue('');
      setTimer(PIN_TIME);

    }).catch((error) => {
      console.warn('ResetPasswordEmail.handleSubmit: ' + error);
    }).finally(() => {
      showLoading(false);
    });
  }

  const handleSubmit = () => {
    showLoading(true);
    const email = route.params.email;
    serviceApi.confirmPIN(Number(value), route.params.email).then(() => {

      setTimer(PIN_TIME);
      navigation.navigate('Password',{
        action: ACTIONS.RESET_PASSWORD,
        email: email,
        pin: value,
      });

    }).catch(() => {
      setValue('');
    }).finally(() => {
      showLoading(false);
    });
  }

  const getTimeFormatted = () => {

    let minutes: string | number = Math.ceil(timer / 60) - 1;
    minutes = (minutes > 9)? minutes : '0' + minutes;

    let seconds: string | number = timer % 60;
    seconds = (seconds > 9)? seconds : '0' + seconds;

    return minutes + ' : ' + seconds;
  }

  const displayPINField = () => {
    return (
      <View style={{alignItems: 'center'}}>
        <Text style={styles.title}>PIN code</Text>
        <CodeField
          ref={ref}
          {...props}
          value={value}
          onChangeText={setValue}
          cellCount={CELL_COUNT}
          rootStyle={styles.codeFiledRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          onFocus={() => {
              setTimeout(() => {
                keyboard.current.scrollToPosition(0, 500);
              }, 500);
          }}
          renderCell={({index, symbol, isFocused}) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[styles.cellRoot, isFocused && styles.focusCell]}>
              <Text style={styles.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )}
        />
        <Progress.Bar
          color={COLORS.success}
          unfilledColor={COLORS.danger}
          progress={timer / PIN_TIME}
          width={windowWidth - 100}
          height={10}
          style={{marginTop: 20}}
        />
        <Text style={{fontWeight: 'bold'}}>
          {getTimeFormatted()}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.root}>
      <KeyboardAwareScrollView
        ref={keyboard}
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <Text style={styles.legend}>
          We've sent an email with instructions to reset your password.
          Please, enter the PIN code sent to your email to proceed:
        </Text>
        {(timer > 0)? displayPINField() : (
          <View>
            <Icon
              name='exclamation-triangle'
              type='font-awesome'
              size={50}
              color={COLORS.error}
              style={{paddingBottom: 20}}
            />
            <Text style={styles.legendExpired}>The PIN time has been expired</Text>
          </View>
        )}
        {(timer > 0)? (
          <Button
            title='Next'
            disabled={value.length < 6}
            onPressOut={handleSubmit}
          />
        ) : (
          <Button
            title='Generate another PIN code'
            onPressOut={generatePIN}
          />
        )}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
  },
  container: {
    backgroundColor: COLORS.secondary,
    justifyContent: 'space-between',
    padding: 20,
    height: '100%',
  },
  legend: {
    fontSize: 20,
    paddingHorizontal: 10,
  },
  legendExpired: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.error,
  },
  title: {
    textAlign: 'center',
    fontSize: 30
  },
  codeFiledRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 30,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  cellText: {
    color: COLORS.primary,
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 2,
  },
});

export default ResetPasswordPIN;
