import React from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Avatar, Divider, Icon, ListItem } from 'react-native-elements';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setAction } from '../navigation/NavigationSlice'
import { ACTIONS, COLORS, TOAST } from '../../constants';
import { getProfile } from '../profile/ProfileSlice';
import { showLoading } from '../../helpers';
import ProfileServiceApi from '../../services/ProfileServiceApi';

const Settings = () => {

  const dispatch = useDispatch();
  const profile = useSelector(getProfile);
  const navigation = useNavigation();
  const list = [
    {
      title: 'My Savings Plan',
      icon: {name: 'bullseye', type: 'font-awesome'},
      handleOnPress: ()=> {
        console.log('My Savings Plan');
      }
    },
    {
      title: 'My Profile',
      icon: {name: 'user', type: 'font-awesome'},
      handleOnPress: ()=> {
        console.log('My Profile');
      }
    },
    {
      title: 'Change My Password',
      icon: {name: 'lock-outline', type: 'material-community'},
      handleOnPress: ()=> {
        dispatch(setAction(ACTIONS.CHANGE_PASSWORD));
        navigation.navigate('Password');
      }
    },
    {
      title: 'Categories',
      icon: {name: 'list', type: 'font-awesome'},
      handleOnPress: ()=> {
        console.log('Categories');
      }
    },
    {
      title: 'Notifications',
      icon: {name: 'bell-o', type: 'font-awesome'},
      handleOnPress: ()=> {
        console.log('Notifications');
      }
    },
    {
      title: 'About',
      icon: {name: 'info', type: 'font-awesome'},
      handleOnPress: ()=> {
        console.log('About');
      }
    },
    {
      title: 'Sign Out',
      icon: {name: 'sign-out', type: 'font-awesome'},
      handleOnPress: ()=> {
        Alert.alert(
          'Sign out',
          'Are you sure you want to log out from your account?',
          [
            {
              text: "No",
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: () => {
                  showLoading(true);
                  const profileService = new ProfileServiceApi();
                  profileService.signOut().then(() => {
                  TOAST.ref.alertWithType(
                    'success',
                    'Good Bye!',
                    'You logged out from your account!',
                  );
                }).finally(() => {
                  showLoading(false);
                });
              }
            }
          ]
        );
      },
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Avatar
          rounded title={profile.firstName.charAt(0) + profile.lastName.charAt(0)}
          containerStyle={styles.headerAvatar}
          titleStyle={styles.headerAvatarTitle}
          size='medium'
        />
        <View>
          <Text style={styles.headerTitle}>{profile.firstName + ' ' + profile.lastName}</Text>
          <Text style={styles.headerSubtitle}>{profile.email}</Text>
        </View>
      </View>
      <Divider />
      <View style={styles.list}>
        {list.map((item, i) => (
          <ListItem
            key={i}
            bottomDivider
            style={styles.item}
            underlayColor={COLORS.primary}
            onPress={item.handleOnPress}
          >
            <Icon {...item.icon} color={COLORS.black} style={styles.itemIcon}/>
            <ListItem.Content>
              <ListItem.Title style={styles.itemTitle}>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary,
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  headerAvatar: {
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  headerAvatarTitle: {
    color: COLORS.secondary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  list: {
    paddingTop: 30,
  },
  item: {
    marginHorizontal: 30,
  },
  itemIcon: {
    width: 22,
  },
  itemTitle: {
    fontWeight: 'bold',
    color: COLORS.black,
  }
});

export default Settings


