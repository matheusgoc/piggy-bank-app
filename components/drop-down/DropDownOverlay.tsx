import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Button, Icon, ListItem, Overlay, SearchBar } from 'react-native-elements';
import { FormikProps } from 'formik';
import { COLORS } from '../../constants';

export interface DropDownOverlayProps {
  items: object[],
  key: string,
  searchKey: string,
  label?: string,
  value?: object,
  placeholder?: string,
  name?: string,
  formik?: FormikProps<any>,
  width?: string | number,
  errorMessage?: string,
  loading?: boolean,
  onSearch(text: string): void,
  renderItem?(item: object): any,
  onChange?(item: object): void,
  onOpen?(): void,
  onClose?(): void,
}

const DropDownOverlay = (props: DropDownOverlayProps) => {

  // define initial value
  let initialValue = null;
  if (props.value && props.value[props.searchKey]) {

    initialValue = props.value[props.searchKey];

  } else if(props.formik?.values[props.name][props.searchKey]) {

    initialValue = props.formik.values[props.name][props.searchKey];
  }

  const [overlay, setOverlay] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [search, setSearch] = useState(initialValue);

  const [error, showError]:any = useState('');
  useEffect(() => {

    if (props.formik && props.name) {
      showError((
        props.formik.touched[props.name]?.[props.searchKey]  &&
        props.formik.errors[props.name]?.[props.searchKey])
        ? props.formik.errors[props.name][props.searchKey]
        : ''
      );
    }
  });

  const styles = StyleSheet.create({
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
    buttonTitleStyle: {
      ...baseStyles.buttonTitleStyle,
      color: (!value)? COLORS.gray : (error)? COLORS.error : null,
    },
  });

  const handleItemPress = (item) => {
    setValue(item[props.searchKey]);
    setSearch(item[props.searchKey]);
    if (props.name && props.formik?.values) {
      props.formik.values[props.name] = item;
      props.formik.validateForm();
    }
    if (props.onChange) {
      props.onChange(item);
    }
    setTimeout(() => setOverlay(false), 300);
  }

  const handleOnOpen = () => {
    setOverlay(true);
    if (props.onOpen) {
      props.onOpen();
    }
  }

  const handleOnClose = () => {
    setOverlay(false);
    props.formik.setFieldTouched(props.name + '.' + props.searchKey, true);
    if (props.onClose) {
      props.onClose();
    }
  }

  const renderItem = ({ item, index, separators }) => {

    return (
      <ListItem
        onPress={() => handleItemPress(item)}
        topDivider={true}
        containerStyle={(item[props['searchKey']] === value)? styles.itemSelected : {}}>
        <ListItem.Content>
          <ListItem.Title style={(item[props['searchKey']] === value)? styles.itemTitleSelected : {}}>
            {item[props['searchKey']]}
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        <Button
          title={ value || props.placeholder }
          type="outline"
          onPress={handleOnOpen}
          iconRight={true}
          icon={{
            name: 'search',
            type:'font-awesome-5',
            color:(error)? COLORS.error : COLORS.primary,
          }}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitleStyle}
        />
      </View>
      <Text style={styles.errorMessage}>
        {props.errorMessage || error}
      </Text>
      <Overlay
        isVisible={overlay}
        overlayStyle={styles.overlay}
        onBackdropPress={handleOnClose}>
        <View>
          <SearchBar
            placeholder={props.placeholder}
            value={ search }
            lightTheme={true}
            containerStyle={styles.searchBarContainer}
            showLoading={props.loading}
            onChangeText={(text) => {
              setSearch(text);
              return props.onSearch(text);
            }}
          />
          <FlatList
            data={props.items || []}
            renderItem={renderItem}
            extraData={value}
            keyExtractor={item => item.name}
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
    </>
  )
}

const baseStyles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 3,
    paddingLeft: 10,
  },
  container: {},
  button: {
    justifyContent: 'space-between',
    borderWidth: 2,
    borderRadius: 5,
    height: 45,
    marginHorizontal: 10,
    paddingRight: 0,
  },
  buttonTitleStyle: {
    fontWeight: 'normal',
    width: '80%',
    textAlign: 'left',
  },
  errorMessage: {
    color: COLORS.error,
    minHeight: 20,
    fontSize: 12,
    paddingLeft: 10,
    paddingVertical: 5,
  },
  overlay: {
    width: '85%',
    height: '85%',
    padding: 0,
    borderRadius: 5,
  },
  searchBarContainer: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  returnIconContainer: {
    position: 'absolute',
    top: -20,
    right: -20,
  },
  itemSelected: {
    backgroundColor: COLORS.primary,
  },
  itemTitleSelected: {
    fontWeight: 'bold',
    color: '#fff',
  },
  flatList: {
    maxHeight: '91%',
    borderRadius: 5,
  },
});

export default DropDownOverlay