import type { AxiosInstance } from "axios";
import axios from "axios";
import {createContext,useEffect,useState,useContext,type ReactNode} from "react";

interface User{
    id:string;
    name:string;
    email :string;
    plan : string;
    analysisCount?: number;
}

interface AppContextType{
    user:User | null;
    token :string | null;
    loading : boolean;
    api : AxiosInstance;
    login:(email:string,password:string)=> Promise<{success:boolean; message?:string}>;
    register:(name:string,email:string,password:string)=> Promise<{success:boolean; message?:string}>;
    logout:() => void;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"

const AppContext = createContext<AppContextType | undefined>(undefined) 

export function  AppProvider({children}:{children:ReactNode}){

    const [user,setuser] = useState<User | null>(null)
    const [token,setToken] = useState<string | null>(localStorage.getItem("token"))
    const [loading,setloading] = useState(true);

    //Axion instance with auth header
    const api = axios.create({
        baseURL : BACKEND_URL,
    })

    //UPDATE AXIONS HEADERS when token changes
    api.interceptors.request.use((config)=>{
        const token = localStorage.getItem("token")
        if(token){
            config.headers.Authorization =`Bearer ${token}`
        }
        return config;
    })

    const loadUser = async()=>{
         if(!token){
            setloading(false)
            return;
         }

         try{
            const {data} = await api.get('/api/auth/user')

            if(data.success){
                setuser(data.user)
            }

         }catch(error){

            localStorage.removeItem("token");
            setToken(null)
            setuser(null)

         }

         setloading(false)
    }

    useEffect(()=>{
       loadUser()
    },[])

    const login  = async(email:string,password:string )=>{

        try{

            const {data} = await api.post('/api/auth/login',{
                email,
                password
            })

            if(data.success){

                localStorage.setItem("token",data.token)

                setToken(data.token)
                setuser(data.user)

                return {success:true}
            }

            return {success:false,message:data.message}

        }catch(error:any){

            return {
                success:false,message:error.response?.data?.message || "Login failed"}
            }
        }
    

    const register = async(name:string,email:string,password:string)=>{

        try{

            const {data} = await api.post('/api/auth/register',{
                name,
                email,
                password
            })

            if(data.success){

                localStorage.setItem("token",data.token)

                setToken(data.token)
                setuser(data.user)

                return {success:true}
            }

            return {success:false,message:data.message}

        }catch(error:any){

            return {
                success:false,
                message:error.response?.data?.message
            }
        }
    }

    const logout = ()=>{

        localStorage.removeItem("token")
        setToken(null)
        setuser(null)
    }

    const value ={user,token,loading,api,login,register,logout}

    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

 export function useApp(){

    const context = useContext(AppContext)

    if(!context) throw new Error("useapp must be used within Appprovider");

    return context
 }