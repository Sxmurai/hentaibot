import {
  Command,
  CommandOptions,
  Listener,
  ListenerOptions,
  Inhibitor,
  InhibitorOptions,
} from "discord-akairo";

/* Commands */
export const command = (id: string, options: CommandOptions = {}) => {
  options.aliases = options.aliases ?? [];
  options.aliases.unshift(id);

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

export const sub = (id: string, options: CommandOptions = {}) => {
  options.category = "flag";

  return <T extends new (...args: any[]) => Command>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

/* Events */
export const event = (id: string, options?: ListenerOptions) => {
  return <T extends new (...args: any[]) => Listener>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

/* inhibitor shit */
export const inhibitor = (id: string, options: InhibitorOptions = {}) => {
  options.reason = options.reason ?? id;

  return <T extends new (...args: any[]) => Inhibitor>(target: T): T => {
    return class extends target {
      constructor(...args: any[]) {
        super(id, options);
        void args;
      }
    };
  };
};

/* Database Related */
interface ColumnOptions {
  primary?: boolean;
  defaults?: any;
  nullable?: boolean;
}

export const Column = (options: ColumnOptions = {}) => {
  options.primary = options.primary ?? false;
  options.nullable = options.nullable ?? true;

  return (target: any, name: any) => {
    target.constructor.columns =
      target.constructor.columns ?? new Map<string, any>();

    target.constructor.columns.set(name, options);
  };
};
