import { createContext, useContext } from 'react';
import { CMSConfig } from './interface/CMSConfig';

export const ConfigContext = createContext(null as unknown as CMSConfig);

export const useConfig = () => useContext(ConfigContext);
