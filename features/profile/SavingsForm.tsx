import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button, Card, Icon, Overlay } from 'react-native-elements';
import DropDown from '../../components/drop-down/DropDown';
import { COLORS } from '../../constants';
import { ProfileModel } from '../../models/ProfileModel';
import CurrencyField from '../../components/currency-field/CurrencyField';
import { formatCurrency } from '../../helpers';

const SavingsForm = (props: FormikProps<ProfileModel>) => {

  const {
    handleSubmit,
    isValid,
    values,
  } = props;

  const [overlay, setOverlay] = useState(false);
  const [resultMessage, setResultMessage] = useState(null);

  /**
   * Handle form's submission to display the savings' plan summary
   */
  const onNext = () => {

    if (!values.targetMonthlySavings && !values.targetTotalSavings) {
      handleSubmit();
      return;
    }

    // format monthly target
    const monthlyTargetFormat = formatCurrency(values.targetMonthlySavings);

    // format total target
    const totalTarget = (values.targetMonthlySavings > values.targetTotalSavings)
      ? values.targetMonthlySavings
      : values.targetTotalSavings;
    const totalTargetFormat = formatCurrency(totalTarget);

    // calculate the time prediction for the target
    const savingsTotalMonths = Math.ceil(totalTarget / values.targetMonthlySavings);
    const savingsYears = Math.floor(savingsTotalMonths / 12);
    const savingsMonths = savingsTotalMonths % 12;
    let periodText = '';
    if (savingsYears > 0) {
      periodText += savingsYears + ' year';
      periodText += (savingsYears > 1)? 's ' : ' ';
      periodText += (savingsMonths > 0)? 'and ': '';
    }
    if (savingsMonths > 0) {
      periodText += savingsMonths + ' month';
      periodText += (savingsMonths > 1)? 's ' : ' ';
    }

    // determine balance signal
    values.balance = Math.abs(values.balance);
    if (values.balanceSignal === 'owed') {
      values.balance = -values.balance;
    }

    // calculate new balance with target and format it
    let newBalance = values.balance + totalTarget;
    let newBalanceFormat = formatCurrency(newBalance);

    // display the modal message
    setResultMessage((
      <Text style={styles.resultText}>
        In <Text style={{fontWeight: 'bold'}}>{periodText}</Text>
        you'll have been saved
        <Text style={{fontWeight: 'bold'}}> {totalTargetFormat} </Text>
        {(savingsTotalMonths > 1)? (
          <>by saving <Text style={{fontWeight: 'bold'}}>{monthlyTargetFormat}</Text> per month </>
        ) : null}
        and your total balance will be:
        <Text style={{fontWeight: 'bold', textAlign: 'center'}}>{"\n"}{"\n"}{newBalanceFormat}</Text>
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
      <Overlay isVisible={overlay} overlayStyle={styles.overlay}>
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
    textAlign: 'justify',
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