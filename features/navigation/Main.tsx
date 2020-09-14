import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import Reports from '../reports/Reports';
import Transactions from '../transactions/Transactions';
import Banking from '../banking/Banking';
import Settings from '../settings/Settings';
import { Icon } from 'react-native-elements';
import { COLORS } from '../../constants';
import { Text, View } from 'react-native';
import TabAddButton from '../../components/tab-add-button/TabAddButton';

const ReportsStack = createStackNavigator();
const ReportsStackScreen = () => {
  return (
    <ReportsStack.Navigator>
      <ReportsStack.Screen name='Reports' component={Reports} options={{ headerShown: false }}/>
    </ReportsStack.Navigator>
  );
};

const TransactionsStack = createStackNavigator();
const TransactionsStackScreen = () => {
  return (
    <TransactionsStack.Navigator>
      <TransactionsStack.Screen name='Transactions' component={Transactions} options={{ headerShown: false }}/>
    </TransactionsStack.Navigator>
  );
};

const BankingStack = createStackNavigator();
const BankingStackScreen = () => {
  return (
    <BankingStack.Navigator>
      <BankingStack.Screen name='Banking' component={Banking} options={{ headerShown: false }}/>
    </BankingStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();
const SettingsStackScreen = () => {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name='Settings' component={Settings} options={{ headerShown: false }}/>
    </SettingsStack.Navigator>
  );
};

const Tab = createBottomTabNavigator();

const AddTransaction = () => {
  return (
    <View><Text>oi</Text></View>
  )
}

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
        activeTintColor: COLORS.secondary,
        inactiveTintColor: COLORS.primary,
        activeBackgroundColor: COLORS.primary,
        inactiveBackgroundColor: COLORS.secondary,
        style: {height: 55},
        tabStyle: {paddingBottom: 5},
      }}>
      <Tab.Screen name="Reports" component={ReportsStackScreen} />
      <Tab.Screen name="Transactions" component={TransactionsStackScreen} />
      <Tab.Screen
        name="Add"
        component={AddTransaction}
        options={{
          tabBarButton: () => (
            <TabAddButton onPress={() => {
              navigation.navigate('TransactionAdd');
            }} />
          ),
        }}
      />
      <Tab.Screen name="Banking" component={BankingStackScreen} />
      <Tab.Screen name="Settings" component={SettingsStackScreen} />
    </Tab.Navigator>
  )
}

export default Main;