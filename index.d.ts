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
    constructor(plugin: string | object, message: string | Error, options?: object): PluginError;
    /**
     * Handle error options and copy specified properties from the error object.
     * @param {object} opts - Options object.
     */
    handleError(opts: object): void;
    /**
     * Merge specified properties from options into the current object.
     * @param {string[]} props - List of properties to merge.
     * @param {object} opts - Options object.
     */
    mergeOptions(props: string[], opts: object): void;
    /**
     * Get formatted error details if 'showProperties' is enabled.
     * @returns {string} - Formatted error details.
     */
    formatProperties(): string;
    /**
     * Get formatted stack trace if 'showStack' is enabled.
     * @param {string} stack - Stack trace string.
     * @returns {string} - Formatted stack trace.
     */
    formatStack(stack: string): string;
}
export type Colors = typeof import("ansi-colors");
export type Style = import("ansi-colors").Style;
