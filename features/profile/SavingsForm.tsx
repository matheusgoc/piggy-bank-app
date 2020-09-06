import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button, Card, Icon, Overlay } from 'react-native-elements';
import DropDown from '../../components/drop-down/DropDown';
import { COLORS, MASKS } from '../../constants';
import { ProfileModal } from '../../modals/ProfileModal';
import CurrencyField from '../../components/currency-field/CurrencyField';

const SavingsForm = (props: FormikProps<ProfileModal>) => {

  const {
    handleSubmit,
    isValid,
    values,
  } = props;

  const [overlay, setOverlay] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  const onNext = () => {

    const mask = MASKS.currency;
    const monthlyTarget = mask.resolve(values.targetMonthlySavings.toString());
    const totalTarget = (values.targetMonthlySavings > values.targetTotalSavings)
      ? monthlyTarget
      : mask.resolve(values.targetTotalSavings.toString());
    const savingsMonths = Math.ceil(values.targetTotalSavings / values.targetMonthlySavings);
    const currentBalance = (values.balanceSignal === 'saved')? values.balance : -values.balance;
    let balance:any = currentBalance + values.targetTotalSavings;
    if (balance < 0) {
      balance = '- (' + mask.resolve(balance.toString()) + ')';
    } else {
      balance = mask.resolve(balance.toString());
    }

    setResultMessage((
      <Text style={styles.resultText}>
        In <Text style={{fontWeight: 'bold'}}>{savingsMonths} month{(savingsMonths > 1)? 's ' : ' '}</Text>
        you'll have been saved
        <Text style={{fontWeight: 'bold'}}> {totalTarget} </Text>
        {(savingsMonths > 1)? (
          <>by saving <Text style={{fontWeight: 'bold'}}>{monthlyTarget}</Text> per month </>
        ) : null}
        and your balance will be {'\n'}
        <Text style={{fontWeight: 'bold'}}>{balance}</Text>
      </Text>
    ));

    setOverlay(true);
  }


  return (
    <SafeAreaView style={styles.style}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={true}>
        <View>
          <Text style={styles.label}>How much money have you saved or owed?</Text>
          <View style={styles.balance}>
            <CurrencyField
              name='balance'
              formik={props}
              label='Current Balance'
              width='60%'
            />
            <DropDown
              name='balanceSignal'
              formik={props}
              label=''
              width='40%'
              items={[
                {label: 'Saved', value: 'saved'},
                {label: 'Owed', value: 'owed'},
              ]}
            />
          </View>
          <Card containerStyle={styles.card}>
            <Card.Title style={{textAlign:'left', color: COLORS.primary}}>Targets</Card.Title>
            <Card.Divider />
            <Text style={styles.label}>How much money do you plan to save?</Text>
            <CurrencyField
              name='targetTotalSavings'
              formik={props}
              label='Total Savings'
              width='70%'
            />
            <Text style={styles.label}>How much money do you plan to save by month?</Text>
            <CurrencyField
              name='targetMonthlySavings'
              formik={props}
              label='Monthly Savings'
              width='70%'
            />
          </Card>

        </View>
        {(!overlay)? (
        <View style={styles.save}>
          <Button
            title='Next'
            disabled={!isValid}
            onPress={() => {
              onNext();
            }}
          />
        </View>
        ): null }
      </KeyboardAwareScrollView>
      <Overlay isVisible={overlay} overlayStyle={styles.overlay}
               onBackdropPress={() => {
                 setOverlay(false);
               }}>
        <View>
          <Icon
            name='medal'
            type='font-awesome-5'
            style={styles.resultTextIcon}
            color={COLORS.secondary}
            size={30}
          />
          <Text style={styles.resultTextTitle}>
            Congratulations
          </Text>
          {resultMessage}
          <Button
            title='Next'
            buttonStyle={styles.overlayButton}
            titleStyle={styles.overlayButtonTitle}
            onPress={() => {
              handleSubmit();
              setOverlay(false);
            }}
          />
        </View>
      </Overlay>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'white',
  },
  container: {
    paddingTop: 5,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    padding: 10,
    paddingTop: 0,
    fontStyle: 'italic',
  },
  balance: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    zIndex: 10,
    width: '90%',
  },
  card: {
    marginHorizontal: 10,
    paddingBottom: 0,
    marginTop: 0,
  },
  save: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  overlay: {
    marginHorizontal: 20,
    minHeight: 200,
    justifyContent: 'space-between',
    backgroundColor: COLORS.primary,
    padding: 0,
    borderRadius: 10,
  },
  resultText: {
    padding: 20,
    fontSize: 16,
    letterSpacing: 1,
    color: COLORS.secondary,
    textAlign: 'center',
  },
  resultTextTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.secondary,
  },
  resultTextIcon: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  overlayButton: {
    backgroundColor: COLORS.secondary,
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
  },
  overlayButtonTitle: {
    color: COLORS.primary,
  }
});

export default SavingsForm;