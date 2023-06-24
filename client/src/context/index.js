import {createContext} from "react";
import {config} from "../cfg/config.js";


export const AuthContext = createContext(null);

export const BackAddr = createContext(config.backend_addr);