'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var reactfire = require('reactfire');
var auth = require('firebase/auth');
var database = require('firebase/database');
var storage = require('firebase/storage');
var firestore = require('firebase/firestore');
var io5 = require('react-icons/io5');
require('react-draft-wysiwyg/dist/react-draft-wysiwyg.css');
var reactHotkeysHook = require('react-hotkeys-hook');
var fa = require('react-icons/fa');
var draftJs = require('draft-js');
var reactDraftWysiwyg = require('react-draft-wysiwyg');
var draftToHtml = _interopDefault(require('draftjs-to-html'));
var htmlToDraft = _interopDefault(require('html-to-draftjs'));

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var Dialog = function Dialog(_ref) {
  var title = _ref.title,
      open = _ref.open,
      children = _ref.children,
      buttons = _ref.buttons,
      onClose = _ref.onClose;
  return open ? React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    className: 'RFCMS__AntiClick'
  }), React__default.createElement("div", {
    className: 'RFCMS__Dialog'
  }, React__default.createElement("div", {
    className: 'RFCMS__Dialog__Header'
  }, title, onClose && React__default.createElement(io5.IoCloseSharp, {
    onClick: onClose,
    className: 'RFCMS__Dialog__Close'
  })), React__default.createElement("div", {
    className: 'RFCMS__Dialog__Content'
  }, children), buttons && React__default.createElement("div", {
    className: 'RFCMS__Dialog__Buttons'
  }, buttons == null ? void 0 : buttons.map(function (it) {
    return React__default.createElement("div", {
      key: it.label,
      className: 'RFCMS__Dialog__Buttons__Button' + " " + (it.disabled && 'RFCMS__Dialog__Buttons__Button--disabled') + " " + ("RFCMS__Dialog__Buttons__Button--" + it.type),
      onClick: function onClick() {
        if (!it.disabled) {
          it.action();
        }
      }
    }, it.label);
  })))) : null;
};

var ConfigContext = /*#__PURE__*/React.createContext(null);

var useField = function useField(path, key) {
  var storage = reactfire.useFirestore();
  var document = firestore.doc(storage, path);

  var _useFirestoreDocData = reactfire.useFirestoreDocData(document),
      data = _useFirestoreDocData.data;

  return React.useMemo(function () {
    return data == null ? void 0 : data[key];
  }, [data]);
};
var useDocument = function useDocument(path) {
  var storage = reactfire.useFirestore();
  var document = firestore.doc(storage, "" + path);

  var _useFirestoreDocData2 = reactfire.useFirestoreDocData(document),
      data = _useFirestoreDocData2.data;

  console.error(Object.keys(data || {}), data);
  return {
    data: data,
    pageExists: Object.keys(data || {}).length > 0
  };
};
var useConfig = function useConfig() {
  return React.useContext(ConfigContext);
};
var useUser = function useUser() {
  var auth = reactfire.useUser();

  return React.useMemo(function () {
    var _auth$data;

    return {
      user: auth == null ? void 0 : auth.data,
      userExists: !!(auth != null && (_auth$data = auth.data) != null && _auth$data.email)
    };
  }, [auth]);
};

var FirebaseImage = function FirebaseImage(props) {
  var image = props.image,
      selected = props.selected,
      onSelect = props.onSelect;

  var _useState = React.useState(''),
      url = _useState[0],
      setUrl = _useState[1];

  React.useEffect(function () {
    if (!image) return;
    storage.getDownloadURL(image).then(setUrl)["catch"](console.error);
  }, [image]);
  return React__default.createElement("div", {
    onClick: function onClick() {
      return onSelect(url);
    },
    className: "RFCMS__MediaSelector__Item " + (selected && 'RFCMS__MediaSelector__Item--Selected')
  }, React__default.createElement("img", {
    src: url,
    alt: image == null ? void 0 : image.name,
    className: "RFCMS__MediaSelector__Item__Image"
  }), React__default.createElement("span", {
    className: "RFCMS__MediaSelector__Item__Text"
  }, image == null ? void 0 : image.name));
};

