---
architecture_md: 1
component: bpmn-io/form-js
lifecycle: production
kind: [ui-library, library]
summary: JSON-schema-driven form viewer, visual form editor and playground for the browser, plus the form JSON Schema and community translations.
team: { name: bpmn-io maintainers, contact: unknown }
intake: { how: issue, template: FEATURE_REQUEST.md }
owns:
  - "The form schema format (components, layout, conditionals, validation, schemaVersion) and its JSON Schema (@bpmn-io/form-json-schema)"
  - "Rendering, validating and submitting a form from a schema and data in the browser (@bpmn-io/form-js-viewer)"
  - "The built-in form field types and their behaviour (textfield, select, datetime, group, dynamic list, table, document preview, ...)"
  - "Visual form editing: palette, drag and drop, selection, modeling commands, form properties panel (@bpmn-io/form-js-editor)"
  - "The form playground: editor, live preview and input/output data editors (@bpmn-io/form-js-playground)"
  - "Extracting the variables a schema reads and writes (getSchemaVariables)"
  - "FEEL expression and feelers template evaluation inside a form (expressionLanguage, templating, conditionChecker services)"
  - "Sanitizing user-provided HTML and markdown rendered in a form"
  - "Form styling: fjs-* class names, form-js CSS variables and the shipped stylesheets"
  - "The translatable key list and community translations for viewer and editor (@bpmn-io/form-js-i18n)"
does_not_own:
  - { concept: "Fetching tasks, submitting form data to the engine, document endpoints and auth in Tasklist", owner: camunda/camunda/webapp/client/apps/orchestration-cluster-webapp/src/tasklist }
  - { concept: "FEEL language semantics and interpreter", owner: bpmn-io/feelin }
  - { concept: "feelers templating language", owner: bpmn-io/feelers }
  - { concept: "Properties panel framework (entries, groups, FEEL editor in the panel)", owner: bpmn-io/properties-panel }
  - { concept: "Event bus, command stack, keyboard, editor actions and translate service", owner: bpmn-io/diagram-js }
  - { concept: "Process variables suggested while editing a form", owner: bpmn-io/form-variable-provider }
  - { concept: "Camunda-specific form lint rules (which elements an engine version supports)", owner: camunda/form-linting }
  - { concept: "Shared bpmn.io theme tokens (--bio-*)", owner: bpmn-io/themes }
  - { concept: "Form element reference documentation for Camunda users", owner: camunda/camunda-docs }
  - { concept: "Saving and deploying forms; linking forms to user tasks in the modelers", owner: camunda/camunda-modeler }
depends_on:
  - id: diagram-js
    component: bpmn-io/diagram-js
    kind: library
    contract: "diagram-js ^15.22.0: EventBus, command stack and CommandInterceptor, keyboard, editor actions, i18n translate module"
    versions: caret range in the viewer and editor package.json; Renovate updates
    workaround_policy: never
  - id: didi
    component: bpmn-io/didi
    kind: library
    contract: "didi ^11.0.0: dependency injection; the module format of every extension"
    versions: caret range in the viewer package.json; Renovate updates
    workaround_policy: never
  - id: properties-panel
    component: bpmn-io/properties-panel
    kind: ui-library
    contract: "@bpmn-io/properties-panel ^3.55.0: panel, groups and entry components used by the editor"
    versions: caret range in the editor package.json; Renovate updates
    workaround_policy: never
  - id: feelin
    component: bpmn-io/feelin
    kind: library
    contract: "@bpmn-io/feelin ^7.0.0: FEEL evaluation for expressions and conditions"
    versions: caret range in the viewer package.json; Renovate updates
    workaround_policy: never
  - id: feelers
    component: bpmn-io/feelers
    kind: library
    contract: "feelers ^3.2.0: templating in text, labels and HTML fields"
    versions: caret range in the viewer package.json; Renovate updates
    workaround_policy: never
  - id: draggle
    component: bpmn-io/draggle
    kind: library
    contract: "@bpmn-io/draggle ^4.1.2: drag and drop in the editor"
    versions: caret range in the editor package.json; Renovate updates
    workaround_policy: never
  - id: cm-theme
    component: bpmn-io/cm-theme
    kind: ui-library
    contract: "@bpmn-io/cm-theme ^0.2.2: CodeMirror theme of the playground data editors"
    versions: caret range in the playground package.json; Renovate updates
    workaround_policy: never
  - id: preact
    component: https://github.com/preactjs/preact
    kind: external
    contract: "preact ^10.29.5: rendering of viewer, editor and playground"
    versions: caret range; Renovate updates
    workaround_policy: never
  - id: dompurify
    component: https://github.com/cure53/DOMPurify
    kind: external
    contract: "dompurify ^3.4.11: HTML sanitizing (Sanitizer.js)"
    versions: caret range; Renovate updates
    workaround_policy: never
