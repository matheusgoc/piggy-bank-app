import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, Button, Icon, ListItem, ListItemProps } from 'react-native-elements'
import { TransactionModel } from '../../models/TransactionModel'
import { Alert, StyleSheet, Text, View } from 'react-native'
import { COLORS, TOAST } from '../../constants'
import moment from 'moment'
import { formatCurrency, showLoading } from '../../helpers'
import { checkDeleteEnable } from '../../features/transactions/TransactionsSlice'
import TransactionsServiceApi from '../../services/TransactionsServiceApi'

interface TransactionListItemProps extends ListItemProps {
  transaction: TransactionModel,
  index: number,
}

const TransactionListItem = (props: TransactionListItemProps) => {

  const isDeleteEnable = useSelector(checkDeleteEnable)
  const [isConfirmDeleteEnable, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!isDeleteEnable) {
      setConfirmDelete(false)
    }
  }, [isDeleteEnable])

  const { timestamp, category, place, amount }: TransactionModel = props.transaction
  const date = moment(timestamp).format('MMM[\n]DD')
  const time = moment(timestamp).format('hh:mma')
  const amountFormat = formatCurrency(amount)

  const styles = StyleSheet.create({
    ...baseStyles,
    amountInfoText: {
      ...baseStyles.amountInfoText,
      color: (amount > 0)? COLORS.success : COLORS.error,
    }
  })

  const handleOnRemove = () => {
    Alert.alert(
      'Remove Transaction',
      'Are you sure you want to remove this transaction?',
      [
        {
          text: "No",
          onPress: () => {
            setConfirmDelete(false)
          },
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => {
            showLoading(true)
            const apiService = new TransactionsServiceApi()
            apiService.remove(props.index)
            apiService.delete(props.transaction).then(() => {
              TOAST.ref.alertWithType(
                'success',
                'Transaction removed',
                'The transaction has been removed',
              )
            }).finally(() => {
              showLoading(false)
            })
          }
        }
      ]
    )
  }

  return (
    <ListItem topDivider={props.index > 0} pad={10} {...props}>
      {(isDeleteEnable && !isConfirmDeleteEnable)?
        <Button
          type='clear'
          icon={{
            name: 'minus-circle',
            color: COLORS.error,
            type: 'font-awesome'
          }}
          buttonStyle={styles.delete}
          onPress={() => setConfirmDelete(true)}
        />
      : null}
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
      {(isDeleteEnable && isConfirmDeleteEnable)?
        <Button
          icon={{
            name: 'times',
            color: '#fff',
            type: 'font-awesome'
          }}
          buttonStyle={styles.deleteConfirm}
          onPress={handleOnRemove}
        />
      : null}
    </ListItem>
  )
}

const baseStyles = StyleSheet.create({
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
  },
  delete: {
    height: 50,
  },
  deleteConfirm: {
    height: 50,
    backgroundColor: COLORS.error,
  }
})

export default TransactionListItem