var MediaSelector = function MediaSelector(_ref) {
  var onSelect = _ref.onSelect;
  var config = useConfig();

  var _useState2 = React.useState(''),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = React.useState(false),
      open = _useState3[0],
      setOpen = _useState3[1];

  var _useState4 = React.useState([]),
      items = _useState4[0],
      setItems = _useState4[1];

  var _useState5 = React.useState(-1),
      selection = _useState5[0],
      setSelection = _useState5[1];

  var _useState6 = React.useState(''),
      url = _useState6[0],
      setUrl = _useState6[1];

  var storage$1 = reactfire.useStorage();
  var showDialog = React.useCallback(function (e) {
    e.preventDefault();
    setOpen(true);
  }, [setOpen]);
  React.useEffect(function () {
    if (!open) return;
    storage.listAll(storage.ref(storage$1, config.firebase.storage.bucket)).then(function (r) {
      setItems(r.items);
    })["catch"](function (e) {
      return setError(e);
    });
  }, [storage$1, open]);
  var buttons = React.useMemo(function () {
    return [{
      label: 'Cancel',
      action: function action() {
        return setOpen(false);
      }
    }, {
      label: 'Upload',
      action: function action() {}
    }, {
      label: 'Select',
      action: function action() {
        onSelect(url);
        setOpen(false);
      },
      disabled: selection === -1
    }];
  }, [onSelect, selection, url]);
  return React__default.createElement("div", null, React__default.createElement("button", {
    onClick: showDialog
  }, "Select Image"), open && React__default.createElement(Dialog, {
    buttons: buttons,
    title: "Media Gallery",
    open: open,
    onClose: function onClose() {
      return setOpen(false);
    }
  }, error && React__default.createElement("span", {
    className: "RFCMS__TextStyles__Error"
  }, error), React__default.createElement("div", {
    className: "RFCMS__MediaSelector__Grid"
  }, items.map(function (item, index) {
    return React__default.createElement(FirebaseImage, {
      onSelect: function onSelect(url) {
        setSelection(index);
        setUrl(url);
      },
      selected: index === selection,
      image: item
    });
  }))));
};

var ImageEditor = function ImageEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  return React__default.createElement("div", {
    className: "RFCMS__Editable__Dialog__Image"
  }, React__default.createElement("input", {
    onChange: function onChange(e) {
      return onUpdate(e.target.value);
    },
    value: value
  }), React__default.createElement(MediaSelector, {
    onSelect: onUpdate
  }));
};

var NumberEditor = function NumberEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("input", {
    type: 'number',
    onChange: function onChange(e) {
      return onUpdate(e.target.value);
    },
    value: value
  }));
};

var Parallax = function Parallax(_ref) {
  var src = _ref.src,
      zoom = _ref.zoom;
  var ref = React.createRef();

  var _useState = React.useState(-1),
      offset = _useState[0],
      setOffset = _useState[1];

  var scrollHandler = React.useCallback(function () {
    var _ref$current, _ref$current$getBound;

    var offset = ((_ref$current = ref.current) == null ? void 0 : (_ref$current$getBound = _ref$current.getBoundingClientRect()) == null ? void 0 : _ref$current$getBound.top) || 0;
    var percent = offset / window.innerHeight / 2;
    setOffset(percent - 1);
  }, [ref]);
  React.useEffect(function () {
    window.addEventListener('scroll', scrollHandler);
    return function () {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);
  return React__default.createElement("div", {
    ref: ref,
    className: "RFCMS__Parallax"
  }, React__default.createElement("div", {
    className: "RFCMS__Parallax__Inner",
    style: {
      backgroundImage: "url(" + src + ")",
      width: "100%",
      height: "calc(100% + " + zoom * 2 + "px)",
      backgroundPositionY: "calc(" + zoom * offset + "px)"
    }
  }));
};

var ParallaxDefinition = {
  name: 'Parallax',
  key: 'parallax',
  component: Parallax,
  Editor: function Editor(_ref2) {
    var onDataSet = _ref2.onDataSet,
        data = _ref2.data;

    var update = function update(src, zoom) {
      onDataSet({
        src: src || data.src,
        zoom: zoom || data.zoom
      });
    };

    return React__default.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React__default.createElement("span", null, "Source"), React__default.createElement(ImageEditor, {
      value: data == null ? void 0 : data.src,
      onUpdate: function onUpdate(s) {
        return update(s);
      }
    }), React__default.createElement("span", null, "Zoom"), React__default.createElement(NumberEditor, {
      value: data == null ? void 0 : data.zoom,
      onUpdate: function onUpdate(z) {
        return update(undefined, z);
      }
    }));
  }
};

var ImageText = function ImageText(_ref) {
  var alt = _ref.alt,
      style = _ref.style,
      imageStyle = _ref.imageStyle,
      textStyle = _ref.textStyle,
      imageClass = _ref.imageClass,
      textClass = _ref.textClass,
      src = _ref.src;

  if (src != null && src.startsWith('http')) {
    return React__default.createElement("img", {
      src: src,
      style: _extends({}, style, imageStyle),
      className: imageClass,
      alt: alt
    });
  } else {
    return React__default.createElement("span", {
      style: _extends({}, style, textStyle),
      className: textClass
    }, src);
  }
};
var ImageTextDefinition = {
  name: 'Image / Text',
  key: 'imageText',
  component: ImageText,
  Editor: function Editor(_ref2) {
    var onDataSet = _ref2.onDataSet,
        data = _ref2.data;
    return React__default.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React__default.createElement("span", null, "Image URL / Text"), React__default.createElement(ImageEditor, {
      value: data,
      onUpdate: onDataSet
    }));
  }
};

