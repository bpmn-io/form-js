import { Injector } from 'didi';

export function createInjector(bootstrapModules) {

  const injector = new Injector(bootstrapModules);

  injector.init();

  return injector;
}