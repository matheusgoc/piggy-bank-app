import React from 'react'
import { StyleProp, StyleSheet, Text, View } from "react-native"
import { Icon, IconProps } from 'react-native-elements'

interface TextIconProps extends IconProps {
  textStyle?: StyleProp<any>,
  children?: any,
}

const TextIcon = (props: TextIconProps) => {

  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  })

  return (
    <View style={styles.container}>
      <Icon {...props} />
      <Text style={[{paddingLeft: 5}, props.textStyle]}>{props.children}</Text>
    </View>
  )
}

export default TextIcon