consumers:
  - { who: camunda/camunda/webapp/client/apps/orchestration-cluster-webapp/src/tasklist, via: "@bpmn-io/form-js-viewer (Form, getSchemaVariables, FeelersTemplating, ConditionChecker; documentEndpointBuilder replaced via additionalModules; form-js.css)", promise: "semver; pinned exactly (2.1.1), upgraded by Renovate" }
  - { who: camunda/camunda-modeler, via: "@bpmn-io/form-js (client)", promise: semver }
  - { who: camunda/camunda-hub, via: "@bpmn-io/form-js (hub app and test-studio)", promise: "semver; pinned exactly" }
  - { who: camunda/camunda-desktop, via: "@bpmn-io/form-js-viewer (renderer)", promise: "semver; pinned exactly" }
  - { who: camunda/form-playground, via: "@bpmn-io/form-js", promise: semver }
  - { who: bpmn-io/form-variable-provider, via: "@bpmn-io/form-js editor extension (additionalModules)", promise: "semver (peer >=2.0.0)" }
  - { who: camunda/form-linting, via: "@bpmn-io/form-json-schema", promise: semver }
  - { who: camunda/camunda-docs, via: "@bpmn-io/form-js", promise: semver }
  - { who: camunda/camunda-7-to-8-migration-tooling, via: "@bpmn-io/form-js-viewer (diagram converter webapp)", promise: semver }
  - { who: camunda/camunda-bpm-platform-maintenance, via: "@bpmn-io/form-js, form-js-editor and form-js-carbon-styles 1.8.7 (Camunda 7 webapps)", promise: "pinned to the 1.x line" }
  - { who: bpmn-io/themes, via: "@bpmn-io/form-js, @bpmn-io/form-js-playground", promise: semver }
  - { who: "npm embedders (bpmn-io/form-js-examples, bpmn-io/react-form-js, customer apps)", via: "all published packages and the UMD bundles", promise: semver }
  - { who: "form authors, editors and coding agents writing form JSON", via: "form schema and https://unpkg.com/@bpmn-io/form-json-schema/resources/schema.json", promise: "schemaVersion; see section 5 C1" }
exposes:
  - { contract: "@bpmn-io/form-js-viewer: Form, createForm, importSchema/submit/validate/reset/setProperty, events, schemaVersion, getSchemaVariables, core services, field components", spec: packages/form-js-viewer/README.md, policy: "semver; breaking changes listed in packages/form-js/CHANGELOG.md" }
  - { contract: "@bpmn-io/form-js-editor: FormEditor, createFormEditor, importSchema/saveSchema, events, hooks (useService, useVariables, usePropertiesPanelService), ContextPadModule", spec: packages/form-js-editor/README.md, policy: semver }
  - { contract: "@bpmn-io/form-js-playground: Playground", spec: packages/form-js-playground/README.md, policy: semver }
  - { contract: "@bpmn-io/form-js: re-export of viewer, editor and playground, UMD bundles (./viewer, ./editor, ./playground) and CSS assets", spec: README.md, policy: semver }
  - { contract: "TypeScript type definitions (dist/types)", spec: packages/form-js-integration/src/application.ts, policy: "semver; checked by form-js-integration test:types" }
  - { contract: "Form schema (schemaVersion 19)", spec: docs/FORM_SCHEMA.md, policy: "schemaVersion bumped on schema changes; the editor writes the current version on save" }
  - { contract: "@bpmn-io/form-json-schema: resources/schema.json", spec: packages/form-json-schema/README.md, policy: "own version line (1.x); compatibility table in its README" }
  - { contract: "@bpmn-io/form-js-i18n: translations/*.js and docs/translations.json key list", spec: packages/form-js-i18n/README.md, policy: semver }
  - { contract: "Extension point: modules / additionalModules (didi) on Form, FormEditor and Playground — add services or replace any built-in one (documentEndpointBuilder, expressionLanguage, templating, conditionChecker, translate, markdownRenderer, ...)", spec: packages/form-js-viewer/README.md, policy: "service names and signatures are API; TODO(confirm) which services are supported for replacement" }
  - { contract: "Extension point: formFields.register(type, component) — add or replace a field type in viewer and editor; the editor palette and properties panel read the field's config", spec: packages/form-js-viewer/src/render/FormFields.js, policy: semver }
  - { contract: "Extension point: propertiesPanel.registerProvider(provider, priority) — add, change or remove property groups and entries for a field", spec: packages/form-js-editor/src/features/properties-panel/PropertiesPanelRenderer.js, policy: semver }
  - { contract: "Extension point: renderInjector.attachRenderer(identifier, Renderer) — inject UI into the editor's slots", spec: packages/form-js-editor/src/features/render-injection/RenderInjector.js, policy: semver }
  - { contract: "Extension point: eventBus listeners with priority and CommandInterceptor on editor modeling commands — observe, veto or extend behaviour", spec: packages/form-js-editor/README.md, policy: "event names and payloads are API" }
  - { contract: "Styling: fjs-* class names, form-js CSS variables and dist/assets stylesheets", spec: packages/form-js/CHANGELOG.md, policy: "treated as API: removals and renames are breaking (see 2.0.0)" }
