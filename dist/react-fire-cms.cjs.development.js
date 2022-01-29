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
    className: 'RFC__AntiClick'
  }), React__default.createElement("div", {
    className: 'RFC__Dialog'
  }, React__default.createElement("div", {
    className: 'RFC__Dialog__Header'
  }, title, onClose && React__default.createElement(io5.IoCloseSharp, {
    onClick: onClose,
    className: 'RFC__Dialog__Close'
  })), React__default.createElement("div", {
    className: 'RFC__Dialog__Content'
  }, children), buttons && React__default.createElement("div", {
    className: 'RFC__Dialog__Buttons'
  }, buttons == null ? void 0 : buttons.map(function (it) {
    return React__default.createElement("div", {
      key: it.label,
      className: 'RFC__Dialog__Buttons__Button' + " " + (it.disabled && 'RFC__Dialog__Buttons__Button--disabled') + " " + ("RFC__Dialog__Buttons__Button--" + it.type),
      onClick: function onClick() {
        if (!it.disabled) {
          it.action();
        }
      }
    }, it.label);
  })))) : null;
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
    className: "RFC__MediaSelector__Item " + (selected && 'RFC__MediaSelector__Item--Selected')
  }, React__default.createElement("img", {
    src: url,
    alt: image == null ? void 0 : image.name,
    className: "RFC__MediaSelector__Item__Image"
  }), React__default.createElement("span", {
    className: "RFC__MediaSelector__Item__Text"
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
    className: "RFC__TextStyles__Error"
  }, error), React__default.createElement("div", {
    className: "RFC__MediaSelector__Grid"
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
  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  return React__default.createElement("div", {
    className: "RFC__Editable__Dialog__Image"
  }, React__default.createElement("input", {
    onChange: function onChange(e) {
      return onUpdateField(path, e.target.value);
    },
    id: path,
    value: value
  }), React__default.createElement(MediaSelector, {
    onSelect: function onSelect(v) {
      return onUpdateField(path, v);
    }
  }));
};

var NumberEditor = function NumberEditor(_ref) {
  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("input", {
    type: 'number',
    onChange: function onChange(e) {
      return onUpdateField(path, e.target.value);
    },
    id: path,
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
    className: "RFC__Parallax"
  }, React__default.createElement("div", {
    className: "RFC__Parallax__Inner",
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
  key: 'Parallax',
  component: Parallax,
  Editor: function Editor(_ref2) {
    var onDataSet = _ref2.onDataSet,
        data = _ref2.data;
    var parsed = JSON.parse(data || '{}');

    var _useState2 = React.useState((parsed == null ? void 0 : parsed.src) || ''),
        src = _useState2[0],
        setSrc = _useState2[1];

    var _useState3 = React.useState((parsed == null ? void 0 : parsed.zoom) || '0'),
        zoom = _useState3[0],
        setZoom = _useState3[1];

    React.useEffect(function () {
      onDataSet(JSON.stringify({
        src: src,
        zoom: zoom
      }));
    }, [src, zoom]);
    return React__default.createElement("div", {
      className: "RFC__EditorStyles__Editor__Form"
    }, React__default.createElement("span", null, "Source"), React__default.createElement(ImageEditor, {
      value: parsed.src,
      path: '',
      onUpdateField: function onUpdateField(_, value) {
        return setSrc(value);
      }
    }), React__default.createElement("span", null, "Zoom"), React__default.createElement(NumberEditor, {
      value: parsed.zoom,
      path: '',
      onUpdateField: function onUpdateField(_, value) {
        return setZoom(value);
      }
    }));
  }
};

var StringEditor = function StringEditor(_ref) {
  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("input", {
    onChange: function onChange(e) {
      return onUpdateField(path, e.target.value);
    },
    id: path,
    value: value
  }));
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
    var parsed = JSON.parse(data);

    var _useState = React.useState(parsed == null ? void 0 : parsed.src),
        src = _useState[0],
        setSrc = _useState[1];

    React.useEffect(function () {
      onDataSet(JSON.stringify({
        src: src
      }));
    }, [src]);
    return React__default.createElement("div", {
      className: "RFC__EditorStyles__Editor__Form"
    }, React__default.createElement("span", null, "Source"), React__default.createElement(StringEditor, {
      value: parsed.src,
      path: '',
      onUpdateField: function onUpdateField(_, value) {
        return setSrc(value);
      }
    }));
  }
};

var ConfigContext = /*#__PURE__*/React.createContext(null);

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

var useConfig = function useConfig() {
  return React.useContext(ConfigContext);
};
var ReactFireCms = function ReactFireCms(_ref3) {
  var config = _ref3.config,
      children = _ref3.children;
  return React__default.createElement(ConfigContext.Provider, {
    value: mergeConfig(config)
  }, React__default.createElement(FirebaseProvider, null, React__default.createElement(FirebaseComponents, null, children)));
};

var LongFormEditor = function LongFormEditor(_ref) {
  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  var blocks = htmlToDraft(value);
  var state = draftJs.ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
  var editorState = draftJs.EditorState.createWithContent(state);
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("div", {
    className: "RFC__Editable__Dialog__RichEditor"
  }, React__default.createElement(reactDraftWysiwyg.Editor, {
    defaultEditorState: editorState,
    onEditorStateChange: function onEditorStateChange(e) {
      onUpdateField(path, draftToHtml(draftJs.convertToRaw(e.getCurrentContent())));
    }
  })));
};

var ComponentEditor = function ComponentEditor(_ref) {
  var _rfcConfig$components;

  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  var input = JSON.parse(value || '{}');
  var rfcConfig = useConfig();

  var _useState = React.useState(input.component || ''),
      component = _useState[0],
      setComponent = _useState[1];

  var _useState2 = React.useState(input.data || '{}'),
      data = _useState2[0],
      setData = _useState2[1];

  React.useEffect(function () {
    var output = {
      component: component,
      data: data
    };
    onUpdateField(path, JSON.stringify(output));
  }, [data, component]);
  var onOptionSelect = React.useCallback(function (e) {
    setComponent(e.target.value);
  }, []);
  var onDataSet = React.useCallback(function (data) {
    setData(data);
  }, []);
  var Editor = (_rfcConfig$components = rfcConfig.components.find(function (it) {
    return it.key === component;
  })) == null ? void 0 : _rfcConfig$components.Editor;
  return React__default.createElement(React__default.Fragment, null, React__default.createElement("select", {
    value: component,
    onChange: onOptionSelect
  }, React__default.createElement("option", null, "Select a Component"), rfcConfig.components.map(function (c) {
    return React__default.createElement("option", {
      value: c.key
    }, c.name);
  })), Editor && React__default.createElement(Editor, {
    onDataSet: onDataSet,
    data: data
  }));
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
      current[c.name] = ((_data$data = data.data) == null ? void 0 : _data$data[c.name]) || '';
      return current;
    }, {}));
  }, [fields, data]);

  var submitChanges = function submitChanges(e) {
    e == null ? void 0 : e.preventDefault();
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
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      case 'image':
        return React__default.createElement(ImageEditor, {
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      case 'longform':
        return React__default.createElement(LongFormEditor, {
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      case 'component':
        return React__default.createElement(ComponentEditor, {
          onUpdateField: updateField,
          path: field.name,
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
    className: "RFC__Editable__Dialog",
    onSubmit: submitChanges
  }, React__default.createElement("span", {
    className: 'Text__Error'
  }, error), fields == null ? void 0 : fields.map(function (field) {
    return React__default.createElement("div", {
      key: field.name,
      className: "RFC__Editable__Dialog__Field"
    }, React__default.createElement("div", {
      className: "RFC__Editable__Dialog__Label"
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
    className: className + " RFC__Editable " + (preview && 'RFC__Editable--Preview')
  }, children, React__default.createElement(EditableDialog, {
    path: path,
    open: shown,
    fields: fields,
    onClose: function onClose() {
      return setShown(false);
    }
  }), React__default.createElement("div", {
    className: "RFC__Editable__Pencil " + (highlight && 'RFC__Editable__Pencil--Highlight') + " " + (preview && 'RFC__Editable__Pencil--Preview')
  }, React__default.createElement(fa.FaPencilAlt, {
    onClick: function onClick() {
      return setShown(true);
    },
    className: "RFC__Editable__Pencil__Text"
  }))) : React__default.createElement(React__default.Fragment, null, children);
};

var DynamicComponent = function DynamicComponent(_ref) {
  var _config$components$fi;

  var content = _ref.content,
      className = _ref.className,
      style = _ref.style;
  var config = useConfig();
  var parsed = JSON.parse(content || '{}');
  var component = parsed == null ? void 0 : parsed.component;
  var props = JSON.parse((parsed == null ? void 0 : parsed.data) || '{}');
  var Component = (_config$components$fi = config.components.find(function (it) {
    return it.key === component;
  })) == null ? void 0 : _config$components$fi.component;
  return Component ? React__default.createElement(Component, Object.assign({}, props, {
    className: className,
    style: style
  })) : React__default.createElement(React__default.Fragment, null);
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
    className: "RFC__LoginDialog__Content"
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

exports.Dialog = Dialog;
exports.DynamicComponent = DynamicComponent;
exports.Editable = Editable;
exports.ImageText = ImageText;
exports.ImageTextDefinition = ImageTextDefinition;
exports.Login = Login;
exports.Logout = Logout;
exports.ReactFireCms = ReactFireCms;
exports.useConfig = useConfig;
//# sourceMappingURL=react-fire-cms.cjs.development.js.map
