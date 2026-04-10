'use strict';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var _require = require('lodash'),
    debounce = _require.debounce;

var blessed = require('blessed');
var ReactFiberReconciler = require('react-reconciler');

var injectIntoDevToolsConfig = require('./devtools');
var eventListener = require('./events');
var update = require('../shared/update').default;
var solveClass = require('../shared/solveClass').default;
/*
const {
  injectInternals
} = require('react-dom/lib/ReactFiberDevToolsHook');
*/

var emptyObject = {};

var BlessedReconciler = ReactFiberReconciler({
  getRootHostContext: function getRootHostContext(rootContainerInstance) {
    return emptyObject;
  },
  getChildHostContext: function getChildHostContext(parentHostContext, type) {
    return emptyObject;
  },
  getPublicInstance: function getPublicInstance(instance) {
    return instance;
  },
  createInstance: function createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    var _solveClass = solveClass(props),
        children = _solveClass.children,
        appliedProps = _objectWithoutProperties(_solveClass, ['children']);

    var instance = blessed[type](appliedProps);
    instance.props = props;
    instance._eventListener = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return eventListener.apply(undefined, [instance].concat(args));
    };
    instance.on('event', instance._eventListener);

    return instance;
  },
  appendInitialChild: function appendInitialChild(parentInstance, child) {
    parentInstance.append(child);
  },
  finalizeInitialChildren: function finalizeInitialChildren(instance, type, props, rootContainerInstance) {
    var _solveClass2 = solveClass(props),
        children = _solveClass2.children,
        appliedProps = _objectWithoutProperties(_solveClass2, ['children']);

    update(instance, appliedProps);
    instance.props = props;
    return false;
  },
  prepareUpdate: function prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
    return solveClass(newProps);
  },
  shouldSetTextContent: function shouldSetTextContent(props) {
    return false;
  },
  shouldDeprioritizeSubtree: function shouldDeprioritizeSubtree(type, props) {
    return !!props.hidden;
  },


  now: Date.now,

  createTextInstance: function createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
    return blessed.text({ content: text });
  },
  scheduleDeferredCallback: function scheduleDeferredCallback(a) {
    throw new Error('Unimplemented');
  },
  prepareForCommit: function prepareForCommit() {
    // noop
  },
  resetAfterCommit: function resetAfterCommit() {
    // noop
  },


  mutation: {
    commitMount: function commitMount(instance, type, newProps, internalInstanceHandle) {
      throw new Error('commitMount not implemented. Please post a reproducible use case that calls this method at https://github.com/Yomguithereal/react-blessed/issues/new');
      instance.screen.debouncedRender();
      // noop
    },
    commitUpdate: function commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
      instance._updating = true;
      update(instance, updatePayload);
      // update event handler pointers
      instance.props = newProps;
      instance._updating = false;
      instance.screen.debouncedRender();
    },
    commitTextUpdate: function commitTextUpdate(textInstance, oldText, newText) {
      textInstance.setContent(newText);
      textInstance.screen.debouncedRender();
    },
    appendChild: function appendChild(parentInstance, child) {
      parentInstance.append(child);
    },
    appendChildToContainer: function appendChildToContainer(parentInstance, child) {
      parentInstance.append(child);
    },
    insertBefore: function insertBefore(parentInstance, child, beforeChild) {
      // pretty sure everything is absolutely positioned so insertBefore ~= append
      parentInstance.append(child);
    },
    insertInContainerBefore: function insertInContainerBefore(parentInstance, child, beforeChild) {
      // pretty sure everything is absolutely positioned so insertBefore ~= append
      parentInstance.append(child);
    },
    removeChild: function removeChild(parentInstance, child) {
      parentInstance.remove(child);
      child.off('event', child._eventListener);
      child.destroy();
    },
    removeChildFromContainer: function removeChildFromContainer(parentInstance, child) {
      parentInstance.remove(child);
      child.off('event', child._eventListener);
      child.destroy();
    },
    resetTextContent: function resetTextContent(instance) {
      instance.setContent('');
    }
  },

  useSyncScheduling: true
});

BlessedReconciler.injectIntoDevTools(injectIntoDevToolsConfig);

module.exports = {
  render: function render(element, screen, callback) {
    var root = roots.get(screen);
    if (!root) {
      root = BlessedReconciler.createContainer(screen);
      roots.set(screen, root);
    }

    // render at most every 16ms. Should sync this with the screen refresh rate
    // probably if possible
    screen.debouncedRender = debounce(function () {
      return screen.render();
    }, 16);
    BlessedReconciler.updateContainer(element, root, null, callback);
    screen.debouncedRender();
    return BlessedReconciler.getPublicRootInstance(root);
  }
};

var roots = new Map();