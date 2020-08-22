import React, { Component } from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import {Alert, Image, StatusBar} from "react-native";
import {Button, Icon} from "react-native-elements";
export default class Onboard extends Component {
    render() {
        return (
            <Onboarding
                showDone={ false }
                skipToPage={ 3 }
                pages={[
                    {
                        title: 'Welcome!',
                        subtitle: 'Track your expenses and save money!',
                        backgroundColor: '#339966',
                        image: <Image source={require('../../images/logo/logomark-white.png')}
                                      style={{width: 200, height: 210}} />,
                    },
                    {
                        title: 'Add Transactions',
                        subtitle: 'Take control over your balance!',
                        backgroundColor: '#006633',
                        image: (
                            <Icon name="exchange-alt" type="font-awesome-5" size={100} color="white" />
                        ),
                    },
                    {
                        title: 'View Reports',
                        subtitle: 'Analyse your savings and outgoings!',
                        backgroundColor: '#669999',
                        image: (
                            <Icon name="chart-line" type="font-awesome-5" size={100} color="white" />
                        ),
                    },
                    {
                        title: "Ready to save money?",
                        subtitle: (
                            <Button
                                title={'Get Started'}
                                containerStyle={{ marginTop: 20 }}
                                buttonStyle={{
                                    backgroundColor: 'white',
                                    paddingLeft: 30,
                                    paddingRight: 30,
                                    paddingTop: 15,
                                    paddingBottom: 15,
                                    borderRadius: 30,
                                }}
                                titleStyle={{
                                    color: '#006600',
                                    fontWeight: 'bold',
                                }}
                                onPress={() => {
                                    Alert.alert('done');
                                    StatusBar.setBarStyle('default');
                                }}
                            />
                        ),
                        backgroundColor: '#339933',
                        image: (
                            <Icon name="coins" type="font-awesome-5" size={100} color="white" />
                        ),
                    },
                ]}
            />
        )
    }
}
