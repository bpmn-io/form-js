export function Section(props) {
  const elements = Array.isArray(props.children) ? props.children : [props.children];

  const { headerItems, children } = elements.reduce(
    (_, child) => {
      const bucket = child.type === Section.HeaderItem ? _.headerItems : _.children;

      bucket.push(child);

      return _;
    },
    { headerItems: [], children: [] },
  );

  return (
    <div class="fjs-pgl-section">
      <h1 class="header">
        {props.name} {headerItems.length ? <span class="header-items">{headerItems}</span> : null}
      </h1>
      <div class="body">{children}</div>
    </div>
  );
}

Section.HeaderItem = function (props) {
  return props.children;
};
