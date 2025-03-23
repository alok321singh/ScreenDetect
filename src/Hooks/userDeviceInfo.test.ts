import { getDeviceInfo } from './userDeviceInfo'; // Import your function
import DeviceInfo from 'react-native-device-info'; // Assuming you're using this module

jest.mock('react-native-device-info'); // Mock the entire DeviceInfo module

describe('getDeviceInfo', () => {
  let setDeviceDataMock;

  beforeEach(() => {
    setDeviceDataMock = jest.fn(); // Create a mock function for setDeviceData
    global.setDeviceData = setDeviceDataMock; // Mock the global setDeviceData function (or import it if necessary)
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  it('should fetch device information and update state correctly', async () => {
    // Mock the resolved values for the DeviceInfo methods
    DeviceInfo.getDeviceName.mockResolvedValue('Device X');
    DeviceInfo.getMacAddress.mockResolvedValue('00:1A:2B:3C:4D:5E');
    DeviceInfo.getIpAddress.mockResolvedValue('192.168.0.1');

    // Call the function
    await getDeviceInfo();

    // Check if setDeviceData was called with the correct data
    expect(setDeviceDataMock).toHaveBeenCalledWith({
      deviceName: 'Device X',
      macAddress: '00:1A:2B:3C:4D:5E',
      publicIP: '192.168.0.1',
    });
  });

  it('should handle errors gracefully when fetching device info', async () => {
    // Simulate an error in one of the methods
    DeviceInfo.getDeviceName.mockRejectedValue(new Error('Failed to fetch device name'));

    // // Call the function
    // await getDeviceInfo();

    // Ensure that setDeviceData was not called
    expect(setDeviceDataMock).not.toHaveBeenCalled();

    // Check that the error is logged
    // You can mock the console.error if necessary to check for error logging
    const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(consoleErrorMock).toHaveBeenCalledWith('Error getting device info:', expect.any(Error));
    consoleErrorMock.mockRestore(); // Restore console.error after the test
  });
});
