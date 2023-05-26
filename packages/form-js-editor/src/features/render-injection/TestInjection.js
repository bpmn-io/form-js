import TestInjectionComponent from './components/TestInjectionComponent';

export default class TestInjection {
  constructor(eventBus) {
    eventBus.once('renderInjector.initialized', 500, () => {
      eventBus.fire('renderInjector.registerRenderer', {
        identifier: 'test-injection',
        Renderer: TestInjectionComponent
      });
    });
  }
}

TestInjection.$inject = [ 'eventBus' ];