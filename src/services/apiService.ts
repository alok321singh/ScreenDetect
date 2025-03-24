// apiService.ts
import { userApiEndpoints } from "../constant/deviceEndPoint";
import { DeviceData } from "../Hooks/userDeviceInfo"; // Import the DeviceData type to ensure type safety

// Function to send data to the server
export const sendDataToServer = async (data: DeviceData) => {
  try {
    const response = await fetch(userApiEndpoints.POST_DETAILS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify([data]),
    });
    const result = await response.json();
    console.log("Data sent successfully:",result);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
