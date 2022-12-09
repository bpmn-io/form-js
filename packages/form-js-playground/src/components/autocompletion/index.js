import { autocompletion } from '@codemirror/autocomplete';

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

  let word = context.matchBefore(/\w*/);

  if (word.from == word.to && !context.explicit) {
    return null;
  }

  return {
    from: word.from,
    options
  };
}