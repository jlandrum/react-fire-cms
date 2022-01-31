import { FirebaseOptions } from 'firebase/app';
import { ComponentDefinition } from "./ComponentDefinition";

export interface CMSConfig {
  firebase: {
    config: FirebaseOptions,
    storage: {
      bucket: string;
    }
  }
  components: ComponentDefinition[]
}

