import React from 'react';
import { StyleSheet } from "react-native";
import { Avatar, ListItem } from 'react-native-elements';
import { COLORS } from '../../constants';

const TransactionListPlaceholder = () => {
  return (
    <ListItem>
      <Avatar
        size='medium'
        rounded
        title='--'
        containerStyle={styles.date}
        titleStyle={styles.dateTitle}
      />
      <ListItem.Content>
        <ListItem.Title style={styles.categoryText}>Loading...</ListItem.Title>
        <ListItem.Subtitle>--</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  )
}

const styles = StyleSheet.create({
  date: {
    borderWidth: 1,
    borderColor: COLORS.gray,
  },
  dateTitle: {
    color: COLORS.gray,
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.gray,
  }
});

export default TransactionListPlaceholder