import React from 'react';
import './style/index.scss';
import { ReactFireCmsConfig } from "./interface/ReactFireCmsConfig";
interface ReactFireCmsProps {
    config: ReactFireCmsConfig;
}
export declare const useConfig: () => ReactFireCmsConfig;
export declare const ReactFireCms: React.FC<ReactFireCmsProps>;
export {};
