import { Injector } from 'didi';

export type Module = any;
export type Schema = any;

export type ComponentTypes =
  'checkbox'|
  'number'|
  'radio'|
  'select'|
  'textfield'|
  'text' |
  'button'

export type ComponentActions = 'readonly'|'remove'|'allow'

export interface FormEditorProperties {
  [x: string]: any
}

export interface FormEditorOptions {
  additionalModules?: Module[];
  container?: Element | null | string;
  exporter?: {
    name: string,
    version: string
  };
  injector?: Injector;
  modules?: Module[];
  properties?: FormEditorProperties;
  availableComponentTypes?: ComponentTypes[];
  unavailableComponentAction?: ComponentActions,
  [x:string]: any;
}

export interface CreateFormEditorOptions extends FormEditorOptions {
  schema?: Schema
}

export {
  Injector
};