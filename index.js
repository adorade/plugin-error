/*!
 * Plugin Error (v2.0.0): index.js
 * Copyright (c) 2024 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ========================================================================== */

/**
 * @typedef {import('ansi-colors')} Colors
 * @typedef {import('ansi-colors').Style} Style
 */
import colors from 'ansi-colors';
const { cyan, red } = colors;

/**
 * List of properties that should not be enumerated.
 * @type {Set<string>}
 */
const nonEnum = new Set(['message', 'name', 'stack']);

/**
 * Set of properties to be ignored.
 * @type {Set<string>}
 */
const ignored = new Set([
  ...nonEnum,
  '__safety',
  '_stack',
  'plugin',
  'showProperties',
  'showStack',
  'domain',
  'domainEmitter',
  'domainThrown'
]);

/**
 * List of properties to be considered.
 * @type {string[]}
 */
const props = [
  'plugin',
  'name',
  'message',
  'showStack',
  'showProperties',
  'stack',
  'fileName',
  'lineNumber',
  'columnNumber',
  'cause',
  'code'
];

/**
 * PluginError class representing an error in a plugin.
 */
export default class PluginError extends Error {
  /**
   * Creates an instance of PluginError.
   * @param {string|object} plugin - The name of the plugin or an object representing the error.
   * @param {string|Error} message - The error message or an instance of Error.
   * @param {object} [options={}] - Additional options for configuring the error.
   * @returns {PluginError} - An instance of the PluginError class.
   */
  constructor(plugin, message, options) {
    super();

    // Capture the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);

    // Check if the constructor was called without the 'new' keyword.
    if (!(this instanceof PluginError)) {
      // Create and return a new instance of PluginError.
      return new PluginError(plugin, message, options);
    }

    /**
     * Set default options and merge with provided options.
     * @type {object}
     */
    const opts = setDefaults(plugin, message, options);

    // Handle error options.
    this.handleError(opts);

    // Merge options with specific properties.
    this.mergeOptions(props, opts);

    // Validate properties to ensure required ones are present.
    validateProperties(this);
  }

  /**
   * Handle error options and copy specified properties from the error object.
   * @param {object} opts - Options object.
   */
  handleError(opts) {
    /**
     * Check if 'error' property in options is not an object.
     * @type {boolean}
     * @returns {undefined}
     */
    if (typeof opts.error !== 'object') return;

    /**
     * Create a set of keys from the error object and non-enumerable properties.
     * @type {Set<string>}
     */
    const keys = new Set(nonEnum);
    if (opts.error && typeof opts.error === 'object') {
      for (const key of Object.keys(opts.error)) {
        keys.add(key);
      }
    }
    keys.add('cause').add('code');

    /**
     * Copy specified properties from the error options to the current object.
     * @type {string[]}
     */
    keys.forEach(key => {
      this[key] = opts.error[key];
    });
  }

  /**
   * Merge specified properties from options into the current object.
   * @param {string[]} props - List of properties to merge.
   * @param {object} opts - Options object.
   */
  mergeOptions(props, opts) {
    // Iterate over key-value pairs in the options object.
    Object.entries(opts).forEach(([prop, value]) => {
      // Check if the property is included in the specified list.
      if (props.includes(prop)) {
        // Assign the value to the corresponding property.
        this[prop] = value;
      }
    });
  }

  /**
   * Get formatted error details if 'showProperties' is enabled.
   * @returns {string} - Formatted error details.
   */
  formatProperties() {
    /**
     * Check if 'showProperties' is enabled.
     * @type {boolean}
     */
    const showProperties = this.showProperties;
    if (!showProperties) return '';

    /**
     * Filter out ignored properties and format the rest.
     * @type {string[]}
     */
    const properties = Object.keys(this).filter(
      key => !ignored.has(key) && this[key] != null
    );

    /**
     * Check if there are no properties to display.
     * @type {boolean}
     */
    if (properties.length === 0) return '';

    /**
     * Format the properties into a string representation.
     * @type {string}
     */
    const formatted = properties.map(
      prop => `    ${prop}: ${this[prop]}`
    ).join('\n');

    /**
     * Format the error details.
     * @type {string}
     */
    return `\nDetails:\n${formatted}`;
  }

  /**
   * Get formatted stack trace if 'showStack' is enabled.
   * @param {string} stack - Stack trace string.
   * @returns {string} - Formatted stack trace.
   */
  formatStack(stack) {
    /**
     * Check if the stack is available.
     * @type {boolean}
     */
    const hasStack = stack && typeof stack === 'string';

    /**
     * Check if 'showStack' is enabled and the stack is available.
     * @type {boolean}
     */
    const showStack = this.showStack && hasStack;
    if (!showStack) return '';

    /**
     * Further limit the stack trace to remove internal Node.js calls
     * @type {string}
     */
    this.stack = this.stack
      .split('\n')
      .filter(line => !line.includes('node:internal'))
      .join('\n');

    /**
     * Helper function to get the stack trace.
     * @returns {string} - Stack trace.
     */
    const getStack = () => {
      return this._stack || this.stack;
    };

    /**
     * Format the stack details.
     * @type {string}
     */
    return `\nStack:\n    ${getStack()}`;
  }

  /**
   * Convert the error to a string representation.
   * @returns {string} - String representation of the error.
   */
  toString() {
    /**
     * Initialize the error message with the main message.
     * @type {string}
     */
    const message = `${red(this.name)} in plugin "${cyan(this.plugin)}"\nMessage:\n    ${this.message}`;

    /**
     * Get formatted error details.
     * @type {string}
     */
    const properties = this.showProperties ? `${this.formatProperties()}` : '';

    /**
     * Get formatted stack trace.
     * @type {string}
     */
    const stack = this.showStack ? `${this.formatStack(this.stack)}` : '';

    /**
     * Format the final error message.
     * @type {string}
     */
    return `${message}${properties}${stack}`;
  }
}

/**
 * Set default options and merge with provided options.
 * @param {string|object} plugin - The name of the plugin or an object representing the error.
 * @param {string|Error} message - The error message or an instance of Error.
 * @param {object} [opts={}] - Additional options for configuring the error.
 * @returns {object} - Merged options object.
 */
function setDefaults(plugin, message, opts = {}) {
  // Default options.
  const mergedOpts = {
    showStack: false,
    showProperties: true,
    ...opts
  };

  if (typeof plugin === 'object') {
    // If the plugin is an object, return a shallow merge with default options.
    return { ...mergedOpts, ...plugin };
  }

  if (message instanceof Error) {
    // If the message is an instance of Error, set it as the 'error' property in options.
    mergedOpts.error = message;
  } else if (typeof message === 'object') {
    // If the message is an object, merge it with the options.
    Object.assign(mergedOpts, message);
  } else {
    // If the message is a string, set it as the 'message' property in options.
    mergedOpts.message = message;
  }

  // Set the 'plugin' property in options.
  mergedOpts.plugin = plugin;
  return mergedOpts;
}

/**
 * Validate required properties to ensure they are present.
 * @param {object} error - The error object to validate.
 * @throws {Error} - Throws an error if required properties are missing.
 */
function validateProperties(error) {
  if (!error.plugin) {
    throw new Error('Missing plugin name');
  }
  if (!error.message) {
    throw new Error('Missing error message');
  }
}
