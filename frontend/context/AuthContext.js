'use client';
import{createContext,useContext,useState,useEffect}from'react';
import axios from'axios';

const AuthContext=createContext(null);
const API=process.env.NEXT_PUBLIC_API_URL||'http://localhost:5000/api';

export function AuthProvider({children}){
  const[user,setUser]=useState(null);
  const[loading,setLoading]=useState(true);

  useEffect(()=>{
    const token=typeof window!=='undefined'?localStorage.getItem('userToken'):null;
    if(token){
      axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
      axios.get(`${API}/users/me`,{withCredentials:true})
        .then(r=>setUser(r.data))
        .catch(()=>{localStorage.removeItem('userToken');delete axios.defaults.headers.common['Authorization'];})
        .finally(()=>setLoading(false));
    }else{setLoading(false);}
  },[]);

  const login=(token,userData)=>{
    localStorage.setItem('userToken',token);
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
    setUser(userData);
  };

  const logout=async()=>{
    try{await axios.post(`${API}/users/logout`,{},{withCredentials:true});}catch{}
    localStorage.removeItem('userToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return<AuthContext.Provider value={{user,loading,login,logout,setUser}}>{children}</AuthContext.Provider>;
}

export const useAuth=()=>{
  const ctx=useContext(AuthContext);
  if(!ctx)throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
