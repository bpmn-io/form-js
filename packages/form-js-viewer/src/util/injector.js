import { Injector } from 'didi';

export function createInjector(bootstrapModules) {
  const modules = [],
        components = [];

  function hasModule(module) {
    return modules.includes(module);
  }

  function addModule(module) {
    modules.push(module);
  }

  function visit(module) {
    if (hasModule(module)) {
      return;
    }

    (module.__depends__ || []).forEach(visit);

    if (hasModule(module)) {
      return;
    }

    addModule(module);

    (module.__init__ || []).forEach(function(component) {
      components.push(component);
    });
  }

  bootstrapModules.forEach(visit);

  const injector = new Injector(modules);

  components.forEach(function(component) {
    try {
      injector[ typeof component === 'string' ? 'get' : 'invoke' ](component);
    } catch (err) {
      console.error('Failed to instantiate component');
      console.error(err.stack);

      throw err;
    }
  });

  return injector;
}