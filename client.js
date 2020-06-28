let x = ({ children, ...stylesObj }, attrsObj = {}) => {
  return {
    styles: stylesObj,
    attrs: attrsObj,
    children,
    el: null,
  }
}

let Checkbox = (obj = {}) => {
  return x({
    ...obj,
    alignItems: `center`,
    justifyContent: `center`,
    children: [
      x({ tag: `input`, width: `15px`, height: `15px` }, { type: `checkbox` })
    ]
  })
}
let Input = ({ ...obj } = {}, attrs = {}) => {
  return x({
    ...obj,
    children: [
      x({ tag: `input` }, attrs)
    ]
  })
}

let Todo = ({ todo }) => {
  return x({
    flexDirection: `row`,
    border: `1px solid gray`,
    padding: `10px`,
    children: [
      Checkbox(),
      x({
        flex: 1,
        marginLeft: `10px`,
        children: [
          Input({}, {
            value: todo.text,
            oninput: (e) => {
              todo.text = e.target.value;
              rerender();
            }
          })
        ]
      }),
      x({
        alignItems: `center`,
        justifyContent: `center`,
        border: `1px solid gray`,
        children: `x`,
      }, {
        onclick: () => {
          todos.splice(todos.indexOf(todo), 1);
          //request(serverUrl, `deleteTodo`, todo.id);
          console.log(`delete todo`, todo.id)
          rerender();
        }
      })
    ]
  })
}

let todos = [
  { id: 0, text: `hello0`, creationTime: Math.random() },
  { id: 1, text: `hello1`, creationTime: Math.random() },
  { id: 2, text: `hello2`, creationTime: Math.random() },
  { id: 3, text: `hello3`, creationTime: Math.random() },
  { id: 4, text: `hello4`, creationTime: Math.random() },
];
let newTodoText = ``;

let App = () => {
  return x({
    padding: `50px`,
    children: [
      x({
        alignItems: `center`,
        fontSize: `20px`,
        children: `Todos`
      }),
      x({
        marginTop: `15px`,
        flexDirection: `row`,
        children: [
          Input({
            flex: `1`,
            border: `1px solid gray`
          }, { value: newTodoText, oninput: (e) => { newTodoText = e.target.value } }),
          x({
            tag: `button`,
            marginLeft: `10px`,
            children: `add todo`,
          }, {
            onclick: () => {
              todos.push({ id: todos.length, text: newTodoText, creationTime: Math.random() });
              newTodoText = ``;
              rerender();
            }
          })
        ]
      }),
      x({
        marginTop: `15px`,
        children: todos.map(todo => Todo({ todo: todo }))
      }),
      x({
        marginTop: `10px`,
        children: [
          x({
            children: [
              x({ children: `sort by creation time` }),
              x({
                children: todos.slice().sort((a, b) => a.creationTime - b.creationTime).map(todo => Todo({ todo: todo }))
              })
            ]
          })
        ]
      })
    ]
  });
};

let rootEl = document.body.firstElementChild;
let rerender = () => {
  //rootEl.removeChild(rootEl.firstElementChild);
  let newNode = App();
  render(newNode, node, rootEl);
  node = newNode;
}

let render = (node, oldNode, parentEl) => {
  let el = oldNode === null ? document.createElement(node.styles.tag ? node.styles.tag : `div`) : oldNode.el;

  Object.keys(node.styles).forEach(key => {
    if (key === `text` || key === `children`) return;
    if (oldNode === null || node.styles[key] !== oldNode.styles[key]) {
      el.style[key] = node.styles[key];
    }
  });
  Object.keys(node.attrs).forEach(key => {
    if (oldNode === null || node.attrs[key] !== oldNode.attrs[key]) {
      el[key] = node.attrs[key];
    }
  });
  if (typeof node.children === `string`) {
    if (oldNode === null || node.children !== oldNode.children) {
      el.textContent = node.children;
    }
  } else if (node.children) {
    node.children.forEach((childObj, i) => {
      render(childObj, oldNode ? oldNode.children[i] || null : null, el);
    });
  }
  node.el = el;
  if (oldNode === null) {
    parentEl.appendChild(el);
  }
}

let node = App();
render(node, null, rootEl);