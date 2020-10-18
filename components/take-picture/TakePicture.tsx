import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions, Image,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";
import ImageZoom from 'react-native-image-pan-zoom';
import * as Sharing from 'expo-sharing';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { Icon, Overlay } from 'react-native-elements';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerOptions } from 'expo-image-picker';
import { COLORS, TOAST } from '../../constants';
import { FormikProps } from 'formik';

interface TakePictureProps {
  name?: string,
  formik?: FormikProps<any>,
  title?: string,
  icon?: string,
  iconType?: string,
  width?: string | number,
  image?: string,
  onTake?(uri: string): void,
  onRemove?(): void,
}

const TakePicture = (props: TakePictureProps) => {

  const [image, setImage] = useState(props.image);
  const [isImageMax, setImageMax] = useState(false);

  const styles = StyleSheet.create({
    ...baseStyles,
    container: {
      ...baseStyles.container,
      width: props.width || '100%',
    },
    placeholder: {
      ...baseStyles.placeholder,
      backgroundColor: (image)? '#ffffff' : 'rgba(0,47,7,0.1)',
    }
  });

  const handleCameraRollPermission = async () => {
    let permission = true;
    if (Platform.OS !== 'web') {
      const { status }  = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        permission = false;
        TOAST.ref.alertWithType(
          'error',
          'Access Denied',
          'A permission to access the camera roll is necessary to perform this action.');
      }
    }

    return permission;
  }

  const handleCameraPermission = async () => {
    let permission = true;
    if (Platform.OS !== 'web') {
      const { status }  = await Permissions.askAsync(Permissions.CAMERA);
      if (status !== 'granted') {
        permission = false;
        TOAST.ref.alertWithType(
          'error',
          'Access Denied',
          'A permission to access the camera is necessary to perform this action.');
      }
    }

    return permission;
  }

  const pickImage = async (method: 'pick'|'take' = 'pick') => {
    try {

      const cameraRollPermission = await handleCameraRollPermission();
      const cameraPermission = (method === 'take')? await handleCameraPermission() : true;

      if (cameraRollPermission && cameraPermission) {

        const options: ImagePickerOptions = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0,
          allowsEditing: false,
        }

        let result: any = {};
        switch (method) {
          case 'pick':
            result = await ImagePicker.launchImageLibraryAsync(options);
            break;
          case 'take':
            result = await ImagePicker.launchCameraAsync(options);
            break;
        }

        if (!result.cancelled) {

          setImage(result.uri);

          if (props.formik && props.name) {
            props.formik.values[props.name] = result.uri;
          }

          if (props.onTake) {
            props.onTake(result.uri);
          }
        }
      }

    } catch(error) {

      TOAST.ref.alertWithType(
          'error',
          'ERROR',
          'An error just occurs in attempt to take or pick up an image.');

      console.warn(error);
    }
  }

  const share = async () => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(image);
    }
  }

  const remove = () => {
    Alert.alert(
      "Remove Receipt Picture",
      "Are you sure you want to remove this picture?",
      [
        {
          text: "NO",
          style: "cancel"
        },
        {
          text: "YES",
          style: "destructive",
          onPress: () => {
            setImageMax(false);
            setImage(null);
            resetStatusBar();
            if (props.formik?.values[props.name]) {
              props.formik.values[props.name] = null;
            }
            if (props.onRemove) {
              props.onRemove();
            }
          }}
      ],
      { cancelable: false }
    );
  }

  const { showActionSheetWithOptions } = useActionSheet();
  const showOptions = () => {
    showActionSheetWithOptions(
      {
        options: [
          'Take a Picture',
          'Choose a Picture',
          'Cancel',
        ],
        cancelButtonIndex: 2,
        tintColor: COLORS.primary,
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0:
            (async () => { await pickImage('take')})();
            break;
          case 1:
            (async () => { await pickImage('pick')})();
            break;
        }
      },
    );
  }

  const showOptionsMax = () => {
    showActionSheetWithOptions(
      {
        options: [
          'Take another Picture',
          'Choose another Picture',
          'Share',
          'Remove',
          'Cancel',
        ],
        cancelButtonIndex: 4,
        destructiveButtonIndex: 3,
        destructiveColor: COLORS.error,
        tintColor: COLORS.success,
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0:
            (async () => { await pickImage('take')})();
            break;
          case 1:
            (async () => { await pickImage('pick')})();
            break;
          case 2:
            (async () => { await share()})();
            break;
          case 3:
            remove();
            break;
        }
      },
    );
  }

  const resetStatusBar = () => {
    StatusBar.setHidden(false);
    StatusBar.setBarStyle('dark-content');
  }

  const handleTouch = () => {
    if (image) {
      setImageMax(true);
      StatusBar.setHidden(true);
    } else {
      showOptions();
    }
  }

  const renderImage = () => {

    let render = null;
    if (image) {

      render = (
        <>
          <Image
            source={{ uri: image }}
            resizeMode='contain'
            style={styles.imageSize}
          />
          <ActivityIndicator
            size='large'
            color={COLORS.primary}
            style={styles.imagePlaceholder}
          />
        </>
      );

    } else {

      render = (
        <>
          <Icon
            name='camera'
            type={props.iconType || 'font-awesome-5'}
            size={40}
            color={COLORS.primary}
          />
          <Text style={styles.label}>{props.title || 'Take Picture'}</Text>
        </>
      );
    }

    return render;
  }

  return (
    <View style={styles.container}>
      <TouchableHighlight
        style={styles.placeholder}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={handleTouch}>
        {renderImage()}
      </TouchableHighlight>
      <Overlay
        isVisible={isImageMax}
        overlayStyle={styles.imageMaxOverlay}>
        <>
          <ImageZoom
            cropWidth={Dimensions.get('window').width}
            cropHeight={Dimensions.get('window').height}
            imageWidth={Dimensions.get('window').width}
            imageHeight={Dimensions.get('window').height}>
            <Image
              source={{ uri: image }}
              resizeMode='contain'
              style={styles.imageSize}
            />
          </ImageZoom>
          <ActivityIndicator
            size='large'
            color={COLORS.secondary}
            style={styles.imagePlaceholder}
          />
          <View style={styles.imageMaxOverlayToolbar}>
            <Icon
              name='chevron-left'
              type='font-awesome'
              color='rgba(0,102,0,.7)'
              raised reverse
              onPress={() => {
                setImageMax(false);
                resetStatusBar();
              }}
            />
            <Icon
              name='ellipsis-v'
              type='font-awesome'
              color='rgba(134,0,0,.7)'
              raised reverse
              onPress={() => {
                showOptionsMax();
              }}
            />
          </View>
        </>
      </Overlay>
    </View>
  )
}

const baseStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  label: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  imageMaxOverlay: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    padding: 0,
    margin: 0,
  },
  imageMaxOverlayToolbar: {
    position: 'absolute',
    width: '100%',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imageSize: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    position: 'absolute',
    zIndex: -1,
    alignSelf: 'center',
    justifyContent: 'center',
    top: '50%',
  }
});

export default TakePicture