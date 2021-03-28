import React, { useEffect, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native"
import { Button, Icon, IconProps, Overlay, SearchBar } from 'react-native-elements'
import { FormikProps } from 'formik'
import { COLORS } from '../../constants'

export interface DropDownOverlayProps {
  items: object[],
  id: string,
  searchKey: string,
  label?: string,
  value?: object,
  placeholder?: string,
  name?: string,
  formik?: FormikProps<any>,
  width?: string | number,
  errorMessage?: string,
  loading?: boolean,
  icon?: IconProps,
  hideButtonLabel?: boolean,
  onSearch?(text: string): void,
  renderItem?(item: object): any,
  onChange?(item: object): void,
  onOpen?(): void,
  onClose?(): void,
}

const DropDownOverlay = (props: DropDownOverlayProps) => {

  // define initial value
  let initialValue = null

  if (props.value?.[props.searchKey]) {

    initialValue = props.value[props.searchKey]

  } else if(props.formik?.values[props.name]?.[props.searchKey]) {

    initialValue = props.formik.values[props.name][props.searchKey]
  }

  const [overlay, setOverlay] = useState(false)
  const [value, setValue] = useState(initialValue)
  const [search, setSearch] = useState(initialValue)

  const [error, showError]:any = useState('')
  useEffect(() => {

    if (props.formik && props.name) {
      showError((
        props.formik.touched[props.name]?.[props.searchKey]  &&
        props.formik.errors[props.name]?.[props.searchKey])
        ? props.formik.errors[props.name][props.searchKey]
        : ''
      )
    }
  })

  let styles = StyleSheet.create({
    ...baseStyles,
    label: {
      ...baseStyles.label,
      color: (error)? COLORS.error : COLORS.primary,
    },
    container: {
      ...baseStyles.container,
      width: props.width || '100%',
    },
    button: {
      ...baseStyles.button,
      borderColor: (error)? COLORS.error : COLORS.primary,
    },
    buttonTitle: {
      ...baseStyles.buttonTitle,
      color: (!value)? COLORS.gray : (error)? COLORS.error : COLORS.black,
    },
    overlay: (props.onSearch)? {
      ...baseStyles.overlay,
      height: '80%',
    } : {
      ...baseStyles.overlay,
      maxHeight: '80%',
      paddingBottom: 5,
    },
    flatList: {
      ...baseStyles.flatList,
      maxHeight: (props.onSearch)? '82%' : '100%',
    }
  })

  const handleItemPress = (item) => {
    setValue(item[props.searchKey])
    setSearch(item[props.searchKey])
    if (props.name && props.formik?.values) {
      props.formik.values[props.name] = item
      props.formik.validateForm()
    }
    if (props.onChange) {
      props.onChange(item)
    }
    setTimeout(() => setOverlay(false), 500)
  }

  const handleOnOpen = () => {
    setOverlay(true)
    if (props.onOpen) {
      props.onOpen()
    }
  }

  const handleOnClose = () => {
    setOverlay(false)
    props.formik.setFieldTouched(props.name + '.' + props.searchKey, true)
    if (props.onClose) {
      props.onClose()
    }
  }

  const renderItem = ({ item, index }) => {

    return (
      <Pressable onPress={() => handleItemPress(item)}>
        <View style={[
          styles.item,
          (index < props.items.length - 1)? styles.itemSeparator : {},
          (item[props['searchKey']] === value)? styles.itemSelected : {}
        ]}>
          <Text style={[
            styles.itemText,
            (item[props['searchKey']] === value)? styles.itemTextSelected : {}
          ]}>
            {item[props['searchKey']]}
          </Text>
        </View>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <View>
        {(props.hideButtonLabel)? null :
          (
            <Text style={[
              styles.overlayLabel,
              {color:(error)? COLORS.error : COLORS.primary}
            ]}>
              {props.label}
            </Text>
          )
        }
        <Button
          title={ value || props.placeholder }
          type="outline"
          onPress={handleOnOpen}
          iconRight={true}
          icon={(props.icon)? {
            ...props.icon,
            color:(error)? COLORS.error : COLORS.primary,
          } : {
            name: 'search',
            type:'font-awesome-5',
            color:(error)? COLORS.error : COLORS.primary,
          }}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
      <Text style={styles.errorMessage}>
        {props.errorMessage || error}
      </Text>
      <Overlay
        isVisible={overlay}
        overlayStyle={styles.overlay}
        onBackdropPress={handleOnClose}>
        <View style={styles.overlayContainer}>
          <View style={styles.overlayTitle}>
            <Text style={styles.overlayTitleText}>{props.label}</Text>
          </View>
          {(props.onSearch) ? (
            <SearchBar
              placeholder={props.placeholder}
              value={search}
              lightTheme={true}
              containerStyle={styles.searchBarContainer}
              showLoading={props.loading}
              onChangeText={(text) => {
                setSearch(text)
                return props.onSearch(text)
              }}
            />
          ) : null}
          <FlatList
            data={props.items || []}
            renderItem={renderItem}
            extraData={value}
            keyExtractor={item => item[props.id]}
            style={styles.flatList}
          />
          <Icon
            name='times'
            type={'font-awesome-5'}
            color={COLORS.error}
            size={15}
            reverse raised
            containerStyle={styles.returnIconContainer}
            onPress={handleOnClose}
          />
        </View>
      </Overlay>
    </View>
  )
}

const baseStyles = StyleSheet.create({
  container: {},
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
    paddingLeft: 10,
  },
  button: {
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 5,
    height: 45,
    marginHorizontal: 10,
  },
  buttonTitle: {
    fontWeight: 'normal',
    width: '80%',
    textAlign: 'left',
  },
  errorMessage: {
    color: COLORS.error,
    minHeight: 20,
    fontSize: 12,
    paddingLeft: 15,
    paddingVertical: 5,
  },
  overlay: {
    width: '85%',
    padding: 0,
    borderRadius: 5,
  },
  overlayContainer: {},
  overlayLabel: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlayTitle: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTitleText: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  searchBarContainer: {},
  returnIconContainer: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
  item: {
    justifyContent: 'center',
    height: 50,
    paddingLeft: 20,
    backgroundColor: COLORS.secondary,
  },
  itemSeparator: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  itemSelected: {
    backgroundColor: COLORS.primary,
  },
  itemTextSelected: {
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  flatList: {},
})

export default DropDownOverlay