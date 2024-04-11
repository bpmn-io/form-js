import { Injector } from 'didi';

export type Module = any;
export type Schema = any;

export interface Data {
  [x: string]: any;
}

export interface Errors {
  [x: string]: string[];
}

export type FormProperty = 'readOnly' | 'disabled' | string;
export type FormEvent = 'submit' | 'changed' | string;

export interface FormProperties {
  [x: string]: any;
}

export interface FormOptions {
  additionalModules?: Module[];
  container?: Element | null | string;
  injector?: Injector;
  modules?: Module[];
  properties?: FormProperties;
}

export interface CreateFormOptions extends FormOptions {
  data?: Data;
  schema: Schema;
}

export { Injector };
