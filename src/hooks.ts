import { useUser as _useUser } from 'reactfire';
import { useFirestore, useFirestoreDocData } from 'reactfire';
import { doc } from 'firebase/firestore';
import { useContext, useMemo } from 'react';
import { ConfigContext } from './ConfigContext';

export const useField = <T = any>(path: string, key: string): T => {
  const storage = useFirestore();
  const document = doc(storage, path);
  const { data } = useFirestoreDocData(document);
  return useMemo<T>(() => data?.[key], [data]);
};

export const useDocument = (path: string) => {
  const storage = useFirestore();
  const document = doc(storage, `${path}`);
  const { data } = useFirestoreDocData(document);
  console.error(Object.keys(data || {}), data)
  return { data, pageExists: Object.keys(data || {}).length > 0 };
} 

export const useConfig = () => useContext(ConfigContext);

export const useUser = () => {
  const auth = _useUser();
  return useMemo(() => ({
    user: auth?.data,
    userExists: !!auth?.data?.email,
  }), [auth]);
}