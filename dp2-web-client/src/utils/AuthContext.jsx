import PropTypes from 'prop-types';
import { useMemo,useState,useEffect,useContext,useCallback, createContext  } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginUser = useCallback(async (userInfo) => {
    console.log('userInfo',userInfo)

    try {
      setUser(userInfo);
      localStorage.setItem('user', JSON.stringify(userInfo));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const logoutUser = useCallback(() => {
    setUser(null);
    localStorage.removeItem('user');
  }, []);
  const getPermissions = useCallback(async () => {

    console.log("userX");

    const userX=  localStorage.getItem('user');
    console.log(userX);
    const userStringify = JSON.parse(userX);
    console.log(userStringify.token);
    const accessToken = userStringify.token;
    const {refreshToken} = userStringify;
    const response = await fetch(`http://localhost:3000/api/user/listarpermisos`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'Refresh-Token': `Bearer ${refreshToken}`
      }
    });

    const data = await response.json();
    console.log("datapermission");
    console.log(data);
    return data;
  }, []);

  const contextData = useMemo(() => ({
    user,
    loginUser,
    logoutUser,
    getPermissions
    }), [user, loginUser, logoutUser,getPermissions]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;