var mergeConfig = function mergeConfig(config) {
  return _extends({}, config, {
    components: [].concat(config.components, [ParallaxDefinition, ImageTextDefinition])
  });
};

var FirebaseProvider = function FirebaseProvider(_ref) {
  var children = _ref.children;
  var firebaseConfig = useConfig();
  return React__default.createElement(reactfire.FirebaseAppProvider, {
    firebaseConfig: firebaseConfig.firebase.config
  }, children);
};

var FirebaseComponents = function FirebaseComponents(_ref2) {
  var children = _ref2.children;
  var app = reactfire.useFirebaseApp();
  var database$1 = database.getDatabase(app);
  var auth$1 = auth.getAuth(app);
  var store = storage.getStorage(app);
  var firestore$1 = firestore.getFirestore(app);
  return React__default.createElement(reactfire.AuthProvider, {
    sdk: auth$1
  }, React__default.createElement(reactfire.DatabaseProvider, {
    sdk: database$1
  }, React__default.createElement(reactfire.StorageProvider, {
    sdk: store
  }, React__default.createElement(reactfire.FirestoreProvider, {
    sdk: firestore$1
  }, children))));
};

var ReactFireCMS = function ReactFireCMS(_ref3) {
  var config = _ref3.config,
      children = _ref3.children;
  return React__default.createElement(ConfigContext.Provider, {
    value: mergeConfig(config)
  }, React__default.createElement(FirebaseProvider, null, React__default.createElement(FirebaseComponents, null, children)));
};

var StringEditor = function StringEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("input", {
    onChange: function onChange(e) {
      return onUpdate(e.target.value);
    },
    value: value
  }));
};

var LongFormEditor = function LongFormEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  var blocks = htmlToDraft(value);
  var state = draftJs.ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
  var editorState = draftJs.EditorState.createWithContent(state);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    className: "RFCMS__Editable__Dialog__RichEditor"
  }, React__default.createElement(reactDraftWysiwyg.Editor, {
    defaultEditorState: editorState,
    onEditorStateChange: function onEditorStateChange(e) {
      onUpdate(draftToHtml(draftJs.convertToRaw(e.getCurrentContent())));
    }
  })));
};

