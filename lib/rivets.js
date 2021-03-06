// Generated by CoffeeScript 1.3.1
(function() {
  var attributeBinding, bidirectionals, bindings, getInputValue, registerBinding, rivets, stateBinding,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  registerBinding = function(el, adapter, type, context, keypath) {
    var bind;
    bind = bindings[type] || attributeBinding(type);
    bind(el, adapter.read(context, keypath));
    adapter.subscribe(context, keypath, function(value) {
      return bind(el, value);
    });
    if (__indexOf.call(bidirectionals, type) >= 0) {
      return el.addEventListener('change', function() {
        return adapter.publish(context, keypath, getInputValue(this));
      });
    }
  };

  getInputValue = function(el) {
    switch (el.type) {
      case 'text':
      case 'textarea':
      case 'password':
      case 'select-one':
        return el.value;
      case 'checkbox':
      case 'radio':
        return el.checked;
    }
  };

  attributeBinding = function(attr) {
    return function(el, value) {
      if (value) {
        return el.setAttribute(attr, value);
      } else {
        return el.removeAttribute(attr);
      }
    };
  };

  stateBinding = function(attr, inverse) {
    if (inverse == null) {
      inverse = false;
    }
    return function(el, value) {
      return attributeBinding(attr)(el, inverse === !value ? attr : false);
    };
  };

  bindings = {
    checked: stateBinding('checked'),
    selected: stateBinding('selected'),
    disabled: stateBinding('disabled'),
    unchecked: stateBinding('checked', true),
    unselected: stateBinding('selected', true),
    enabled: stateBinding('disabled', true),
    text: function(el, value) {
      return el.innerText = value || '';
    },
    html: function(el, value) {
      return el.innerHTML = value || '';
    },
    value: function(el, value) {
      return el.value = value;
    },
    show: function(el, value) {
      return el.style.display = value ? '' : 'none';
    },
    hide: function(el, value) {
      return el.style.display = value ? 'none' : '';
    }
  };

  bidirectionals = ['value', 'checked', 'unchecked', 'selected', 'unselected'];

  rivets = {
    bind: function(el, adapter, contexts) {
      var attribute, context, keypath, node, path, type, _i, _len, _ref, _results;
      if (contexts == null) {
        contexts = {};
      }
      _ref = el.getElementsByTagName('*');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        node = _ref[_i];
        _results.push((function() {
          var _j, _len1, _ref1, _results1;
          _ref1 = node.attributes;
          _results1 = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            attribute = _ref1[_j];
            if (/^data-/.test(attribute.name)) {
              type = attribute.name.replace('data-', '');
              path = attribute.value.split('.');
              context = path.shift();
              keypath = path.join('.');
              _results1.push(registerBinding(node, adapter, type, contexts[context], keypath));
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
    }
  };

  if (typeof module !== "undefined" && module !== null) {
    module.exports = rivets;
  } else {
    this.rivets = rivets;
  }

}).call(this);
