interface DeviceApiEndpoints {

    POST_DETAILS :string;
  }
  
  const API_BASE_URL = "https://67daa67235c87309f52d6dd1.mockapi.io";
  
  export const userApiEndpoints: DeviceApiEndpoints = {
    POST_DETAILS : `${API_BASE_URL}/api/v1/device/details`
  };
  
  console.log(userApiEndpoints.POST_DETAILS); // "https://api.example.com/users"
  