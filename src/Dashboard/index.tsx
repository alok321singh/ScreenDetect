import React, { useEffect } from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet} from 'react-native';
import usePreventScreenshot from '../Hooks';
import useDeviceInfo from '../Hooks/apicall';

// Defining types for the component props (optional in this case as there are no props passed)
type CenteredImageWithButtonProps = {};

// Functional Component with TypeScript
const CenteredImageWithButton: React.FC<CenteredImageWithButtonProps> = () => {
  const {forbid, allow , enabled} = usePreventScreenshot();
  const { deviceData, sendDataToServer } = useDeviceInfo();

  useEffect(() => {
    if (deviceData.screenshotDetected) {
      console.log("Screenshot Taken - Sending Data!");
      sendDataToServer(deviceData);
    }
  }, [deviceData.screenshotDetected]);


  return (
    <View style={styles.container}>
      {/* Image centered */}
      <Image
        source={require('../assets/icons/icon.png')} // Replace with your image URL or local image
        style={styles.image}
      />

      {/* Button at the bottom */}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>enabled? forbid():allow()}>
        <Text style={styles.buttonText}>{!enabled?"Activate":"Activated"}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Defining styles with TypeScript
const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: 200,
    width: 200,
  },
  button: {
    backgroundColor: 'darkblue',
    height: 50,
    width: 140,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:60
  },
  buttonText: {
    textAlignVertical: 'center',
    color: 'white',
  },
});

export default CenteredImageWithButton;
