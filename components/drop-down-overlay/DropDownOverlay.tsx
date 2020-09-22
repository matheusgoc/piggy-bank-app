import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import { Button, Icon, ListItem, Overlay, SearchBar } from 'react-native-elements';
import { FormikProps } from 'formik';
import { COLORS } from '../../constants';

interface DropDownOverlayProps {
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

}

const DropDownOverlay = (props: DropDownOverlayProps) => {

  const [overlay, setOverlay] = useState(false);
  const [search, setSearch] = useState(
    props.value && props.value[props.searchKey] ||
    props.formik?.values[props.name][props.searchKey] ||
    null
  );

  const [error, showError]:any = useState(false);
  useEffect(() => {
    if (props.formik && props.name) {
      showError((props.formik.touched[props.name] && props.formik.errors[props.name])
        ?props.formik.errors[props.name]
        : ''
      );
    }
  });

  const styles = StyleSheet.create({
    label: {
      color: (error)? COLORS.error : COLORS.primary,
      fontWeight: 'bold',
      fontSize: 16,
      paddingBottom: 3,
      paddingLeft: 10,
    },
    container: {
      width: props.width || '100%',
    },
    button: {
      justifyContent: 'space-between',
      borderWidth: 2,
      borderRadius: 5,
      height: 45,
      borderColor: (error)? COLORS.error : COLORS.primary,
      marginHorizontal: 10,
      paddingRight: 0,
    },
    buttonTitleStyle: {
      color: (error)? COLORS.error : null,
      fontWeight: 'normal',
    },
    errorMessage: {
      color: COLORS.error,
      minHeight: 20,
      fontSize: 12,
      paddingLeft: 5,
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
    }
  })

  const handleItemPress = (item) => {
    setSearch(item[props.searchKey]);
    if (props.name && props.formik?.values) {
      props.formik.values[props.name] = item;
    }
    if (props.value) {
      props.value = item;
    }
    if (props.onChange) {
      props.onChange(item);
    }
    setOverlay(false);
  }

  const renderItem = ({ item, index, separators }) => {
    return (
      <ListItem onPress={() => handleItemPress(item)}>
        <ListItem.Content>
          <ListItem.Title>{item[props['searchKey']]}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    );
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{props.label}</Text>
        <Button
          title={ search || props.placeholder }
          type="outline"
          onPress={() => setOverlay(!overlay)}
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
        onBackdropPress={ () => setOverlay(false) }>
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
            onClear={() => {

            }}
          />
          <FlatList
            data={props.items || []}
            renderItem={renderItem}
            extraData={search}
            keyExtractor={item => item.id}
          />
          <Icon
            name='times'
            type={'font-awesome-5'}
            color={COLORS.error}
            size={15}
            reverse raised
            containerStyle={styles.returnIconContainer}
            onPress={() => {
              setOverlay(false);
            }}
          />
        </View>
      </Overlay>
    </>
  )
}

export default DropDownOverlay