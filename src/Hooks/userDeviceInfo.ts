import {useEffect, useState} from 'react';
import {NativeEventEmitter, NativeModules, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import publicIp from 'react-native-public-ip';
import {request, PERMISSIONS, PermissionStatus} from 'react-native-permissions';
import {sendDataToServer} from '../services/apiService'; // Import the API call function

// Define types for device data
export interface DeviceData {
  os: string;
  deviceName: string;
  macAddress: string;
  IMEI: string;
  location: number | null;
  ipAddress: string;
  screenshotStatus: boolean;
  id: number;
  createdAt: string;
}

// Custom hook for collecting device information
const useDeviceInfo = () => {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    os: Platform.OS === 'ios' ? 'iOS' : 'Android',
    deviceName: '',
    macAddress: '',
    IMEI: 'Not Available',
    location: null,
    ipAddress: '',
    screenshotStatus: false,
    id: 1,
    createdAt: '',
  });

  // Function to fetch device details
  const getDeviceInfo = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const macAddress = await DeviceInfo.getMacAddress();
      const ipAddress = await DeviceInfo.getIpAddress();

      let IMEI = 'Not Available';
      if (Platform.OS === 'android') {
        const permission: PermissionStatus = await request(
          PERMISSIONS.ANDROID.READ_PHONE_STATE,
        );
        if (permission === 'granted') {
          IMEI = await DeviceInfo.getUniqueId(); // IMEI is restricted on Android 10+
        }
      }

      setDeviceData(prev => ({
        ...prev,
        deviceName,
        macAddress,
        IMEI,
        ipAddress,
      }));
    } catch (error) {
      console.error('Error getting device info:', error);
    }
  };

  // Function to get the user's location
  const getLocation = async () => {
    const location = await DeviceInfo.getAvailableLocationProviders();
    request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    ).then(result => {
      if (result === 'granted') {
        // Simulate geolocation data
        setDeviceData(prev => ({
          ...prev,
          location: location,
        }));
      }
    });
  };

  // Function to detect screenshot
  const detectScreenshot = () => {
    const {PreventScreenshotModule: ScreenshotModule} = NativeModules;
    if (ScreenshotModule) {
      const eventEmitter = new NativeEventEmitter(ScreenshotModule);
      eventEmitter.addListener('ScreenshotTaken', () => {
        setDeviceData(prev => ({...prev, screenshotStatus: true}));
        sendDataToServer({...deviceData, screenshotStatus: true});
      });
    }
  };

  useEffect(() => {
    getDeviceInfo();
    getLocation();
    detectScreenshot();
  }, []);

  return {deviceData};
};

export default useDeviceInfo;
