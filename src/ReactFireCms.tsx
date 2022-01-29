import React from 'react';
import { createContext, useContext } from 'react';
import { FirebaseAppProvider, DatabaseProvider, AuthProvider, StorageProvider, FirestoreProvider, useFirebaseApp } from 'reactfire';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import './style/index.scss';

import { ParallaxDefinition } from './component/Parallax';
import { ImageTextDefinition } from './component/ImageText';
import { ReactFireCmsConfig } from "./interface/ReactFireCmsConfig"

interface ReactFireCmsProps {
  config: ReactFireCmsConfig;
}

const ConfigContext = createContext(null as unknown as ReactFireCmsConfig);

const mergeConfig = (config: ReactFireCmsConfig) => ({
  ...config,
  components: [
    ...config.components,
    ParallaxDefinition,
    ImageTextDefinition,
  ]
})

const FirebaseProvider: React.FC = ({children}) => {
  const firebaseConfig = useConfig();
  
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig.firebase.config}>
      {children}
    </FirebaseAppProvider>
  )
}

const FirebaseComponents: React.FC = ({children}) => {
  const app = useFirebaseApp();
  const database = getDatabase(app);
  const auth = getAuth(app);
  const store = getStorage(app);
  const firestore = getFirestore(app);

  return (
    <AuthProvider sdk={auth}>
      <DatabaseProvider sdk={database}>
        <StorageProvider sdk={store}>
          <FirestoreProvider sdk={firestore}>
            {children}
          </FirestoreProvider>
        </StorageProvider>
      </DatabaseProvider>
    </AuthProvider>
  )
}

export const useConfig = () => useContext(ConfigContext);

export const ReactFireCms: React.FC<ReactFireCmsProps> = ({config, children}) => {
  return (
    <ConfigContext.Provider value={mergeConfig(config)}>
      <FirebaseProvider>
        <FirebaseComponents>
          {children}
        </FirebaseComponents>
      </FirebaseProvider>
    </ConfigContext.Provider> 
  )
}