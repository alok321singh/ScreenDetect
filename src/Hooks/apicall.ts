import { useEffect, useState } from "react";
import { NativeModules, NativeEventEmitter, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import Geolocation from "react-native-geolocation-service";
import publicIp from "react-native-public-ip";
import { request, PERMISSIONS, PermissionStatus } from "react-native-permissions";

// Import Native Android Module for Screenshot Detection (If Bridged)
const { PreventScreenshotModule:ScreenshotModule } = NativeModules;
    // const { PreventScreenshotModule } = NativeModules;
// Define types for device data
interface DeviceData {
  os: string;
  deviceName: string;
  macAddress: string;
  imei: string;
  latitude: number | null;
  longitude: number | null;
  publicIP: string;
  screenshotDetected: boolean;
}

// Custom hook for collecting device information
const useDeviceInfo = () => {
  const [deviceData, setDeviceData] = useState<DeviceData>({
    os: Platform.OS === "ios" ? "iOS" : "Android",
    deviceName: "",
    macAddress: "",
    imei: "Not Available",
    latitude: null,
    longitude: null,
    publicIP: "",
    screenshotDetected: false,
  });

  // Function to fetch device details
  const getDeviceInfo = async () => {
    try {
      const deviceName = await DeviceInfo.getDeviceName();
      const macAddress = await DeviceInfo.getMacAddress();
      const publicIP = await publicIp();

      let imei = "Not Available";
      if (Platform.OS === "android") {
        const permission: PermissionStatus = await request(PERMISSIONS.ANDROID.READ_PHONE_STATE);
        if (permission === "granted") {
          imei = await DeviceInfo.getUniqueId(); // IMEI is restricted on Android 10+
        }
      }

      setDeviceData((prev) => ({
        ...prev,
        deviceName,
        macAddress,
        imei,
        publicIP,
      }));
    } catch (error) {
      console.error("Error getting device info:", error);
    }
  };

  // Function to get the user's location
  const getLocation = () => {
    request(
      Platform.OS === "ios"
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
    ).then((result) => {
      if (result === "granted") {
        Geolocation.getCurrentPosition(
          (position) => {
            setDeviceData((prev) => ({
              ...prev,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }));
          },
          (error) => console.error("Error getting location:", error),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    });
  };

  // Function to detect screenshot
  const detectScreenshot = () => {
    if (ScreenshotModule) {
      ScreenshotModule.startListening();
      const eventEmitter = new NativeEventEmitter(ScreenshotModule);
      eventEmitter.addListener("ScreenshotTaken", () => {
        setDeviceData((prev) => ({ ...prev, screenshotDetected: true }));
        sendDataToServer({ ...deviceData, screenshotDetected: true });
      });
    }
  };

  // Function to send data to API
  const sendDataToServer = async (data: DeviceData) => {
    try {
      const response = await fetch("https://your-api-endpoint.com/device-data", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log("Data sent successfully:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  useEffect(() => {
    getDeviceInfo();
    getLocation();
    detectScreenshot();
  }, []);

  return { deviceData, sendDataToServer };
};

export default useDeviceInfo;
