import {
  wrapCSSStyles
} from '../../../../../src/render/components/util/domUtil.js';

describe('#domUtil', function() {

  const testCases = [
    {
      description: 'prefix simple styles with an id',
      selector: '#prefix',
      style: '.foo { color: red; }',
      expected: '#prefix .foo { color: red; }'
    },
    {
      description: 'prefix simple styles with a class',
      selector: '.prefix',
      style: '.foo { color: red; }',
      expected: '.prefix .foo { color: red; }'
    },
    {
      description: 'prefix complex styles with an id',
      selector: '#prefix',
      style: '.foo, .bar { color: red; }',
      expected: '#prefix .foo, #prefix .bar { color: red; }'
    },
    {
      description: 'prefix complex styles with a class',
      selector: '.prefix',
      style: '.foo, .bar { color: red; }',
      expected: '.prefix .foo, .prefix .bar { color: red; }'
    },
    {
      description: 'prefix multiple styles with an id',
      selector: '#prefix',
      style: '.foo { color: red; } .bar { color: blue; }',
      expected: '#prefix .foo { color: red; } #prefix .bar { color: blue; }'
    },
    {
      description: 'prefix multiple styles with a class',
      selector: '.prefix',
      style: '.foo { color: red; } .bar { color: blue; }',
      expected: '.prefix .foo { color: red; } .prefix .bar { color: blue; }'
    },
    {
      description: 'prefix nested CSS',
      selector: '#prefix',
      style: '.foo { & div { color: red; } } .foo .bar { color: blue; }',
      expected: '#prefix .foo { & div { color: red; } } #prefix .foo .bar { color: blue; }'
    },
    {
      description: 'prefix very complex CSS',
      selector: '#prefix',
      style: '.foo { & div { color: red; } } .foo .bar { color: blue; } .foo, .bar { color: green; }',
      expected: '#prefix .foo { & div { color: red; } } #prefix .foo .bar { color: blue; } #prefix .foo, #prefix .bar { color: green; }'
    },
    {
      description: 'prefix very nested CSS',
      selector: '#prefix',
      style: '.foo { & div { color: red; & span { color: blue; } } }',
      expected: '#prefix .foo { & div { color: red; & span { color: blue; } } }'
    }
  ];

  testCases.forEach(({ description, selector, style, expected }) => {

    it(`should ${description}`, function() {

      // given
      const [ rootNode, styleNode ] = buildNodeWithStyle(style);

      // when
      wrapCSSStyles(rootNode, selector);

      // then
      expect(styleNode.textContent.replace(/\s+/g, ' ').trim()).to.eql(expected);
    });

  });

});

function buildNodeWithStyle(styleTextContent) {
  const rootNode = document.createElement('div');
  const styleNode = document.createElement('style');
  styleNode.textContent = styleTextContent;
  rootNode.appendChild(styleNode);
  return [ rootNode, styleNode ];
}
