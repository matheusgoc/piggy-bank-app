import React from 'react'
import { ListItem } from 'react-native-elements';
import ContentLoader, { Rect } from 'react-content-loader/native';

const AccountListPlaceholder = ({index}) => (
  <ListItem topDivider={index > 0}>
    <ContentLoader
      speed={.5}
      width={300}
      height={60}
      viewBox="0 0 300 60"
      backgroundColor="#f3f3f3"
      foregroundColor="#d4d4d4">
      <Rect x="10" y="20" rx="3" ry="3" width="20" height="20" />
      <Rect x="59" y="13" rx="3" ry="3" width="200" height="10" />
      <Rect x="60" y="35" rx="3" ry="3" width="100" height="10" />
    </ContentLoader>
  </ListItem>
)

export default AccountListPlaceholder