var ComponentEditor = function ComponentEditor(_ref) {
  var _config$components$fi;

  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  var config = useConfig();
  var component = value == null ? void 0 : value.component;
  var props = value == null ? void 0 : value.props;

  var update = function update(component, props) {
    onUpdate({
      component: component || (value == null ? void 0 : value.component),
      props: props || (value == null ? void 0 : value.props)
    });
  };

  var Editor = (_config$components$fi = config.components.find(function (it) {
    return it.key === component;
  })) == null ? void 0 : _config$components$fi.Editor;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("select", {
    value: component,
    onChange: function onChange(e) {
      return update(e.target.value);
    }
  }, React__default.createElement("option", null, "Select a Component"), config.components.map(function (c, i) {
    return React__default.createElement("option", {
      key: c.key + "_" + i,
      value: c.key
    }, c.name);
  })), Editor && React__default.createElement(Editor, {
    onDataSet: function onDataSet(data) {
      return update(undefined, data);
    },
    data: props
  }));
};

var DynamicLayout = function DynamicLayout(_ref) {
  var cells = _ref.cells;
  return React__default.createElement(React__default.Fragment, null, cells == null ? void 0 : cells.map == null ? void 0 : cells.map(function (comp) {
    return React__default.createElement(DynamicComponent, {
      content: comp.description
    });
  }));
};
var DynamicLayoutDefinition = {
  name: 'DynamicLayout',
  key: 'dynamicLayout',
  component: DynamicLayout,
  Editor: function Editor(_ref2) {
    var onDataSet = _ref2.onDataSet,
        data = _ref2.data;
    var addRow = React.useCallback(function (e) {
      e.preventDefault();
      onDataSet([].concat(data || [], [{
        description: {
          component: undefined,
          props: {}
        },
        size: '100%'
      }]));
    }, [data]);
    var removeItemAt = React.useCallback(function (index) {
      var after = [].concat(data.slice(0, index), data.slice(index + 1));
      onDataSet(after);
    }, [data]);
    var replaceItemAt = React.useCallback(function (index, description, size) {
      var after = [].concat(data.slice(0, index), [{
        description: description || data[index].description,
        size: size || data[index].size
      }], data.slice(index + 1));
      onDataSet(after);
    }, [data]);
    return React__default.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React__default.createElement("button", {
      onClick: addRow
    }, "Add Row"), React__default.createElement("div", null, data == null ? void 0 : data.map(function (it, index) {
      return React__default.createElement("div", {
        key: index + "_",
        className: "RFCMS__DynamicLayout__Editor"
      }, React__default.createElement("div", {
        className: "RFCMS__DynamicLayout__Editor__Header"
      }, React__default.createElement("label", null, "Size (See guide for accepted formats)"), React__default.createElement(StringEditor, {
        value: it.size,
        onUpdate: function onUpdate(data) {
          return replaceItemAt(index, undefined, data);
        }
      }), React__default.createElement(io5.IoCloseCircle, {
        className: "RFCMS__DynamicLayout__Editor__Header__Delete",
        onClick: function onClick() {
          return removeItemAt(index);
        }
      })), React__default.createElement(DynamicComponentDefinition.Editor, {
        onDataSet: function onDataSet(data) {
          return replaceItemAt(index, data);
        },
        data: it.description
      }));
    })));
  }
};

var LinkReferenceEditor = function LinkReferenceEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;

  var updateValue = function updateValue(content, url) {
    onUpdate({
      content: content || value.content,
      url: url || value.url
    });
  };

  return React__default.createElement(React__default.Fragment, null, React__default.createElement("input", {
    onChange: function onChange(e) {
      return updateValue(e.target.value);
    },
    value: value.content
  }), React__default.createElement("input", {
    onChange: function onChange(e) {
      return updateValue(undefined, e.target.value);
    },
    value: value.url
  }));
};

