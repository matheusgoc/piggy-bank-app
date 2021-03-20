import React from 'react'
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSelector } from 'react-redux'
import { Button, Divider, Icon } from 'react-native-elements'
import { COLORS } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { getInstitutions } from './BankingSlice'
import { InstitutionModel } from '../../models/InstitutionModel'

const Banking = () => {

  const navigation = useNavigation()
  const institutions: InstitutionModel[] = useSelector(getInstitutions)
  const renderItem = (institution: InstitutionModel, index) => (
    <TouchableOpacity
      style={styles.institution}
      onPress={() => navigation.navigate('AccountsList', {index})}>
      <View>
        <Icon name="university" type='font-awesome-5' color={COLORS.gray} size={50} />
        <Text style={styles.institutionTitle}>{institution.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Icon name='university' type='font-awesome' color={COLORS.primary} />
          <Text style={styles.headerTitleText}>Institutions</Text>
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
      {(institutions.length === 0)? (
        <View style={styles.empty}>
          <Icon
            name='exclamation-triangle'
            type='font-awesome'
            size={50}
            color={COLORS.gray}
          />
          <Text style={styles.emptyText}>
            No institutions added!
          </Text>
        </View>
      ) : (
        <FlatList
          data={institutions}
          renderItem={({item, index}) => renderItem(item, index)}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
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
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingBottom: 100,
  },
  emptyText: {
    color: COLORS.gray,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 10,
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