import { autocompletion } from '@codemirror/autocomplete';

import { syntaxTree } from '@codemirror/language';

import { variablesFacet } from './VariablesFacet';

export default function() {
  return [
    autocompletion({
      override: [
        completions
      ]
    })
  ];
}

function completions(context) {

  const variables = context.state.facet(variablesFacet)[0];

  const options = variables.map(v => ({
    label: v,
    type: 'variable'
  }));

  let nodeBefore = syntaxTree(context.state).resolve(context.pos, -1);

  // handle inside property name as explicit call
  if (nodeBefore.type.name === 'PropertyName') {
    context.explicit = true;
  }

  let word = context.matchBefore(/\w*/);

  if (word.from == word.to && !context.explicit) {
    return null;
  }

  return {
    from: word.from,
    options
  };
}