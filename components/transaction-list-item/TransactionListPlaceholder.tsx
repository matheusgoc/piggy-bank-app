import React from 'react';
import { Divider, ListItem } from 'react-native-elements';
import ContentLoader, { Circle, Rect } from "react-content-loader/native"

const TransactionListPlaceholder = ({index}) => {
  return (
    <ListItem topDivider={index > 0}>
      <ContentLoader
        speed={.5}
        width={300}
        height={60}
        viewBox="0 0 300 60"
        backgroundColor="#f3f3f3"
        foregroundColor="#d4d4d4">
        <Rect x="69" y="13" rx="3" ry="3" width="200" height="10" />
        <Rect x="70" y="35" rx="3" ry="3" width="100" height="10" />
        <Circle cx="29" cy="29" r="29" />
      </ContentLoader>
    </ListItem>
  )
}

export default TransactionListPlaceholder