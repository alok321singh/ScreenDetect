import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import usePreventScreenshot from '../Hooks/usePreventScreenshot';
import useDeviceInfo from '../Hooks/userDeviceInfo';
import useLoaderManager from '../Hooks/useLoaderManager';
import {sendDataToServer} from '../services/apiService';
import ICON from '../constant/image'
// Defining types for the component props (optional in this case as there are no props passed)
type Dashboard = {};

// Functional Component with TypeScript
const Dashboard: React.FC<Dashboard> = () => {
  const {forbid, allow, enabled} = usePreventScreenshot();
  const {deviceData} = useDeviceInfo();
  const [isLoading, setIsLoading] = useState(false);
  const {subscribe, show, hide} = useLoaderManager();
  const handleLoaderStateChange = (isLoading: boolean) => {
    setIsLoading(isLoading);
  };
  useEffect(() => {
    if (deviceData.screenshotStatus) {
      console.log('Screenshot Taken - Sending Data!');
      Alert.alert('Screenshot Taken by user');
      subscribe(handleLoaderStateChange);
      show();
      sendDataToServer(deviceData).then(() => {
        hide();
      });
    }
    return () => {
      subscribe(() => {});
    };
  }, [deviceData.screenshotStatus]);
  useEffect(() => {
    forbid();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <ActivityIndicator animating={isLoading} size="large" color="#0000ff" />
        {!isLoading && (
          <>
            <Image
              source={ICON.icon}
              style={styles.image}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => (enabled ? forbid() : allow())}>
              <Text style={styles.buttonText}>
                {!enabled ? 'Activate' : 'Activated'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    marginTop: 60,
  },
  buttonText: {
    textAlignVertical: 'center',
    color: 'white',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
});

export default Dashboard;
