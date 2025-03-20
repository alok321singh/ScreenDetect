import { useState } from 'react';
import { Alert, NativeModules } from 'react-native';

const usePreventScreenshot = () => {
  const [error, setError] = useState(null);
  const [enabled,setEnabled] = useState(false)

  const forbid = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.forbid();
      Alert.alert(result);
      console.log("result>>>",result)
      setEnabled(false)
    } catch (e:any) {
      setError(e);
      console.log(e);
    }
  };

  const allow = async () => {
    try {
      const result = await NativeModules.PreventScreenshotModule.allow();
      Alert.alert(result);
      console.log("result>>>",result)
      setEnabled(true)
      console.log("activate>>>")
    } catch (e:any) {
      setError(e);
      console.log(e);
    }
  };

  return {
    error,
    forbid,
    allow,
    enabled
  };
};

export default usePreventScreenshot;
