import React from 'react';
import { Avatar, Icon, ListItem, ListItemProps } from 'react-native-elements';
import { TransactionModel } from '../../models/TransactionModel';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../constants';
import moment from 'moment';

interface TransactionListItemProps extends ListItemProps {
  transaction: TransactionModel,
}

const TransactionListItem = (props) => {

  const { timestamp, category, place, amount, key }: TransactionModel = props.transaction;
  const date = moment(timestamp).format('MMM[\n]DD');
  const time = moment(timestamp).format('hh:mma');
  const amountFormat = new Intl.NumberFormat(
    'en-US',
    { style: 'currency', currency: 'USD'}
  ).format(amount);

  const styles = StyleSheet.create({
    ...baseSyles,
    amountInfoText: {
      ...baseSyles.amountInfoText,
      color: (amount > 0)? COLORS.success : COLORS.error,
    }
  });

  return (
    <ListItem key bottomDivider pad={10} {...props}>
      <Avatar
        size='medium'
        rounded
        title={date}
        containerStyle={styles.date}
        titleStyle={styles.dateTitle}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.categoryText}>
          {category.name}
        </ListItem.Title>
        {(place)? <ListItem.Subtitle>{place}</ListItem.Subtitle>: null}
      </ListItem.Content>
      <View>
        <View style={styles.amountInfo}>
          <Text style={styles.amountInfoText}>
            {amountFormat}
          </Text>
          <Icon
            name={(amount > 0)? 'caret-up' : 'caret-down'}
            color={(amount > 0)? COLORS.success : COLORS.error}
            type='font-awesome'
          />
        </View>
        <Text style={styles.timeText}>
          {time}
        </Text>
      </View>
    </ListItem>
  )
}

const baseSyles = StyleSheet.create({
  date: {
    borderWidth: 2,
  },
  dateTitle: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  amountInfo: {
    flexDirection:'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  amountInfoText: {
    fontSize: 17,
    fontWeight: 'bold',
    paddingRight: 5,
  },
  timeText: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default TransactionListItem