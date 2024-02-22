import { Injector } from 'didi';

export type Module = any;
export type Schema = any;

export interface FormEditorProperties {
  [x: string]: any;
}

export interface FormEditorOptions {
  additionalModules?: Module[];
  container?: Element | null | string;
  exporter?: {
    name: string;
    version: string;
  };
  injector?: Injector;
  modules?: Module[];
  properties?: FormEditorProperties;
  [x: string]: any;
}

export interface CreateFormEditorOptions extends FormEditorOptions {
  schema?: Schema;
}

export { Injector };
