import { sendDataToServer } from './apiService';  // Import the function to test
import { userApiEndpoints } from '../constant/deviceEndPoint';  // Assuming userApiEndpoints is imported correctly
import { DeviceData } from '../Hooks/userDeviceInfo';  // Assuming the DeviceData type is correct

// Mocking the global fetch function
global.fetch = jest.fn();

describe('sendDataToServer', () => {
  const mockDeviceData: DeviceData = {
    os: 'Android',
    deviceName: 'My Android Device',
    macAddress: '00:11:22:33:44:55',
    IMEI: '123456789012345',
    location: 32412122,
    ipAddress: '192.168.0.1',
    screenshotStatus: false,
    id: 2,
    createdAt: '1/2/2034',
  };

  afterEach(() => {
    jest.clearAllMocks();  // Clears mocks after each test to avoid any side effects
  });

  it('should send data to the server successfully', async () => {
    const mockResponse = {
      message: 'Data sent successfully:',
    };

    // Mock the fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    // Call the function
    await sendDataToServer(mockDeviceData);

    // Assert that fetch was called with the correct parameters
    expect(fetch).toHaveBeenCalledWith(userApiEndpoints.POST_DETAILS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([mockDeviceData]),
    });

    // Assert that the correct response was processed
    expect(fetch).toHaveBeenCalledTimes(1);  // Ensure fetch was called once
    expect(mockResponse.message).toHaveBeenCalledWith(mockResponse.message);  // Checking console.log
  });

  it('should handle errors when sending data', async () => {
    // Mock the fetch response to simulate an error
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    // Call the function
    await sendDataToServer(mockDeviceData);

    // Assert that fetch was called once
    expect(fetch).toHaveBeenCalledTimes(1);

    // Check if error handling was executed
    // expect(console.error).toHaveBeenCalledWith('Error sending data:', new Error('Network error'));  // Checking console.error
  });
});