constraints:
  - { id: C1, name: Form schema compatibility and schemaVersion, hard: true, ref: docs/FORM_SCHEMA.md }
  - { id: C2, name: Public API and extension points stay backwards compatible, hard: true, ref: packages/form-js/CHANGELOG.md }
  - { id: C3, name: Hosts (Tasklist and modelers) follow visual and behaviour changes, hard: false, ref: .github/PULL_REQUEST_TEMPLATE.md }
  - { id: C4, name: User-visible strings are translatable, hard: true, ref: packages/form-js-i18n/README.md }
  - { id: C5, name: Accessibility (axe WCAG 2.1 AA checks), hard: true, ref: packages/form-js-viewer/test/helper/index.js }
  - { id: C6, name: Untrusted content is sanitized, hard: true, ref: packages/form-js-viewer/src/render/components/Sanitizer.js }
  - { id: C7, name: Package dependency direction, hard: true, ref: eslint.config.mjs }
  - { id: C8, name: Styling and visual regression, hard: false, ref: e2e/README.md }
  - { id: C9, name: bpmn-io definition of done, hard: true, ref: AGENTS.md }
planning: { plans_dir: docs/plans, issue_templates: { increment: TASK.md, epic: FEATURE_REQUEST.md } }
---

# Architecture — bpmn-io/form-js

> Draft from the repository; not reviewed by its team.

