import React, { useState } from 'react';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { FormikProps } from 'formik';
import { Button } from 'react-native-elements';
import InputDateTimePicker from '../../components/input-date-time-picker/InputDateTimePicker';
import DropDown from '../../components/drop-down/DropDown';
import { COLORS } from '../../constants';
import InputField from '../../components/input-field/InputField';
import CurrencyField from '../../components/currency-field/CurrencyField';
import { TransactionModel } from '../../models/TransactionModel';
import DropDownOverlay from '../../components/drop-down-overlay/DropDownOverlay';
import TakePicture from '../../components/take-picture/TakePicture';
import CategoriesServiceApi from '../../services/CategoriesServiceApi';

const TransactionForm = (props: FormikProps<TransactionModel>) => {

  const {
    handleSubmit,
    isValid,
    values,
  } = props;

  const categoryApi = new CategoriesServiceApi();
  const categoriesList = categoryApi.get();

  const [categories, setCategories] = useState(categoriesList);
  const [searchingCategory, setSearchingCategory] = useState(false);

  const searchCategories = (name: string) => {
    setSearchingCategory(true);
    let currentCategories = (name === '')? [...categoriesList] : [...categories];
    if (name === '') {
      currentCategories = [];
    }
    if (currentCategories.length === 0) {
      currentCategories.push({id: null, name: name});
    } else if (currentCategories[0].id === null) {
      const index = currentCategories.findIndex(category => category.name === name);
      if (index < 0) {
        currentCategories[0].name = name;
      }
    }
    setSearchingCategory(false);
    setCategories(currentCategories);
  }

  return (
    <SafeAreaView style={styles.style} edges={['right', 'bottom', 'left']}>
      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}>
        <View style={styles.container}>
          <View style={styles.row}>
            <TakePicture
              title='Receipt Picture'
              width='50%'
              onTake={() => {
                values.isNewReceipt = true;
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
              <DropDownOverlay
                name='category'
                formik={props}
                label='* Category'
                items={categories}
                key='id'
                searchKey='name'
                placeholder='Search...'
                width='100%'
                onSearch={searchCategories}
                loading={searchingCategory}
              />
              <CurrencyField
                name='amount'
                formik={props}
                label='* Total'
              />
              <InputField
                name='place'
                formik={props}
                label='Place'
                placeholder='Where it was ordered?'
                autoCapitalize='words'
                textContentType='location'
                keyboardType='ascii-capable'
              />
            </View>
          </View>
          <View style={styles.row}>
            <InputDateTimePicker
              name='orderDate'
              mode='date'
              label='Date'
              width='50%'
              formik={props}
              value={new Date()}
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
              autoCapitalize='words'
              textContentType='none'
              keyboardType='ascii-capable'
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
          disabled={!isValid}
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