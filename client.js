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
let Input = ({ text = ``, ...obj } = {}, attrs = {}) => {
  return x({
    ...obj,
    children: [
      x({ tag: `input` }, { value: text, ...attrs })
    ]
  })
}

let Todo = ({ text, onChange = () => { } }) => {
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
          Input({ text: text }, { oninput: (e) => onChange(e.target.value) })
        ]
      }),
      x({
        alignItems: `center`,
        justifyContent: `center`,
        border: `1px solid gray`,
        children: `x`
      })
    ]
  })
}

let todos = [
  { text: `hello1`, creationTime: Math.random() },
  { text: `hello2`, creationTime: Math.random() },
  { text: `hello3`, creationTime: Math.random() },
  { text: `hello4`, creationTime: Math.random() },
  { text: `hello5`, creationTime: Math.random() },
];

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
          }),
          x({
            tag: `button`,
            marginLeft: `10px`,
            children: `add todo`,
          }, {
            onclick: () => {
              console.log(`click`)
            }
          })
        ]
      }),
      x({
        marginTop: `15px`,
        children: todos.map(todo => Todo({
          text: todo.text,
          onChange: (newText) => {
            console.log(newText);
            todo.text = newText;
            rerender();
          }
        }))
      }),
      x({
        marginTop: `10px`,
        children: [
          x({
            children: [
              x({ children: `sort by creation time` }),
              x({
                children: todos.slice().sort((a, b) => a.creationTime - b.creationTime).map(todo => Todo({
                  text: todo.text,
                  onChange: (newText) => {
                    console.log(newText);
                    todo.text = newText;
                    rerender();
                  }
                }))
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
      render(childObj, oldNode ? oldNode.children[i] : null, el);
    });
  }
  node.el = el;
  if (oldNode === null) {
    parentEl.appendChild(el);
  }
}

let node = App();
render(node, null, rootEl);