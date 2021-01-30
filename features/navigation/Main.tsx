import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import Reports from '../reports/Reports';
import TransactionsList from '../transactions/TransactionsList';
import Banking from '../banking/Banking';
import Settings from '../settings/Settings';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../constants';
import TabAddButton from '../../components/tab-add-button/TabAddButton';
import Transaction from '../transactions/Transaction';

const Tab = createBottomTabNavigator();

const Main = () => {

  const navigation = useNavigation();

  return (
    <Tab.Navigator
      initialRouteName='Transactions'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size}) => {
          const type = 'font-awesome-5';
          let icon;
          switch (route.name) {
            case 'Reports': icon = 'chart-line'; break;
            case 'Transactions': icon = 'exchange-alt'; break;
            case 'Banking': icon = 'university'; break;
            case 'Settings': icon = 'cog'; break;
            default: icon = 'question';
          }
          return <Icon name={icon} color={color} size={size} type={type} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: COLORS.primary,
        inactiveTintColor: COLORS.gray,
        style: { minHeight: 50},
        tabStyle: { paddingBottom: 2},
      }}>
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="Transactions" component={TransactionsList} />
      <Tab.Screen
        name="Add"
        component={Transaction}
        options={{
          tabBarButton: () => (
            <TabAddButton onPress={() => { navigation.navigate('Transaction'); }} />
          ),
        }}
      />
      <Tab.Screen name="Banking" component={Banking} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  )
}

export default Main;