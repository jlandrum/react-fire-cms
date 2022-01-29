import React, { useState, useCallback, useEffect, useMemo, createRef, useContext, createContext } from 'react';
import { useStorage, FirebaseAppProvider, useFirebaseApp, AuthProvider, DatabaseProvider, StorageProvider, FirestoreProvider, useUser, useFirestore, useFirestoreDocData, useAuth } from 'reactfire';
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { listAll, ref, getDownloadURL, getStorage } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { IoCloseSharp } from 'react-icons/io5';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaPencilAlt } from 'react-icons/fa';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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
  return open ? React.createElement(React.Fragment, null, React.createElement("div", {
    className: 'RFC__AntiClick'
  }), React.createElement("div", {
    className: 'RFC__Dialog'
  }, React.createElement("div", {
    className: 'RFC__Dialog__Header'
  }, title, onClose && React.createElement(IoCloseSharp, {
    onClick: onClose,
    className: 'RFC__Dialog__Close'
  })), React.createElement("div", {
    className: 'RFC__Dialog__Content'
  }, children), buttons && React.createElement("div", {
    className: 'RFC__Dialog__Buttons'
  }, buttons == null ? void 0 : buttons.map(function (it) {
    return React.createElement("div", {
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

  var _useState = useState(''),
      url = _useState[0],
      setUrl = _useState[1];

  useEffect(function () {
    if (!image) return;
    getDownloadURL(image).then(setUrl)["catch"](console.error);
  }, [image]);
  return React.createElement("div", {
    onClick: function onClick() {
      return onSelect(url);
    },
    className: "RFC__MediaSelector__Item " + (selected && 'RFC__MediaSelector__Item--Selected')
  }, React.createElement("img", {
    src: url,
    alt: image == null ? void 0 : image.name,
    className: "RFC__MediaSelector__Item__Image"
  }), React.createElement("span", {
    className: "RFC__MediaSelector__Item__Text"
  }, image == null ? void 0 : image.name));
};

var MediaSelector = function MediaSelector(_ref) {
  var onSelect = _ref.onSelect;
  var config = useConfig();

  var _useState2 = useState(''),
      error = _useState2[0],
      setError = _useState2[1];

  var _useState3 = useState(false),
      open = _useState3[0],
      setOpen = _useState3[1];

  var _useState4 = useState([]),
      items = _useState4[0],
      setItems = _useState4[1];

  var _useState5 = useState(-1),
      selection = _useState5[0],
      setSelection = _useState5[1];

  var _useState6 = useState(''),
      url = _useState6[0],
      setUrl = _useState6[1];

  var storage = useStorage();
  var showDialog = useCallback(function (e) {
    e.preventDefault();
    setOpen(true);
  }, [setOpen]);
  useEffect(function () {
    if (!open) return;
    listAll(ref(storage, config.firebase.storage.bucket)).then(function (r) {
      setItems(r.items);
    })["catch"](function (e) {
      return setError(e);
    });
  }, [storage, open]);
  var buttons = useMemo(function () {
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
  return React.createElement("div", null, React.createElement("button", {
    onClick: showDialog
  }, "Select Image"), open && React.createElement(Dialog, {
    buttons: buttons,
    title: "Media Gallery",
    open: open,
    onClose: function onClose() {
      return setOpen(false);
    }
  }, error && React.createElement("span", {
    className: "RFC__TextStyles__Error"
  }, error), React.createElement("div", {
    className: "RFC__MediaSelector__Grid"
  }, items.map(function (item, index) {
    return React.createElement(FirebaseImage, {
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
  return React.createElement("div", {
    className: "RFC__Editable__Dialog__Image"
  }, React.createElement("input", {
    onChange: function onChange(e) {
      return onUpdateField(path, e.target.value);
    },
    id: path,
    value: value
  }), React.createElement(MediaSelector, {
    onSelect: function onSelect(v) {
      return onUpdateField(path, v);
    }
  }));
};

var NumberEditor = function NumberEditor(_ref) {
  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  return React.createElement(React.Fragment, null, React.createElement("input", {
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
  var ref = createRef();

  var _useState = useState(-1),
      offset = _useState[0],
      setOffset = _useState[1];

  var scrollHandler = useCallback(function () {
    var _ref$current, _ref$current$getBound;

    var offset = ((_ref$current = ref.current) == null ? void 0 : (_ref$current$getBound = _ref$current.getBoundingClientRect()) == null ? void 0 : _ref$current$getBound.top) || 0;
    var percent = offset / window.innerHeight / 2;
    setOffset(percent - 1);
  }, [ref]);
  useEffect(function () {
    window.addEventListener('scroll', scrollHandler);
    return function () {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [scrollHandler]);
  return React.createElement("div", {
    ref: ref,
    className: "RFC__Parallax"
  }, React.createElement("div", {
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

    var _useState2 = useState((parsed == null ? void 0 : parsed.src) || ''),
        src = _useState2[0],
        setSrc = _useState2[1];

    var _useState3 = useState((parsed == null ? void 0 : parsed.zoom) || '0'),
        zoom = _useState3[0],
        setZoom = _useState3[1];

    useEffect(function () {
      onDataSet(JSON.stringify({
        src: src,
        zoom: zoom
      }));
    }, [src, zoom]);
    return React.createElement("div", {
      className: "RFC__EditorStyles__Editor__Form"
    }, React.createElement("span", null, "Source"), React.createElement(ImageEditor, {
      value: parsed.src,
      path: '',
      onUpdateField: function onUpdateField(_, value) {
        return setSrc(value);
      }
    }), React.createElement("span", null, "Zoom"), React.createElement(NumberEditor, {
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
  return React.createElement(React.Fragment, null, React.createElement("input", {
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
    return React.createElement("img", {
      src: src,
      style: _extends({}, style, imageStyle),
      className: imageClass,
      alt: alt
    });
  } else {
    return React.createElement("span", {
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

    var _useState = useState(parsed == null ? void 0 : parsed.src),
        src = _useState[0],
        setSrc = _useState[1];

    useEffect(function () {
      onDataSet(JSON.stringify({
        src: src
      }));
    }, [src]);
    return React.createElement("div", {
      className: "RFC__EditorStyles__Editor__Form"
    }, React.createElement("span", null, "Source"), React.createElement(StringEditor, {
      value: parsed.src,
      path: '',
      onUpdateField: function onUpdateField(_, value) {
        return setSrc(value);
      }
    }));
  }
};

var ConfigContext = /*#__PURE__*/createContext(null);

var mergeConfig = function mergeConfig(config) {
  return _extends({}, config, {
    components: [].concat(config.components, [ParallaxDefinition, ImageTextDefinition])
  });
};

var FirebaseProvider = function FirebaseProvider(_ref) {
  var children = _ref.children;
  var firebaseConfig = useConfig();
  return React.createElement(FirebaseAppProvider, {
    firebaseConfig: firebaseConfig.firebase.config
  }, children);
};

var FirebaseComponents = function FirebaseComponents(_ref2) {
  var children = _ref2.children;
  var app = useFirebaseApp();
  var database = getDatabase(app);
  var auth = getAuth(app);
  var store = getStorage(app);
  var firestore = getFirestore(app);
  return React.createElement(AuthProvider, {
    sdk: auth
  }, React.createElement(DatabaseProvider, {
    sdk: database
  }, React.createElement(StorageProvider, {
    sdk: store
  }, React.createElement(FirestoreProvider, {
    sdk: firestore
  }, children))));
};

var useConfig = function useConfig() {
  return useContext(ConfigContext);
};
var ReactFireCms = function ReactFireCms(_ref3) {
  var config = _ref3.config,
      children = _ref3.children;
  return React.createElement(ConfigContext.Provider, {
    value: mergeConfig(config)
  }, React.createElement(FirebaseProvider, null, React.createElement(FirebaseComponents, null, children)));
};

var LongFormEditor = function LongFormEditor(_ref) {
  var onUpdateField = _ref.onUpdateField,
      path = _ref.path,
      value = _ref.value;
  var blocks = htmlToDraft(value);
  var state = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
  var editorState = EditorState.createWithContent(state);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "RFC__Editable__Dialog__RichEditor"
  }, React.createElement(Editor, {
    defaultEditorState: editorState,
    onEditorStateChange: function onEditorStateChange(e) {
      onUpdateField(path, draftToHtml(convertToRaw(e.getCurrentContent())));
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

  var _useState = useState(input.component || ''),
      component = _useState[0],
      setComponent = _useState[1];

  var _useState2 = useState(input.data || '{}'),
      data = _useState2[0],
      setData = _useState2[1];

  useEffect(function () {
    var output = {
      component: component,
      data: data
    };
    onUpdateField(path, JSON.stringify(output));
  }, [data, component]);
  var onOptionSelect = useCallback(function (e) {
    setComponent(e.target.value);
  }, []);
  var onDataSet = useCallback(function (data) {
    setData(data);
  }, []);
  var Editor = (_rfcConfig$components = rfcConfig.components.find(function (it) {
    return it.key === component;
  })) == null ? void 0 : _rfcConfig$components.Editor;
  return React.createElement(React.Fragment, null, React.createElement("select", {
    value: component,
    onChange: onOptionSelect
  }, React.createElement("option", null, "Select a Component"), rfcConfig.components.map(function (c) {
    return React.createElement("option", {
      value: c.key
    }, c.name);
  })), Editor && React.createElement(Editor, {
    onDataSet: onDataSet,
    data: data
  }));
};

var EditableDialog = function EditableDialog(_ref) {
  var open = _ref.open,
      fields = _ref.fields,
      path = _ref.path,
      onClose = _ref.onClose;
  var firestore = useFirestore();
  var document = doc(firestore, path);
  var data = useFirestoreDocData(document);

  var _useState = useState(''),
      error = _useState[0],
      setError = _useState[1];

  var _useState2 = useState({}),
      toSubmit = _useState2[0],
      setToSubmit = _useState2[1];

  useEffect(function () {
    setToSubmit(fields.reduce(function (p, c) {
      var _data$data;

      var current = p;
      current[c.name] = ((_data$data = data.data) == null ? void 0 : _data$data[c.name]) || '';
      return current;
    }, {}));
  }, [fields, data]);

  var submitChanges = function submitChanges(e) {
    e == null ? void 0 : e.preventDefault();
    setDoc(document, toSubmit, {
      merge: true
    }).then(onClose)["catch"](function (e) {
      return setError(e);
    });
  };

  var updateField = useCallback(function (name, value) {
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
        return React.createElement(StringEditor, {
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      case 'image':
        return React.createElement(ImageEditor, {
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      case 'longform':
        return React.createElement(LongFormEditor, {
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      case 'component':
        return React.createElement(ComponentEditor, {
          onUpdateField: updateField,
          path: field.name,
          value: toSubmit[field.name]
        });

      default:
        return React.createElement(React.Fragment, null);
    }
  };

  return React.createElement(Dialog, Object.assign({
    title: "Edit Fields"
  }, {
    onClose: onClose,
    open: open
  }, {
    buttons: buttons
  }), open && React.createElement("form", {
    className: "RFC__Editable__Dialog",
    onSubmit: submitChanges
  }, React.createElement("span", {
    className: 'Text__Error'
  }, error), fields == null ? void 0 : fields.map(function (field) {
    return React.createElement("div", {
      key: field.name,
      className: "RFC__Editable__Dialog__Field"
    }, React.createElement("div", {
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
  var user = useUser();

  var _useState3 = useState(false),
      shown = _useState3[0],
      setShown = _useState3[1];

  var _useState4 = useState(false),
      highlight = _useState4[0],
      setHighlight = _useState4[1];

  var _useState5 = useState(false),
      preview = _useState5[0],
      setPreview = _useState5[1];

  useHotkeys('e', function () {
    setHighlight(true);
  });
  useHotkeys('e', function () {
    setHighlight(false);
  }, {
    keydown: false,
    keyup: true
  });
  useHotkeys('p', function () {
    setPreview(true);
  });
  useHotkeys('p', function () {
    setPreview(false);
  }, {
    keydown: false,
    keyup: true
  });
  return user.data ? React.createElement("div", {
    style: style,
    className: className + " RFC__Editable " + (preview && 'RFC__Editable--Preview')
  }, children, React.createElement(EditableDialog, {
    path: path,
    open: shown,
    fields: fields,
    onClose: function onClose() {
      return setShown(false);
    }
  }), React.createElement("div", {
    className: "RFC__Editable__Pencil " + (highlight && 'RFC__Editable__Pencil--Highlight') + " " + (preview && 'RFC__Editable__Pencil--Preview')
  }, React.createElement(FaPencilAlt, {
    onClick: function onClick() {
      return setShown(true);
    },
    className: "RFC__Editable__Pencil__Text"
  }))) : React.createElement(React.Fragment, null, children);
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
  return Component ? React.createElement(Component, Object.assign({}, props, {
    className: className,
    style: style
  })) : React.createElement(React.Fragment, null);
};

var Login = function Login(_ref) {
  var open = _ref.open,
      onClose = _ref.onClose;
  var auth = useAuth();

  var _useState = useState(''),
      email = _useState[0],
      setEmail = _useState[1];

  var _useState2 = useState(''),
      password = _useState2[0],
      setPassword = _useState2[1];

  var doLogin = useCallback(function (e) {
    e == null ? void 0 : e.preventDefault();
    setPersistence(auth, browserSessionPersistence).then(function () {
      return signInWithEmailAndPassword(auth, email, password);
    }).then(onClose);
  }, [email, password, auth, onClose]);
  var buttons = [{
    label: 'Login',
    action: doLogin
  }];
  return React.createElement(Dialog, {
    title: "Login",
    open: open,
    onClose: onClose,
    buttons: buttons
  }, React.createElement("form", {
    onSubmit: doLogin,
    className: "RFC__LoginDialog__Content"
  }, React.createElement("label", {
    htmlFor: "email"
  }, "Email"), React.createElement("input", {
    value: email,
    onChange: function onChange(v) {
      return setEmail(v.target.value);
    },
    type: "email",
    id: "email"
  }), React.createElement("label", {
    htmlFor: "password"
  }, "Password"), React.createElement("input", {
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
  var auth = useAuth();
  var doLogout = useCallback(function () {
    setPersistence(auth, browserSessionPersistence).then(function () {
      return signOut(auth);
    }).then(onClose);
  }, [auth, onClose]);
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
  return React.createElement(Dialog, {
    title: "Login",
    open: open,
    onClose: onClose,
    buttons: buttons
  }, "Are you sure you wish to logout?");
};

export { Dialog, DynamicComponent, Editable, ImageText, ImageTextDefinition, Login, Logout, ReactFireCms, useConfig };
//# sourceMappingURL=react-fire-cms.esm.js.map
