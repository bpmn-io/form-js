import TestInjectionComponent from './components/TestInjectionComponent';

export default class TestInjection {
  constructor(eventBus, renderInjector) {
    eventBus.once('renderInjector.initialized', 500, () => {
      renderInjector.registerInjectedRenderer('test-injection', TestInjectionComponent);
    });   
  }
}

TestInjection.$inject = [ 'eventBus', 'renderInjector' ];