## 1. Purpose
form-js lets applications view, submit, visually edit and simulate JSON-defined forms in the
browser. Camunda uses it for user task and start forms (Tasklist renders them; Desktop Modeler and
Web Modeler edit them); anyone can embed it from npm. No system is described in a `SYSTEM.md`
yet; the bpmn-io ecosystem map ([`bpmn-io/ecosystem` MAP.md](https://github.com/bpmn-io/ecosystem/blob/main/MAP.md))
places it in the domain-modelers layer.

## 2. Ownership boundary
**Owns:** the form schema and its JSON Schema; rendering, validation and submission of a form;
the built-in field types; the visual editor and its properties panel content; the playground;
schema variable extraction; FEEL and template evaluation inside a form; HTML sanitizing; form
styling; translation keys and community translations. See `owns` in the front matter.

**Does not own (route here instead):**
| If you need… | It belongs to | How to ask |
|---|---|---|
| Loading tasks, submitting to the engine, document download auth, which form a task shows | `camunda/camunda/…/src/tasklist` | Tasklist team issue; form-js only offers the `documentEndpointBuilder` hook |
| A FEEL function or FEEL evaluation change | `bpmn-io/feelin` | Issue in that repo |
| A feelers templating change | `bpmn-io/feelers` | Issue in that repo |
| A new properties panel entry type or panel behaviour | `bpmn-io/properties-panel` | Issue in that repo; form-js only composes groups |
| Process variables offered while editing | `bpmn-io/form-variable-provider` | Issue in that repo |
| "Is this element supported by engine version X" lint rules | `camunda/form-linting` | Issue in that repo |
| Theme colour tokens (`--bio-*`) | `bpmn-io/themes` | Issue in that repo |
| Saving, deploying, linking a form to a user task | `camunda/camunda-modeler`, `camunda/camunda-hub` | Their teams |
| Form element reference docs | `camunda/camunda-docs` | Docs issue |
| Carbon theming of forms | the host application | `@bpmn-io/form-js-carbon-styles` is deprecated since 2.0.0 |

## 3. Structure
npm workspaces under `packages/`:

| Package | Path | Role |
|---|---|---|
| `@bpmn-io/form-js-viewer` | `packages/form-js-viewer` | `Form`; `core/` (importer, registries, layouter, validator), `render/` (Preact field components), `features/` (expression language, markdown, repeat render, viewer commands), `util/` |
| `@bpmn-io/form-js-editor` | `packages/form-js-editor` | `FormEditor`; `core/`, `render/` (editor field wrappers), `features/` (modeling, palette, properties-panel, dragging, selection, context-pad, render-injection, keyboard) |
| `@bpmn-io/form-js-playground` | `packages/form-js-playground` | `Playground`: editor + viewer + CodeMirror data editors |
| `@bpmn-io/form-js` | `packages/form-js` | Re-exports the three above; UMD bundles and CSS; the CHANGELOG |
| `@bpmn-io/form-json-schema` | `packages/form-json-schema` | JSON Schema of the form schema |
| `@bpmn-io/form-js-i18n` | `packages/form-js-i18n` | Translations, key list, collector used by viewer and editor tests |
| `@bpmn-io/form-js-integration` | `packages/form-js-integration` | Private; type-checks the public typings |

**Dependency direction:** viewer ← editor ← playground ← form-js. The viewer depends on no other
package of the repo; the editor reuses viewer services and components. `eslint.config.mjs`
(`import/no-restricted-paths`) stops a package's `src` from importing another package by relative
path. Every behaviour is a didi module; new features go in as a module under `features/`, wired
in `_getModules()` (`Form.js`, `FormEditor.js`).

## 4. Binding decisions
No ADR index in the repo. TODO(confirm): is there one elsewhere? Decisions read from the code and
CHANGELOG that shape most features:
- One schema format for viewer and editor; the viewer exports `schemaVersion`, the editor writes it.
- Extension through didi modules (`additionalModules`), the field registry and properties
  providers, not through forks or subclassing (bpmn-io convention, see the ecosystem map).
- Preact rendering; diagram-js supplies event bus, command stack and translate.
- Styling via form-js CSS variables bound to `@bpmn-io/theme`; no Carbon dependency (2.0.0).
- Fix defects at their source, don't work around them (central bpmn-io AGENTS.md).

## 5. Planning constraints
Every plan must answer each of these (applies / n/a + decision or reason).

### C1 — Form schema compatibility and schemaVersion
- **Question:** Does the change alter the schema (new field type, property or semantics)? Then:
  is `schemaVersion` bumped in `form-js-viewer/src/index.js`, `form-json-schema` updated (its
  `maximum` and README compatibility table), and do forms saved with older versions still import
  and behave the same? TODO(confirm): the policy for older schemas and for consumers whose engine
  or Tasklist runs an older form-js.
- **Hard:** yes
- **Detail:** [docs/FORM_SCHEMA.md](docs/FORM_SCHEMA.md), [form-json-schema](packages/form-json-schema/README.md)

### C2 — Public API and extension points stay backwards compatible
- **Question:** Does it change an exported API, event name or payload, service name, field
  `config`, properties provider contract or typing? If breaking: major release, "Breaking
  Changes" in the CHANGELOG, commit marked breaking.
- **Hard:** yes
- **Detail:** [CHANGELOG](packages/form-js/CHANGELOG.md), [typings check](packages/form-js-integration/src/application.ts)

### C3 — Hosts follow visual and behaviour changes
- **Question:** Does it add a form element or visibly change one? Then which hosts (Tasklist,
  Desktop Modeler, Web Modeler, docs) need a follow-up issue, and who creates it?
- **Hard:** no
- **Detail:** [PR template](.github/PULL_REQUEST_TEMPLATE.md) (still links `camunda/tasklist`;
  Tasklist now lives in `camunda/camunda`. TODO(confirm) the target.)

### C4 — User-visible strings are translatable
- **Question:** Are new strings passed through `translate`, collected into
  `form-js-i18n/docs/translations.json` (`npm run collect-translations`) and added to `en.js`?
- **Hard:** yes
- **Detail:** [form-js-i18n](packages/form-js-i18n/README.md)

### C5 — Accessibility
- **Question:** Do new or changed fields pass the axe checks (WCAG 2.0/2.1 A and AA,
  best-practice) used in the viewer tests, with labels, keyboard use and focus handled?
- **Hard:** yes. TODO(confirm) that this is a release blocker.
- **Detail:** [viewer test helper](packages/form-js-viewer/test/helper/index.js)

### C6 — Untrusted content is sanitized
- **Question:** Does it render schema- or data-provided HTML, markdown, URLs, iframes or documents?
  Is it sanitized (DOMPurify via `Sanitizer.js`) and are responses not trusted (see GHSA in 1.26.1)?
- **Hard:** yes
- **Detail:** [Sanitizer.js](packages/form-js-viewer/src/render/components/Sanitizer.js)

### C7 — Package dependency direction
- **Question:** Does it keep viewer ← editor ← playground ← form-js, and put shared logic in the
  viewer rather than importing editor code into the viewer?
- **Hard:** yes
- **Detail:** [eslint.config.mjs](eslint.config.mjs)

### C8 — Styling and visual regression
- **Question:** Does it change CSS classes or variables (API for hosts that theme forms)? Are
  visual snapshots updated in the Playwright container?
- **Hard:** no
- **Detail:** [e2e/README.md](e2e/README.md)

### C9 — bpmn-io definition of done
- **Question:** Working, clean, tested, `npm run all` green; Conventional Commits.
- **Hard:** yes
- **Detail:** [AGENTS.md](AGENTS.md) → central bpmn-io AGENTS.md

## 6. Data and persistence
None. form-js keeps form state in memory; the host stores schemas and submits data. The form
schema (C1) is the only persisted format it defines.

## 7. Cross-cutting qualities
- **Security:** HTML, markdown and documents are sanitized (C6); document requests can be
  customized by the host (`documentEndpointBuilder`), auth is the host's.
- **Accessibility:** axe checks in viewer tests (C5).
- **i18n:** `translate` service from diagram-js; keys and translations in `form-js-i18n` (C4).
- **Performance:** a stress example exists (`npm run start:viewer:stress`); no stated budget.
  TODO(confirm).
- **Browser support:** tests run in Chrome headless and Firefox; no supported-browser list found.
  TODO(confirm).

## 8. Delivery
- npm packages released together with one version (`releaseConfig.strategy: fixed`, `bio-release`);
  `@bpmn-io/form-json-schema` has its own version line (1.18.0). TODO(confirm) how it is released.
- Branches: work lands on `develop`; `main` is merged back into `develop` automatically.
  TODO(confirm) which branch releases are cut from.
- Stable releases update the demo, examples and bpmn.io website (`POST_RELEASE.yml`).
- Semver; breaking changes listed in the CHANGELOG. No backports seen. TODO(confirm) whether 1.x
  still gets fixes (Camunda 7 webapps pin 1.8.7).
- Hosts pick up versions through Renovate, several pinned exactly; a change reaches Tasklist users
  only after a `camunda/camunda` bump and its release.
- Development on Node 24 (`.nvmrc`, CI); the README's "Node 16" note is out of date.

## 9. Testing expectations
- Unit and integration tests per package with Karma + Mocha (Chrome headless, Firefox on Linux CI),
  given/when/then, little mocking (central AGENTS.md); coverage to Codecov.
- `test:distro` checks the built bundles; `form-js-integration` checks the TypeScript typings.
- `form-json-schema` tests the schema with Mocha; `form-js-i18n` checks translations against the key list.
- Visual regression with Playwright in the official container (`e2e/`); snapshots via the
  `update-snapshots` label.
- CI matrix: Linux, macOS, Windows on Node 24. `npm run all` must pass.

## 10. Planning conventions
Issues and PRs follow the central bpmn-io process (`bpmn-io-create-issue` and `bpmn-io-create-pr`
skills; org issue templates `FEATURE_REQUEST.md`, `TASK.md`, `BUG_REPORT.md`). PRs say
`Closes #<issue>`. TODO(confirm): plans directory (`docs/plans` assumed), ID prefix, labels for
cross-repo requests.

## 11. Glossary
- **Form schema:** the JSON document (`type`, `components`, `schemaVersion`) form-js renders and edits.
- **schemaVersion:** integer version of the form schema format; not the npm version.
- **form-json-schema:** the JSON Schema that validates a form schema; not the form schema itself.
- **Form field / component:** an element of `components`; a field type is registered in `formFields`.
- **Key / path:** where a field reads and writes its value in the form data; `getSchemaVariables`
  derives inputs and outputs from them.
- **Playground (package):** `@bpmn-io/form-js-playground`; not `camunda/form-playground`, which wraps it.
- **Templating:** feelers templates (`{{ }}`) in text; **expressions:** FEEL (`=…`) in properties.
