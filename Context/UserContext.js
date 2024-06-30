import { createContext, useContext, useState } from "react";

const UserContext = createContext();
const SetUserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function useSetUser() {
  return useContext(SetUserContext);
}

export function UserProvider({ children }) {
  const [users, setUsers] = useState(null);

  return (
    <UserContext.Provider value={users}>
      <SetUserContext.Provider value={setUsers}>
        {children}
      </SetUserContext.Provider>
    </UserContext.Provider>
  );
}