var MenuEditor = function MenuEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  var addRow = React.useCallback(function (e) {
    e.preventDefault();
    onUpdate([].concat(value || [], [{
      url: '',
      content: ''
    }]));
  }, [value]);
  var removeItemAt = React.useCallback(function (index) {
    var after = [].concat(value.slice(0, index), value.slice(index + 1));
    onUpdate(after);
  }, [value]);
  var replaceItemAt = React.useCallback(function (index, data) {
    var after = [].concat(value.slice(0, index), [_extends({}, data)], value.slice(index + 1));
    onUpdate(after);
  }, [value]);
  return React__default.createElement("div", {
    className: "RFCMS__EditorStyles__Editor__Form"
  }, React__default.createElement("button", {
    onClick: addRow
  }, "Add Menu Item"), React__default.createElement("div", null, value == null ? void 0 : value.map(function (it, index) {
    return React__default.createElement("div", {
      key: index + "_",
      className: "RFCMS__MenuEditor__Editor"
    }, React__default.createElement("div", {
      className: "RFCMS__MenuEditor__Editor__Row"
    }, React__default.createElement(LinkReferenceEditor, {
      onUpdate: function onUpdate(data) {
        return replaceItemAt(index, data);
      },
      value: it
    }), React__default.createElement(io5.IoCloseCircle, {
      className: "RFCMS__DynamicLayout__Editor__Header__Delete",
      onClick: function onClick() {
        return removeItemAt(index);
      }
    })));
  })));
};

