import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { Button, Divider, Icon } from 'react-native-elements'
import { COLORS, TOAST } from '../../constants'
import { showLoading } from '../../helpers'
import BankingServiceApi from '../../services/BankingServiceApi'
import { InstitutionModel } from '../../models/InstitutionModel'
import { getInstitutionIndex, getInstitutions } from '../../features/banking/BankingSlice';
import { StackNavigationProp } from '@react-navigation/stack';

const BankingHeader = (props: {height?:string|number}) => {

  const navigation: StackNavigationProp<any> = useNavigation()
  const institutionIndex = useSelector(getInstitutionIndex)
  const institution: InstitutionModel = useSelector(getInstitutions)[institutionIndex]

  const styles = StyleSheet.create({
    ...baseStyles,
    container: {
      ...baseStyles.container,
      height: props.height ?? '10%',
    },
  });

  const deleteInstitution = () => {

    showLoading(true)
    const bankingServiceApi = new BankingServiceApi()
    bankingServiceApi.delete(institution, institutionIndex).then(() => {
      TOAST.ref.alertWithType(
        'success',
        'Remove Institution',
        `The ${institution.name} institution was removed!`,
      );
      navigation.popToTop()
    }).catch(error => {
      TOAST.ref.alertWithType(
        'error',
        'Server Error',
        "Unable to remove an institution!",
      );
      console.warn('AccountsList.deleteInstitution: ' + error.message)
    }).finally(() => {
      showLoading(false)
    });
  }

  const handleInstitutionDelete = () => {

    Alert.alert(
      'Remove Institution',
      'Are you sure you want to remove this institution?',
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: deleteInstitution,
        }
      ]
    )
  }

  return (
    <>
      <View style={styles.container}>
        <Button
          onPress={() => {navigation.goBack()}}
          icon={{name: 'arrow-back-ios', type: 'material', color: COLORS.primary, size: 30}}
          type='clear'
        />
        <View style={styles.header}>
          <Icon name='university' type='font-awesome-5' color={COLORS.gray} size={30} />
          <Text style={styles.headerTitle}>{institution?.name}</Text>
        </View>
        <Button
          onPress={handleInstitutionDelete}
          icon={{name: 'delete-forever', type: 'material', color: COLORS.error, size: 30}}
          type='clear'
        />
      </View>
      <Divider />
    </>
  )
}

const baseStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    maxWidth: 200,
    paddingLeft: 10,
    fontSize: 25,
  },
})

export default BankingHeader