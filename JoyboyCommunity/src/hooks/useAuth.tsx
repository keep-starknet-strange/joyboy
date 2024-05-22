import useNavigationStore from "./useNavigationContext";

type AuthResponse = {
  login: () => void;
  logout: () => Promise<void>;
};

const useAuth = (): AuthResponse => {
  const setStack = useNavigationStore((state) => state.setStack);

  const login = async (): Promise<void> => {
    setStack("app");
  };

  const logout = async () => {
    setStack("login");
  };

  return { login, logout };
};

export default useAuth;
