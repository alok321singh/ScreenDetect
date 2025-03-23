import { renderHook, act } from '@testing-library/react-hooks';
import { NativeModules } from 'react-native';
import usePreventScreenshot from './usePreventScreenshot'; // Adjust the path accordingly

// Mock NativeModules to simulate behavior of PreventScreenshotModule
jest.mock('react-native', () => {
  const actualNativeModules = jest.requireActual('react-native');
  return {
    ...actualNativeModules,
    NativeModules: {
      PreventScreenshotModule: {
        forbid: jest.fn(),
        allow: jest.fn(),
      },
    },
  };
});

describe('usePreventScreenshot Hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call forbid and set enabled to false', async () => {
    // Simulate a successful forbid call
    (NativeModules.PreventScreenshotModule.forbid as jest.Mock).mockResolvedValueOnce('forbid success');

    // Render the hook
    const { result } = renderHook(() => usePreventScreenshot());

    // Check initial state
    expect(result.current.enabled).toBe(false);
    expect(result.current.error).toBe(null);

    // Call forbid
    await act(async () => {
      await result.current.forbid();
    });

    // Check if forbid was called and verify state change
    expect(NativeModules.PreventScreenshotModule.forbid).toHaveBeenCalledTimes(1);
    expect(result.current.enabled).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should call allow and set enabled to true', async () => {
    // Simulate a successful allow call
    (NativeModules.PreventScreenshotModule.allow as jest.Mock).mockResolvedValueOnce('allow success');

    // Render the hook
    const { result } = renderHook(() => usePreventScreenshot());

    // Check initial state
    expect(result.current.enabled).toBe(false);
    expect(result.current.error).toBe(null);

    // Call allow
    await act(async () => {
      await result.current.allow();
    });

    // Check if allow was called and verify state change
    expect(NativeModules.PreventScreenshotModule.allow).toHaveBeenCalledTimes(1);
    expect(result.current.enabled).toBe(true);
    expect(result.current.error).toBe(null);
  });

  it('should handle error when forbid fails', async () => {
    const errorMessage = 'Something went wrong';
    // Simulate an error in forbid
    (NativeModules.PreventScreenshotModule.forbid as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => usePreventScreenshot());

    // Check initial state
    expect(result.current.enabled).toBe(false);
    expect(result.current.error).toBe(null);

    // Call forbid and expect it to handle the error
    await act(async () => {
      await result.current.forbid();
    });

    // Check if the error was set correctly
    expect(result.current.error).toEqual(new Error(errorMessage));
    expect(NativeModules.PreventScreenshotModule.forbid).toHaveBeenCalledTimes(1);
  });

  it('should handle error when allow fails', async () => {
    const errorMessage = 'Something went wrong';
    // Simulate an error in allow
    (NativeModules.PreventScreenshotModule.allow as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    // Render the hook
    const { result } = renderHook(() => usePreventScreenshot());

    // Check initial state
    expect(result.current.enabled).toBe(false);
    expect(result.current.error).toBe(null);

    // Call allow and expect it to handle the error
    await act(async () => {
      await result.current.allow();
    });

    // Check if the error was set correctly
    expect(result.current.error).toEqual(new Error(errorMessage));
    expect(NativeModules.PreventScreenshotModule.allow).toHaveBeenCalledTimes(1);
  });
});
