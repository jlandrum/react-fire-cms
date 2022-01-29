import { FirebaseOptions } from 'firebase/app';
import { ComponentDefinition } from "./ComponentDefinition";

export interface ReactFireCmsConfig {
  firebase: {
    config: FirebaseOptions,
    storage: {
      bucket: string;
    }
  }
  components: ComponentDefinition[]
}