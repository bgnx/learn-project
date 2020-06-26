let x = ({ children, ...stylesObj }, attrsObj = {}) => {
  return {
    styles: stylesObj,
    attrs: attrsObj,
    children,
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
        text: `x`
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
        text: `Todos`
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
            text: `add todo`,
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
              x({ text: `sort by creation time` }),
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

let rerender = () => {
  let root = document.body.firstElementChild;
  root.removeChild(root.firstElementChild)
  root.appendChild(render(App()));
}

let render = (node) => {
  let el = document.createElement(node.styles.tag ? node.styles.tag : `div`);
  if (node.styles.text) {
    el.textContent = node.styles.text;
  } else if (node.children) {
    node.children.forEach(childObj => {
      el.appendChild(render(childObj))
    });
  }
  Object.keys(node.styles).forEach(key => {
    if (key === `text` || key === `children`) return;
    el.style[key] = node.styles[key];
  });
  Object.keys(node.attrs).forEach(key => {
    el[key] = node.attrs[key];
  });
  return el;
}


document.body.firstElementChild.appendChild(render(App()));