var EditableDialog = function EditableDialog(_ref) {
  var open = _ref.open,
      fields = _ref.fields,
      path = _ref.path,
      onClose = _ref.onClose;
  var firestore$1 = reactfire.useFirestore();
  var document = firestore.doc(firestore$1, path);
  var data = reactfire.useFirestoreDocData(document);

  var _useState = React.useState(''),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = React.useState({}),
      toSubmit = _useState2[0],
      setToSubmit = _useState2[1];

  React.useEffect(function () {
    setToSubmit(fields.reduce(function (p, c) {
      var _data$data;

      var current = p;
      current[c.name] = ((_data$data = data.data) == null ? void 0 : _data$data[c.name]) || undefined;
      return current;
    }, {}));
  }, [fields, data]);

  var submitChanges = function submitChanges(e) {
    e == null ? void 0 : e.preventDefault();
    console.error('Submitting: ', toSubmit);
    firestore.setDoc(document, toSubmit, {
      merge: true
    }).then(onClose)["catch"](function (e) {
      return setError(e);
    });
  };

  var updateField = React.useCallback(function (name, value) {
    var copy = _extends({}, toSubmit);

    copy[name] = value;
    setToSubmit(copy);
  }, [toSubmit]);
  var buttons = [{
    label: 'Cancel',
    action: function action() {
      return onClose == null ? void 0 : onClose();
    }
  }, {
    label: 'Save',
    action: submitChanges
  }];

  var renderEditor = function renderEditor(field) {
    switch (field.type) {
      case 'string':
        return React__default.createElement(StringEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'image':
        return React__default.createElement(ImageTextDefinition.Editor, {
          onDataSet: function onDataSet(v) {
            return updateField(field.name, v);
          },
          data: toSubmit[field.name]
        });

      case 'longform':
        return React__default.createElement(LongFormEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'component':
        return React__default.createElement(ComponentEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'dynamicLayout':
        return React__default.createElement(DynamicLayoutDefinition.Editor, {
          onDataSet: function onDataSet(v) {
            return updateField(field.name, v);
          },
          data: toSubmit[field.name]
        });

      case 'url':
        return React__default.createElement(LinkReferenceEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'menu':
        return React__default.createElement(MenuEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      default:
        return React__default.createElement(React__default.Fragment, null);
    }
  };

  return React__default.createElement(Dialog, Object.assign({
    title: "Edit Fields"
  }, {
    onClose: onClose,
    open: open
  }, {
    buttons: buttons
  }), open && React__default.createElement("form", {
    className: "RFCMS__Editable__Dialog",
    onSubmit: submitChanges
  }, React__default.createElement("span", {
    className: 'Text__Error'
  }, error), fields == null ? void 0 : fields.map(function (field) {
    return React__default.createElement("div", {
      key: field.name,
      className: "RFCMS__Editable__Dialog__Field"
    }, React__default.createElement("div", {
      className: "RFCMS__Editable__Dialog__Label"
    }, field.hint || field.name), renderEditor(field));
  })));
};

var Editable = function Editable(_ref2) {
  var fields = _ref2.fields,
      style = _ref2.style,
      path = _ref2.path,
      className = _ref2.className,
      children = _ref2.children;
  var user = reactfire.useUser();

  var _useState3 = React.useState(false),
      shown = _useState3[0],
      setShown = _useState3[1];

  var _useState4 = React.useState(false),
      highlight = _useState4[0],
      setHighlight = _useState4[1];

  var _useState5 = React.useState(false),
      preview = _useState5[0],
      setPreview = _useState5[1];

  reactHotkeysHook.useHotkeys('e', function () {
    setHighlight(true);
  });
  reactHotkeysHook.useHotkeys('e', function () {
    setHighlight(false);
  }, {
    keydown: false,
    keyup: true
  });
  reactHotkeysHook.useHotkeys('p', function () {
    setPreview(true);
  });
  reactHotkeysHook.useHotkeys('p', function () {
    setPreview(false);
  }, {
    keydown: false,
    keyup: true
  });
  return user.data ? React__default.createElement("div", {
    style: style,
    className: className + " RFCMS__Editable " + (preview && 'RFCMS__Editable--Preview')
  }, children, React__default.createElement(EditableDialog, {
    path: path,
    open: shown,
    fields: fields,
    onClose: function onClose() {
      return setShown(false);
    }
  }), React__default.createElement("div", {
    className: "RFCMS__Editable__Pencil " + (highlight && 'RFCMS__Editable__Pencil--Highlight') + " " + (preview && 'RFCMS__Editable__Pencil--Preview')
  }, React__default.createElement(fa.FaPencilAlt, {
    onClick: function onClick() {
      return setShown(true);
    },
    className: "RFCMS__Editable__Pencil__Text"
  }))) : React__default.createElement(React__default.Fragment, null, children);
};

var DynamicComponent = function DynamicComponent(_ref) {
  var _config$components$fi;

  var content = _ref.content,
      className = _ref.className,
      style = _ref.style;
  var config = useConfig();
  var component = content == null ? void 0 : content.component;
  var props = (content == null ? void 0 : content.props) || {};
  var Component = (_config$components$fi = config.components.find(function (it) {
    return it.key === component;
  })) == null ? void 0 : _config$components$fi.component;
  return Component ? React__default.createElement(Component, Object.assign({}, props, {
    className: className,
    style: style
  })) : React__default.createElement(React__default.Fragment, null);
};
var DynamicComponentDefinition = {
  name: 'Dynamic Component',
  key: 'dynamicComponent',
  component: DynamicComponent,
  Editor: function Editor(_ref2) {
    var onDataSet = _ref2.onDataSet,
        data = _ref2.data;
    return React__default.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React__default.createElement("span", null, "Component"), React__default.createElement(ComponentEditor, {
      value: data,
      onUpdate: onDataSet
    }));
  }
};

var Delete = function Delete(_ref) {
  var open = _ref.open,
      identity = _ref.identity,
      onClose = _ref.onClose,
      onDelete = _ref.onDelete;
  var doDelete = React.useCallback(function () {
    onDelete().then(onClose);
  }, [onDelete, onClose]);
  var buttons = [{
    label: 'Cancel',
    action: function action() {
      return onClose == null ? void 0 : onClose();
    }
  }, {
    label: 'Delete',
    action: doDelete,
    type: 'warning'
  }];
  return React__default.createElement(Dialog, {
    title: "Delete " + identity,
    open: open,
    onClose: onClose,
    buttons: buttons
  }, "Do you wish to delete ", identity);
};

var Deleter = function Deleter(_ref) {
  var style = _ref.style,
      className = _ref.className,
      path = _ref.path,
      children = _ref.children;

  var _useUser = useUser(),
      userExists = _useUser.userExists;

  var _useState = React.useState(false),
      shown = _useState[0],
      setShown = _useState[1];

  var _useState2 = React.useState(false),
      highlight = _useState2[0],
      setHighlight = _useState2[1];

  var _useState3 = React.useState(false),
      preview = _useState3[0],
      setPreview = _useState3[1];

  var firestore$1 = reactfire.useFirestore();
  reactHotkeysHook.useHotkeys('e', function () {
    setHighlight(true);
  });
  reactHotkeysHook.useHotkeys('e', function () {
    setHighlight(false);
  }, {
    keydown: false,
    keyup: true
  });
  reactHotkeysHook.useHotkeys('p', function () {
    setPreview(true);
  });
  reactHotkeysHook.useHotkeys('p', function () {
    setPreview(false);
  }, {
    keydown: false,
    keyup: true
  });
  return userExists ? React__default.createElement("div", {
    style: style,
    className: className + " RFCMS__Editable " + (preview && 'RFCMS__Editable--Preview')
  }, React__default.createElement(Delete, {
    open: shown,
    identity: "this page",
    onClose: function onClose() {
      return setShown(false);
    },
    onDelete: function onDelete() {
      return firestore.deleteDoc(firestore.doc(firestore$1, path));
    }
  }), React__default.createElement("div", {
    className: "RFCMS__Editable__Trash " + (highlight && 'RFCMS__Editable__Trash--Highlight') + "  " + (preview && 'RFCMS__Editable__Pencil--Preview')
  }, React__default.createElement(fa.FaTrash, {
    onClick: function onClick() {
      return setShown(true);
    },
    className: "RFCMS__Editable__Pencil__Text"
  }))) : React__default.createElement(React__default.Fragment, null, children);
};

var Login = function Login(_ref) {
  var open = _ref.open,
      onClose = _ref.onClose;
  var auth$1 = reactfire.useAuth();

  var _useState = React.useState(''),
      email = _useState[0],
      setEmail = _useState[1];

  var _useState2 = React.useState(''),
      password = _useState2[0],
      setPassword = _useState2[1];

  var doLogin = React.useCallback(function (e) {
    e == null ? void 0 : e.preventDefault();
    auth.setPersistence(auth$1, auth.browserSessionPersistence).then(function () {
      return auth.signInWithEmailAndPassword(auth$1, email, password);
    }).then(onClose);
  }, [email, password, auth$1, onClose]);
  var buttons = [{
    label: 'Login',
    action: doLogin
  }];
  return React__default.createElement(Dialog, {
    title: "Login",
    open: open,
    onClose: onClose,
    buttons: buttons
  }, React__default.createElement("form", {
    onSubmit: doLogin,
    className: "RFCMS__LoginDialog__Content"
  }, React__default.createElement("label", {
    htmlFor: "email"
  }, "Email"), React__default.createElement("input", {
    value: email,
    onChange: function onChange(v) {
      return setEmail(v.target.value);
    },
    type: "email",
    id: "email"
  }), React__default.createElement("label", {
    htmlFor: "password"
  }, "Password"), React__default.createElement("input", {
    value: password,
    onChange: function onChange(v) {
      return setPassword(v.target.value);
    },
    type: "password",
    id: "password"
  })));
};

var Logout = function Logout(_ref) {
  var open = _ref.open,
      onClose = _ref.onClose;
  var auth$1 = reactfire.useAuth();
  var doLogout = React.useCallback(function () {
    auth.setPersistence(auth$1, auth.browserSessionPersistence).then(function () {
      return auth.signOut(auth$1);
    }).then(onClose);
  }, [auth$1, onClose]);
  var buttons = [{
    label: 'Cancel',
    action: function action() {
      return onClose == null ? void 0 : onClose();
    }
  }, {
    label: 'Logout',
    action: doLogout,
    type: 'warning'
  }];
  return React__default.createElement(Dialog, {
    title: "Login",
    open: open,
    onClose: onClose,
    buttons: buttons
  }, "Are you sure you wish to logout?");
};

exports.Deleter = Deleter;
exports.Dialog = Dialog;
exports.DynamicComponent = DynamicComponent;
exports.DynamicComponentDefinition = DynamicComponentDefinition;
exports.DynamicLayout = DynamicLayout;
exports.DynamicLayoutDefinition = DynamicLayoutDefinition;
exports.Editable = Editable;
exports.ImageText = ImageText;
exports.ImageTextDefinition = ImageTextDefinition;
exports.Login = Login;
exports.Logout = Logout;
exports.ReactFireCMS = ReactFireCMS;
exports.useConfig = useConfig;
exports.useDocument = useDocument;
exports.useField = useField;
exports.useUser = useUser;
//# sourceMappingURL=react-fire-cms.cjs.development.js.map
