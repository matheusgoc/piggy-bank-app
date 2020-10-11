import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button } from 'react-native-elements';
import InputDateTimePicker from '../../components/input-date-time-picker/InputDateTimePicker';
import DropDown from '../../components/drop-down/DropDown';
import { BASE_PATH_RECEIPT, COLORS } from '../../constants';
import InputField from '../../components/input-field/InputField';
import CurrencyField from '../../components/currency-field/CurrencyField';
import { TransactionModel } from '../../models/TransactionModel';
import TakePicture from '../../components/take-picture/TakePicture';
import DropDownCategory from '../../components/drop-down/DropDownCategory';

const TransactionForm = (props: FormikProps<TransactionModel>) => {

  const {
    handleSubmit,
    values,
  } = props;

  //set receipt image
  let receipt = null;
  if (values.receipt) {
    receipt = (values.isNewReceipt)? values.receipt : BASE_PATH_RECEIPT + values.receipt;
  }

  return (
    <SafeAreaView style={styles.style} edges={['right', 'bottom', 'left']}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
        keyboardShouldPersistTaps='handled'>
        <View style={styles.container}>
          <View style={styles.row}>
            <TakePicture
              name='receipt'
              formik={props}
              image={receipt}
              title='Receipt Picture'
              width='50%'
              onTake={() => {
                values.isNewReceipt = true;
                values.isReceiptRemoved = false;
              }}
              onRemove={() => {
                values.isNewReceipt = false;
                values.isReceiptRemoved = true;
              }}
            />
            <View style={{width: '50%'}}>
              <DropDown
                name='type'
                formik={props}
                label='* Type'
                items={[
                  {label: 'Expense', value: 'E'},
                  {label: 'Income', value: 'I'},
                ]}
                style={{zIndex: 10}}
              />
              <DropDownCategory formik={props} />
              <CurrencyField
                name='amount'
                formik={props}
                label='* Total'
              />
              <InputField
                name='place'
                formik={props}
                label='Place'
                placeholder='Where?'
                autoCapitalize='words'
              />
            </View>
          </View>
          <View style={styles.row}>
            <InputDateTimePicker
              name='orderDate'
              mode='date'
              label='*Date'
              width='50%'
              formik={props}
            />
            <InputDateTimePicker
              name='orderTime'
              mode='time'
              label='Time'
              width='50%'
              formik={props}
            />
          </View>
          <View>
            <InputField
              name='description'
              formik={props}
              label='Description'
              autoCapitalize='sentences'
              multiline={true}
              numberOfLines={4}
              style={{height: 100}}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.save}>
        <Text style={styles.required}>
          * required
        </Text>
        <Button
          title='Save'
          onPressOut={() => {
            handleSubmit();
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  style: {
    backgroundColor: 'white',
    height: '100%',
  },
  container: {
    paddingTop: 5,
    display: 'flex',
    justifyContent: 'space-between',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  save: {
    bottom: 0,
    width: '100%',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  required: {
    color: COLORS.error,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingBottom: 10,
    paddingRight: 10,
  }
});

export default TransactionForm;