import { autocompletion } from '@codemirror/autocomplete';
import { variablesFacet } from './VariablesFacet';

import { syntaxTree } from '@codemirror/language';

export function autocompletionExtension() {
  return [
    autocompletion({
      override: [completions],
    }),
  ];
}

/**
 * @param {import('@codemirror/autocomplete').CompletionContext} context
 */
function completions(context) {
  const variables = context.state.facet(variablesFacet)[0];
  /** @type {import('@codemirror/autocomplete').Completion[]} */
  const objectOptions = variables.map((label) => ({
    displayLabel: `"${label}"`,
    label: `"${label}": `,
    type: 'variable',
    apply: (view, completion, from, to) => {
      const doc = view.state.doc;
      const beforeChar = doc.sliceString(from - 1, from);
      const line = doc.lineAt(from);
      const indentation = /^\s*/.exec(line.text)[0];
      const baseInsert = completion.label;

      if (beforeChar === '{') {
        const insert = `\n  ${indentation}${baseInsert}\n`;
        view.dispatch({
          changes: {
            from,
            to,
            insert,
          },
          selection: {
            anchor: from + insert.length - 1,
          },
        });
      } else if (beforeChar === ',') {
        const insert = `\n${indentation}${baseInsert}`;
        view.dispatch({
          changes: {
            from,
            to,
            insert,
          },
          selection: {
            anchor: from + insert.length,
          },
        });
      } else {
        view.dispatch({
          changes: {
            from,
            to,
            insert: baseInsert,
          },
          selection: {
            anchor: from + baseInsert.length,
          },
        });
      }
    },
  }));
  /** @type {import('@codemirror/autocomplete').Completion[]} */
  const propertyNameOptions = variables.map((label) => ({
    label,
    type: 'variable',
  }));
  /** @type {import('@codemirror/autocomplete').Completion[]} */
  const propertyValueOptions = [
    {
      label: 'true',
      type: 'constant keyword',
      boost: 3,
    },
    {
      label: 'false',
      type: 'constant keyword',
      boost: 2,
    },
    {
      label: 'null',
      type: 'constant keyword',
      boost: 1,
    },
    {
      displayLabel: '[ .. ]',
      label: '[  ]',
      apply: (view, completion, from, to) => {
        view.dispatch({
          changes: { from, to, insert: completion.label },
          selection: { anchor: from + 2 },
        });
      },
    },
    {
      displayLabel: '{ .. }',
      label: '{  }',
      apply: (view, completion, from, to) => {
        view.dispatch({
          changes: { from, to, insert: completion.label },
          selection: { anchor: from + 2 },
        });
      },
    },
  ];
  let finalOptions = [];
  let nodeBefore = syntaxTree(context.state).resolve(context.pos, -1);
  let word = context.matchBefore(/\w*/);

  if (['Object', '{'].includes(nodeBefore.type.name)) {
    finalOptions = objectOptions;
  }

  if (nodeBefore.type.name === 'PropertyName') {
    context.explicit = true;
    finalOptions = propertyNameOptions;
  }

  if (['Property', '[', 'Array'].includes(nodeBefore.type.name)) {
    finalOptions = propertyValueOptions;
  }

  if (word.from == word.to && !context.explicit) {
    return null;
  }

  return {
    from: word.from,
    options: finalOptions,
  };
}
