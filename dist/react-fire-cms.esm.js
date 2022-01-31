import React, { createContext, useMemo, useContext, useState, useCallback, useEffect, createRef } from 'react';
import { useFirestore, useFirestoreDocData, useUser as useUser$1, useStorage, FirebaseAppProvider, useFirebaseApp, AuthProvider, DatabaseProvider, StorageProvider, FirestoreProvider, useAuth } from 'reactfire';
import { getAuth, setPersistence, browserSessionPersistence, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { listAll, ref, getDownloadURL, getStorage } from 'firebase/storage';
import { doc, getFirestore, setDoc, deleteDoc } from 'firebase/firestore';
import { IoCloseSharp, IoCloseCircle } from 'react-icons/io5';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useHotkeys } from 'react-hotkeys-hook';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
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
    className: 'RFCMS__AntiClick'
  }), React.createElement("div", {
    className: 'RFCMS__Dialog'
  }, React.createElement("div", {
    className: 'RFCMS__Dialog__Header'
  }, title, onClose && React.createElement(IoCloseSharp, {
    onClick: onClose,
    className: 'RFCMS__Dialog__Close'
  })), React.createElement("div", {
    className: 'RFCMS__Dialog__Content'
  }, children), buttons && React.createElement("div", {
    className: 'RFCMS__Dialog__Buttons'
  }, buttons == null ? void 0 : buttons.map(function (it) {
    return React.createElement("div", {
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

var ConfigContext = /*#__PURE__*/createContext(null);

var useField = function useField(path, key) {
  var storage = useFirestore();
  var document = doc(storage, path);

  var _useFirestoreDocData = useFirestoreDocData(document),
      data = _useFirestoreDocData.data;

  return useMemo(function () {
    return data == null ? void 0 : data[key];
  }, [data]);
};
var useDocument = function useDocument(path) {
  var storage = useFirestore();
  var document = doc(storage, "" + path);

  var _useFirestoreDocData2 = useFirestoreDocData(document),
      data = _useFirestoreDocData2.data;

  console.error(Object.keys(data || {}), data);
  return {
    data: data,
    pageExists: Object.keys(data || {}).length > 0
  };
};
var useConfig = function useConfig() {
  return useContext(ConfigContext);
};
var useUser = function useUser() {
  var auth = useUser$1();

  return useMemo(function () {
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
    className: "RFCMS__MediaSelector__Item " + (selected && 'RFCMS__MediaSelector__Item--Selected')
  }, React.createElement("img", {
    src: url,
    alt: image == null ? void 0 : image.name,
    className: "RFCMS__MediaSelector__Item__Image"
  }), React.createElement("span", {
    className: "RFCMS__MediaSelector__Item__Text"
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
    className: "RFCMS__TextStyles__Error"
  }, error), React.createElement("div", {
    className: "RFCMS__MediaSelector__Grid"
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
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  return React.createElement("div", {
    className: "RFCMS__Editable__Dialog__Image"
  }, React.createElement("input", {
    onChange: function onChange(e) {
      return onUpdate(e.target.value);
    },
    value: value
  }), React.createElement(MediaSelector, {
    onSelect: onUpdate
  }));
};

var NumberEditor = function NumberEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  return React.createElement(React.Fragment, null, React.createElement("input", {
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
    className: "RFCMS__Parallax"
  }, React.createElement("div", {
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

    return React.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React.createElement("span", null, "Source"), React.createElement(ImageEditor, {
      value: data == null ? void 0 : data.src,
      onUpdate: function onUpdate(s) {
        return update(s);
      }
    }), React.createElement("span", null, "Zoom"), React.createElement(NumberEditor, {
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
    return React.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React.createElement("span", null, "Image URL / Text"), React.createElement(ImageEditor, {
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

var ReactFireCMS = function ReactFireCMS(_ref3) {
  var config = _ref3.config,
      children = _ref3.children;
  return React.createElement(ConfigContext.Provider, {
    value: mergeConfig(config)
  }, React.createElement(FirebaseProvider, null, React.createElement(FirebaseComponents, null, children)));
};

var StringEditor = function StringEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  return React.createElement(React.Fragment, null, React.createElement("input", {
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
  var state = ContentState.createFromBlockArray(blocks.contentBlocks, blocks.entityMap);
  var editorState = EditorState.createWithContent(state);
  return React.createElement(React.Fragment, null, React.createElement("div", {
    className: "RFCMS__Editable__Dialog__RichEditor"
  }, React.createElement(Editor, {
    defaultEditorState: editorState,
    onEditorStateChange: function onEditorStateChange(e) {
      onUpdate(draftToHtml(convertToRaw(e.getCurrentContent())));
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
  return React.createElement(React.Fragment, null, React.createElement("select", {
    value: component,
    onChange: function onChange(e) {
      return update(e.target.value);
    }
  }, React.createElement("option", null, "Select a Component"), config.components.map(function (c, i) {
    return React.createElement("option", {
      key: c.key + "_" + i,
      value: c.key
    }, c.name);
  })), Editor && React.createElement(Editor, {
    onDataSet: function onDataSet(data) {
      return update(undefined, data);
    },
    data: props
  }));
};

var DynamicLayout = function DynamicLayout(_ref) {
  var cells = _ref.cells;
  return React.createElement(React.Fragment, null, cells == null ? void 0 : cells.map == null ? void 0 : cells.map(function (comp) {
    return React.createElement(DynamicComponent, {
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
    var addRow = useCallback(function (e) {
      e.preventDefault();
      onDataSet([].concat(data || [], [{
        description: {
          component: undefined,
          props: {}
        },
        size: '100%'
      }]));
    }, [data]);
    var removeItemAt = useCallback(function (index) {
      var after = [].concat(data.slice(0, index), data.slice(index + 1));
      onDataSet(after);
    }, [data]);
    var replaceItemAt = useCallback(function (index, description, size) {
      var after = [].concat(data.slice(0, index), [{
        description: description || data[index].description,
        size: size || data[index].size
      }], data.slice(index + 1));
      onDataSet(after);
    }, [data]);
    return React.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React.createElement("button", {
      onClick: addRow
    }, "Add Row"), React.createElement("div", null, data == null ? void 0 : data.map(function (it, index) {
      return React.createElement("div", {
        key: index + "_",
        className: "RFCMS__DynamicLayout__Editor"
      }, React.createElement("div", {
        className: "RFCMS__DynamicLayout__Editor__Header"
      }, React.createElement("label", null, "Size (See guide for accepted formats)"), React.createElement(StringEditor, {
        value: it.size,
        onUpdate: function onUpdate(data) {
          return replaceItemAt(index, undefined, data);
        }
      }), React.createElement(IoCloseCircle, {
        className: "RFCMS__DynamicLayout__Editor__Header__Delete",
        onClick: function onClick() {
          return removeItemAt(index);
        }
      })), React.createElement(DynamicComponentDefinition.Editor, {
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

  return React.createElement(React.Fragment, null, React.createElement("input", {
    onChange: function onChange(e) {
      return updateValue(e.target.value);
    },
    value: value.content
  }), React.createElement("input", {
    onChange: function onChange(e) {
      return updateValue(undefined, e.target.value);
    },
    value: value.url
  }));
};

var MenuEditor = function MenuEditor(_ref) {
  var onUpdate = _ref.onUpdate,
      value = _ref.value;
  var addRow = useCallback(function (e) {
    e.preventDefault();
    onUpdate([].concat(value || [], [{
      url: '',
      content: ''
    }]));
  }, [value]);
  var removeItemAt = useCallback(function (index) {
    var after = [].concat(value.slice(0, index), value.slice(index + 1));
    onUpdate(after);
  }, [value]);
  var replaceItemAt = useCallback(function (index, data) {
    var after = [].concat(value.slice(0, index), [_extends({}, data)], value.slice(index + 1));
    onUpdate(after);
  }, [value]);
  return React.createElement("div", {
    className: "RFCMS__EditorStyles__Editor__Form"
  }, React.createElement("button", {
    onClick: addRow
  }, "Add Menu Item"), React.createElement("div", null, value == null ? void 0 : value.map(function (it, index) {
    return React.createElement("div", {
      key: index + "_",
      className: "RFCMS__MenuEditor__Editor"
    }, React.createElement("div", {
      className: "RFCMS__MenuEditor__Editor__Row"
    }, React.createElement(LinkReferenceEditor, {
      onUpdate: function onUpdate(data) {
        return replaceItemAt(index, data);
      },
      value: it
    }), React.createElement(IoCloseCircle, {
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
      current[c.name] = ((_data$data = data.data) == null ? void 0 : _data$data[c.name]) || undefined;
      return current;
    }, {}));
  }, [fields, data]);

  var submitChanges = function submitChanges(e) {
    e == null ? void 0 : e.preventDefault();
    console.error('Submitting: ', toSubmit);
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
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'image':
        return React.createElement(ImageTextDefinition.Editor, {
          onDataSet: function onDataSet(v) {
            return updateField(field.name, v);
          },
          data: toSubmit[field.name]
        });

      case 'longform':
        return React.createElement(LongFormEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'component':
        return React.createElement(ComponentEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'dynamicLayout':
        return React.createElement(DynamicLayoutDefinition.Editor, {
          onDataSet: function onDataSet(v) {
            return updateField(field.name, v);
          },
          data: toSubmit[field.name]
        });

      case 'url':
        return React.createElement(LinkReferenceEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
          value: toSubmit[field.name]
        });

      case 'menu':
        return React.createElement(MenuEditor, {
          onUpdate: function onUpdate(v) {
            return updateField(field.name, v);
          },
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
    className: "RFCMS__Editable__Dialog",
    onSubmit: submitChanges
  }, React.createElement("span", {
    className: 'Text__Error'
  }, error), fields == null ? void 0 : fields.map(function (field) {
    return React.createElement("div", {
      key: field.name,
      className: "RFCMS__Editable__Dialog__Field"
    }, React.createElement("div", {
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
  var user = useUser$1();

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
    className: className + " RFCMS__Editable " + (preview && 'RFCMS__Editable--Preview')
  }, children, React.createElement(EditableDialog, {
    path: path,
    open: shown,
    fields: fields,
    onClose: function onClose() {
      return setShown(false);
    }
  }), React.createElement("div", {
    className: "RFCMS__Editable__Pencil " + (highlight && 'RFCMS__Editable__Pencil--Highlight') + " " + (preview && 'RFCMS__Editable__Pencil--Preview')
  }, React.createElement(FaPencilAlt, {
    onClick: function onClick() {
      return setShown(true);
    },
    className: "RFCMS__Editable__Pencil__Text"
  }))) : React.createElement(React.Fragment, null, children);
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
  return Component ? React.createElement(Component, Object.assign({}, props, {
    className: className,
    style: style
  })) : React.createElement(React.Fragment, null);
};
var DynamicComponentDefinition = {
  name: 'Dynamic Component',
  key: 'dynamicComponent',
  component: DynamicComponent,
  Editor: function Editor(_ref2) {
    var onDataSet = _ref2.onDataSet,
        data = _ref2.data;
    return React.createElement("div", {
      className: "RFCMS__EditorStyles__Editor__Form"
    }, React.createElement("span", null, "Component"), React.createElement(ComponentEditor, {
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
  var doDelete = useCallback(function () {
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
  return React.createElement(Dialog, {
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

  var _useState = useState(false),
      shown = _useState[0],
      setShown = _useState[1];

  var _useState2 = useState(false),
      highlight = _useState2[0],
      setHighlight = _useState2[1];

  var _useState3 = useState(false),
      preview = _useState3[0],
      setPreview = _useState3[1];

  var firestore = useFirestore();
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
  return userExists ? React.createElement("div", {
    style: style,
    className: className + " RFCMS__Editable " + (preview && 'RFCMS__Editable--Preview')
  }, React.createElement(Delete, {
    open: shown,
    identity: "this page",
    onClose: function onClose() {
      return setShown(false);
    },
    onDelete: function onDelete() {
      return deleteDoc(doc(firestore, path));
    }
  }), React.createElement("div", {
    className: "RFCMS__Editable__Trash " + (highlight && 'RFCMS__Editable__Trash--Highlight') + "  " + (preview && 'RFCMS__Editable__Pencil--Preview')
  }, React.createElement(FaTrash, {
    onClick: function onClick() {
      return setShown(true);
    },
    className: "RFCMS__Editable__Pencil__Text"
  }))) : React.createElement(React.Fragment, null, children);
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
    className: "RFCMS__LoginDialog__Content"
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

export { Deleter, Dialog, DynamicComponent, DynamicComponentDefinition, DynamicLayout, DynamicLayoutDefinition, Editable, ImageText, ImageTextDefinition, Login, Logout, ReactFireCMS, useConfig, useDocument, useField, useUser };
//# sourceMappingURL=react-fire-cms.esm.js.map
