import { evaluate } from 'feelin';
import { get } from 'min-dash';

const EXPRESSION_PROPERTIES = ['key', 'conditional.hide'];

class Core {
  initialContext = null;
  context = null;
  schema = null;
  subscribers = new Map();

  constructor(options = {}) {
    const { context = {}, schema } = options;

    if (!schema || !Array.isArray(schema?.components)) {
      throw new Error('Invalid schema');
    }

    const parsedSchema = schema.components.reduce((acc, component) => {
      const { id, value } = component;

      return { ...acc, [id]: value };
    }, {});

    this.initialContext = context;
    this.context = {
      ...context,
      ...parsedSchema,
    };
    this.schema = schema;
  }

  parseSchema(schema, context) {
    const components = [];

    schema.components.forEach((component) => {
      const { type, key, ...rest } = component;
      const hideProperty = get(component, ['conditional', 'hide']);

      if (hideProperty !== undefined && evaluate(hideProperty.replace(/^=/, ''), context)) {
        return;
      }

      if (type === 'textfield') {
        components.push({
          type,
          key,
          value: evaluate(key, context),
          ...rest,
        });
      }

      if (type === 'checkbox') {
        components.push({
          type,
          key,
          value: evaluate(key, context),
          ...rest,
        });
      }
    });

    return components;
  }

  subscribe(fieldPath, callback) {
    const field = get(this.schema.components, fieldPath);

    if (!field) {
      throw new Error(`Field ${fieldPath} not found`);
    }

    if (!this.subscribers.has(fieldPath)) {
      this.subscribers.set(fieldPath, []);
    }

    this.subscribers.get(fieldPath).push(callback);
  }

  unsubscribe(fieldPath, callback) {
    const field = get(this.schema.components, fieldPath);

    if (!field) {
      throw new Error(`Field ${fieldPath} not found`);
    }

    if (!this.subscribers.has(fieldPath)) {
      return;
    }

    const subscribers = this.subscribers.get(fieldPath);

    subscribers.splice(subscribers.indexOf(callback), 1);
  }

  change(fieldPath, value) {
    const field = get(this.schema.components, fieldPath);

    if (!field) {
      throw new Error(`Field ${fieldPath} not found`);
    }

    field.value = value;

    this.subscribers.forEach((subscribers, fieldPath) => {
      if (fieldPath === [field.id].toString()) {
        console.log('called', fieldPath);
        subscribers.forEach((callback) => {
          callback(field);
        });
      }
    });
  }
}

export { Core };
