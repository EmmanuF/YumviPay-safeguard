
import React, { createContext } from 'react';
import { AuthContextType } from './types';

// Create the context with initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
