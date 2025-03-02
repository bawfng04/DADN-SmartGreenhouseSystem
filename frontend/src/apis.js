// const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// run on local, run normally
export const REACT_APP_API_URL = "http://localhost:8000/api";

// run on the deployed server URL, blocked by CORS policy
// export const REACT_APP_API_URL =
//   "https://dadn-cjo832qjq-bawfng04s-projects.vercel.app/api";


export const exampleAPI = `${REACT_APP_API_URL}/example`;

export const loginAPI = `${REACT_APP_API_URL}/login`;
export const registerAPI = `${REACT_APP_API_URL}/register`;
