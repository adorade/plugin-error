/*!
 * Plugin Error (v1.0.0): test/index.test.js
 * Copyright (c) 2024 Adorade (https://adorade.ro)
 * Licensed under MIT
 * ========================================================================== */

import { Duplex } from 'node:stream';
import domain from 'node:domain';
import PluginError from '../index.js';

describe('PluginError Test', () => {
  describe('Default', () => {
    test('should be defined', (done) => {
      expect(PluginError).toBeDefined();
      done();
    });
    test('should be a function', (done) => {
      expect(PluginError).toBeInstanceOf(Function);
      done();
    });
    test('should default error name to Error', (done) => {
      expect(new PluginError('test', 'something broke').name).toBe('Error');
      done();
    });
    test('should default error name to Error, when wrapped error has no name', (done) => {
      expect(new PluginError('test', { message: 'something broke' }).name).toBe('Error');
      done();
    });
    test('should not be constructed without new', (done) => {
      expect(() => {
        PluginError('test', 'something broke');
      }).toThrow(/Class constructor PluginError cannot be invoked without 'new'/);
      done();
    });
    test('should be constructed with new', (done) => {
      expect(new PluginError('test', 'something broke') instanceof PluginError).toBe(true);
      done();
    });
    test('should throw if plugin name not set', (done) => {
      expect(() => {
        new PluginError(null, 'something broke');
      }).toThrow(/Missing plugin name/);
      done();
    });
    test('should default plugin name to test', (done) => {
      expect(new PluginError('test', 'something broke').plugin).toBe('test');
      done();
    });
    test('should throw if plugin message not set', (done) => {
      expect(() => {
        new PluginError('test', null);
      }).toThrow(/Missing error message/);
      done();
    });
    test('should default plugin message to something broke', (done) => {
      expect(new PluginError('test', 'something broke').message).toBe('something broke');
      done();
    });
    test('should default toString to not include stack', (done) => {
      expect(new PluginError('test', 'something broke').toString()).not.toContain('at');
      done();
    });
  });
  describe('Configuration', () => {
    test('should be configured to hide showStack by default', (done) => {
      expect(new PluginError('test', 'something broke').showStack).toBe(false);
      done();
    });
    test('should be configurable to hide showStack', (done) => {
      expect(new PluginError('test', 'something broke', { showStack: false }).showStack).toBe(false);
      done();
    });
    test('should be configurable to show showStack', (done) => {
      expect(new PluginError('test', 'something broke', { showStack: true }).showStack).toBe(true);
      done();
    });
    test('should be configured to show properties by default', (done) => {
      expect(new PluginError('test', 'something broke').showProperties).toBe(true);
      done();
    });
    test('should be configurable to hide properties', (done) => {
      expect(new PluginError('test', 'something broke', { showProperties: false }).showProperties).toBe(false);
      done();
    });
    test('should be configurable to show properties', (done) => {
      expect(new PluginError('test', 'something broke', { showProperties: true }).showProperties).toBe(true);
      done();
    });
    test('should be configurable to show properties and stack', (done) => {
      expect(new PluginError('test', 'something broke', { showProperties: true, showStack: true }).showProperties).toBe(true);
      expect(new PluginError('test', 'something broke', { showProperties: true, showStack: true }).showStack).toBe(true);
      done();
    });
    test('should be configurable to hide properties and stack', (done) => {
      expect(new PluginError('test', 'something broke', { showProperties: false, showStack: false }).showProperties).toBe(false);
      expect(new PluginError('test', 'something broke', { showProperties: false, showStack: false }).showStack).toBe(false);
      done();
    });
  });
  describe('Show/Hide', () => {
    test('should include the stack when specified in toString', (done) => {
      expect(new PluginError('test', 'something broke', {
        stack: 'at huh',
        showStack: true
      }).toString()).toContain('at');
      done();
    });
    test('should remove internal Node.js calls from stack trace', (done) => {
      expect(new PluginError('test', 'something broke', {
        stack: 'node:internal',
        showStack: true
      }).toString()).not.toContain('node:internal');
      done();
    });
    test('should show properties', (done) => {
      const err = new PluginError('test', 'something broke', { showProperties: true });
      err.fileName = 'original.js';
      err.lineNumber = 35;
      err.columnNumber = 12;
      err.cause = 'this is cause';
      err.code = 'ERR_CODE';

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/original\.js/);
      expect(err.toString()).toMatch(/35/);
      expect(err.toString()).toMatch(/12/);
      expect(err.toString()).toMatch(/this is cause/);
      expect(err.toString()).toMatch(/ERR_CODE/);

      done();
    });
    test('should not show additional properties', (done) => {
      const err = new PluginError('test', 'something broke', {
        showProperties: true,
        fileName: 'original.js',
        lineNumber: 35,
        columnNumber: 12,
        cause: 'this is cause',
        code: 'ERR_CODE',
        additionalProperty: 'additional',
        additionalMethod: function () {}
      });

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/original\.js/);
      expect(err.toString()).toMatch(/35/);
      expect(err.toString()).toMatch(/12/);
      expect(err.toString()).toMatch(/this is cause/);
      expect(err.toString()).toMatch(/ERR_CODE/);
      expect(err.toString()).not.toMatch(/additionalProperty/);
      expect(err.toString()).not.toMatch(/additionalMethod/);

      done();
    });
    test('should not show properties', (done) => {
      const realErr = new Error('something broke');
      realErr.fileName = 'original.js';
      realErr.lineNumber = 35;
      realErr.columnNumber = 12;
      realErr.abstractProperty = 'abstract';
      realErr.abstractMethod = function () {};

      const err = new PluginError('test', realErr, { showProperties: false });

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).not.toMatch(/original\.js/);
      expect(err.toString()).not.toMatch(/35/);
      expect(err.toString()).not.toMatch(/12/);
      expect(err.toString()).not.toMatch(/abstractProperty/);
      expect(err.toString()).not.toMatch(/abstractMethod/);

      done();
    });
    test('should not show properties, but should show stack', (done) => {
      const err = new PluginError('test', 'something broke', {
        stack: 'test stack',
        showStack: true,
        showProperties: false
      });
      err.fileName = 'original.js';
      err.lineNumber = 35;
      err.columnNumber = 12;
      err.abstractProperty = 'abstract';
      err.abstractMethod = function () {};

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/test stack/);
      expect(err.toString()).not.toMatch(/original\.js/);
      expect(err.toString()).not.toMatch(/35/);
      expect(err.toString()).not.toMatch(/12/);
      expect(err.toString()).not.toMatch(/abstractProperty/);
      expect(err.toString()).not.toMatch(/abstractMethod/);

      done();
    });
    test('should not show properties, but should show stack for real error', (done) => {
      const realErr = new Error('something broke');
      realErr.fileName = 'original.js';
      realErr.lineNumber = 35;
      realErr.columnNumber = 12;
      realErr.stack = 'test stack';
      realErr.abstractProperty = 'abstract';
      realErr.abstractMethod = function () {};

      const err = new PluginError('test', realErr, {
        showStack: true,
        showProperties: false
      });

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/test stack/);
      expect(err.toString()).not.toMatch(/original\.js/);
      expect(err.toString()).not.toMatch(/35/);
      expect(err.toString()).not.toMatch(/12/);
      expect(err.toString()).not.toMatch(/abstractProperty/);
      expect(err.toString()).not.toMatch(/abstractMethod/);

      done();
    });
    test('should not show properties, but should show stack for _stack', (done) => {
      const realErr = new Error('something broke');
      realErr.fileName = 'original.js';
      realErr.lineNumber = 35;
      realErr.columnNumber = 12;
      realErr._stack = 'test stack';

      const err = new PluginError('test', realErr, {
        showStack: true,
        showProperties: false
      });

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/test stack/);
      expect(err.toString()).not.toMatch(/original\.js/);
      expect(err.toString()).not.toMatch(/35/);
      expect(err.toString()).not.toMatch(/12/);

      done();
    });
    test('should show properties and stack', (done) => {
      const realErr = new Error('something broke');
      realErr.fileName = 'original.js';
      realErr.stack = 'test stack';

      const err = new PluginError('test', realErr, { showStack: true });

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/Message:/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/Details:/);
      expect(err.toString()).toMatch(/original\.js/);
      expect(err.toString()).toMatch(/Stack:/);
      expect(err.toString()).toMatch(/test stack/);

      done();
    });
    test('should show properties added after the error is created', (done) => {
      const err = new PluginError('test', 'something broke');
      err.fileName = 'original.js';

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/Message:/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).toMatch(/Details:/);
      expect(err.toString()).toMatch(/fileName:/);
      expect(err.toString()).toMatch(/original\.js/);

      done();
    });
    test('should show properties added after the error is created, but not stack', (done) => {
      const err = new PluginError('test', 'something broke', { showStack: false });
      err.fileName = 'original.js';

      expect(err.toString()).toMatch(/Message:/);
      expect(err.toString()).toMatch(/fileName:/);
      expect(err.toString()).not.toMatch(/Stack:/);

      done();
    });
    test('should toString quickly', (done) => {
      const start = new Date();
      const err = new PluginError('test', 'something broke', { showStack: true });
      err.toString();
      const end = new Date();
      const diff = end - start;

      expect(diff).toBeLessThan(10);

      done();
    });
    test('should not show "Details:" if there are no properties to show', (done) => {
      const err = new PluginError('test', 'something broke');

      expect(err.toString()).toMatch(/test/);
      expect(err.toString()).toMatch(/Message:/);
      expect(err.toString()).toMatch(/something broke/);
      expect(err.toString()).not.toMatch(/Details:/);

      done();
    });
    test('should not show additional properties added by a domain', (done) => {
      const stream = new Duplex({ objectMode: true });
      const d = domain.create();

      d.add(stream);
      d.on('error', (err) => {
        expect(err).toBeInstanceOf(PluginError);
        expect(err.toString()).not.toContain('domain');
        done();
      });

      stream.emit('error', new PluginError('plugin', 'message'));
    });
    test('should take properties from error', (done) => {
      const realErr = new Error('something broke');
      realErr.fileName = 'original.js';
      realErr.lineNumber = 35;
      realErr.columnNumber = 12;

      const err = new PluginError('test', realErr);

      expect(err.fileName).toBe('original.js');
      expect(err.lineNumber).toBe(35);
      expect(err.columnNumber).toBe(12);

      done();
    });
  });
  describe('Arguments', () => {
    test('should take arguments as one object', (done) => {
      const err = new PluginError('test', { message: 'something broke' });
      expect(err.message).toBe('something broke');
      done();
    });
    test('should take arguments as plugin name and one object', (done) => {
      const err = new PluginError('test', { message: 'something broke' });
      expect(err.plugin).toBe('test');
      expect(err.message).toBe('something broke');
      done();
    });
    test('should take arguments as plugin name and message', (done) => {
      const err = new PluginError('test', 'something broke');
      expect(err.plugin).toBe('test');
      expect(err.message).toBe('something broke');
      done();
    });
    test('should take arguments as plugin name, message and one object', (done) => {
      const err = new PluginError('test', 'something broke', { showStack: true });

      expect(err.plugin).toBe('test');
      expect(err.message).toBe('something broke');
      expect(err.showStack).toBe(true);

      done();
    });
    test('should take arguments as plugin name, message, one object and stack', (done) => {
      const err = new PluginError('test', 'something broke', {
        showStack: true,
        stack: 'at huh'
      });

      expect(err.plugin).toBe('test');
      expect(err.message).toBe('something broke');
      expect(err.showStack).toBe(true);
      expect(err.stack).toBe('at huh');

      done();
    });
    test('should take arguments as plugin name, error, and one object', (done) => {
      const realErr = new Error('something broke');
      realErr.fileName = 'original.js';
      const err = new PluginError('test', realErr, {
        showStack: true,
        fileName: 'override.js'
      });

      expect(err.plugin).toBe('test');
      expect(err.message).toBe('something broke');
      expect(err.showStack).toBe(true);
      expect(err.fileName).toBe('override.js');
      expect(err.stack).toBe(realErr.stack);

      done();
    });
  });
  describe('Not modify argument', () => {
    test('should not modify error argument', (done) => {
      const realErr = { message: 'something broke' };
      new PluginError('test', realErr);
      expect(realErr).toEqual({ message: 'something broke' });
      done();
    });
    test('should not modify plugin argument', (done) => {
      const realPlugin = 'test';
      new PluginError(realPlugin, 'something broke');
      expect(realPlugin).toEqual('test');
      done();
    });
    test('should not modify message argument', (done) => {
      const realMessage = 'something broke';
      new PluginError('test', realMessage);
      expect(realMessage).toEqual('something broke');
      done();
    });
    test('should not modify options argument', (done) => {
      const realOptions = { showProperties: true };
      new PluginError('test', 'something broke', realOptions);
      expect(realOptions).toEqual({ showProperties: true });
      done();
    });
    test('should not modify stack argument', (done) => {
      const realStack = 'test stack';
      new PluginError('test', 'something broke', { stack: realStack });
      expect(realStack).toEqual('test stack');
      done();
    });
  });
});
