import React from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from 'react-redux'
import { Button, Divider, Icon } from 'react-native-elements'
import { COLORS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { getInstitutions } from './BankingSlice'
import { InstitutionModel } from '../../models/InstitutionModel'
import BankingService from '../../services/BankingService'
import BankingEmptyState from '../../components/banking/BankingEmptyState'
import BankingListLabel from '../../components/banking/BankingListLabel'

const Banking = () => {

  const navigation = useNavigation()
  const institutions: InstitutionModel[] = useSelector(getInstitutions)

  const selectInstitution = ((index) => {
    const bankingService = new BankingService()
    bankingService.setIndex(index)
    navigation.navigate('AccountsList')
  })

  const renderItem = (institution: InstitutionModel, index) => (
    <TouchableOpacity
      style={styles.institution}
      onPress={() => { selectInstitution(index) }}>
      <View>
        <Icon name="university" type='font-awesome-5' color={COLORS.gray} size={50} />
        <Text style={styles.institutionTitle}>{institution.name}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Icon name='university' type='font-awesome' color={COLORS.primary} />
          <Text style={styles.headerTitleText}>Banking</Text>
        </View>
        <Button
          onPress={() => navigation.navigate('AddInstitution')}
          icon={{
            name: "plus-circle",
            color: COLORS.primary,
            type: 'font-awesome',
            size: 25,
          }}
          type='clear'
          title='Add'
        />
      </View>
      <Divider />
      {(institutions.length === 0)? (<BankingEmptyState message="No institutions!" />) : (
        <>
          <BankingListLabel label="Select the institution you want to import the transaction:" />
          <FlatList
            data={institutions}
            renderItem={({item, index}) => renderItem(item, index)}
            keyExtractor={item => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: COLORS.secondary,
  },
  header : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  headerTitle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 10,
  },
  headerTitleText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft: 10,
  },
  listContainer: {
    margin: 20,
  },
  institution: {
    alignItems: 'center',
    width: '50%',
    height: 150,
  },
  institutionTitle: {
    width: 150,
    textAlign: 'center',
    paddingTop: 10,
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.black,
  }
})

export default Banking