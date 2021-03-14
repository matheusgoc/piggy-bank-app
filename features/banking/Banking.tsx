import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Icon, Button, Divider } from 'react-native-elements';
import { COLORS } from '../../constants';
import BankingServiceApi from '../../services/BankingServiceApi';
import { showLoading } from '../../helpers';
import { useNavigation } from '@react-navigation/native';

const Banking = () => {

  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <Icon name='university' type='font-awesome' color={COLORS.primary} />
          <Text style={styles.headerTitleText}>Bank Accounts</Text>
        </View>
        <Button
          onPress={() => navigation.navigate('AddBankAccount')}
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
      <View style={styles.empty}>
        <Icon
          name='exclamation-triangle'
          type='font-awesome'
          size={50}
          color={COLORS.gray}
        />
        <Text style={styles.emptyText}>
          No banking accounts added
        </Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
    paddingTop: 10
  }
});

export default Banking