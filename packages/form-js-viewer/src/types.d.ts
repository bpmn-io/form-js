import { Injector } from 'didi';

export type Module = any;
export type Schema = any;

export interface Data {
  [x: string]: any;
}

export interface Errors {
  [x: string]: string[];
}

export interface ExpressionLanguage {
  isExpression(value: any): boolean;
  getVariableNames(expression: string, options?: { type?: string }): string[];
  evaluate(expression: string, data?: Data): any;
  evaluateUnaryTest(expression: string, data?: Data): boolean | null;
}

export interface Templating {
  isTemplate(value: any): boolean;
  getVariableNames(template: string): string[];
  evaluate(
    template: string,
    context: Data,
    options?: { debug?: boolean; strict?: boolean; buildDebugString?: Function; sanitizer?: Function },
  ): any;
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
