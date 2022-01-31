export declare const useField: <T = any>(path: string, key: string) => T;
export declare const useDocument: (path: string) => {
    data: import("@firebase/firestore").DocumentData;
    pageExists: boolean;
};
export declare const useConfig: () => import("./interface").CMSConfig;
export declare const useUser: () => {
    user: import("@firebase/auth").User | null;
    userExists: boolean;
};
