# Changelog

All notable changes to [form-js](https://github.com/bpmn-io/form-js) are documented here. We use [semantic versioning](http://semver.org/) for releases.

## Unreleased

___Note:__ Yet to be released changes appear here._

## 1.8.2

* `FIX`: prevent prototype polution through keys and paths ([#1111](https://github.com/bpmn-io/form-js/issues/1111))
* `FIX`: make the JSON editor readonly truly readonly ([#1107](https://github.com/bpmn-io/form-js/issues/1107))

## 1.8.1

* `CHORE`: monkey patch `formPlayground.init` event back into the release for compatibility reasons ([#1076](https://github.com/bpmn-io/form-js/issues/1076))

## 1.8.0

* `FEAT`: implemented new `expression` field, allowing precomputation of data at runtime using FEEL ([#1073](https://github.com/bpmn-io/form-js/issues/1073))
* `FEAT`: overhaul the json editor components ([#1101](https://github.com/bpmn-io/form-js/issues/1101))
* `FIX`: improved the editor selection autoscroll ([#1106](https://github.com/bpmn-io/form-js/issues/1106))
* `FIX`: form playground no longer loads forms twice under some circumstances ([8aad0b6f](https://github.com/bpmn-io/form-js/commit/8aad0b6f6e97cb0f656a2b4c962de845992ff834))
* `FIX`: ensure palette renderer is immediately initialised ([988fbc7b](https://github.com/bpmn-io/form-js/commit/988fbc7b45bafedbe6e97d8a5a89a9e5f59285d5))
* `FIX`: display groups with no outline with a dashed outline in the editor ([#1084](https://github.com/bpmn-io/form-js/issues/1084))
* `FIX`: variables with keyword names like `duration` can now be used in feel expression ([#975](https://github.com/bpmn-io/form-js/issues/975))
* `FIX`: ensure dynamic list and tables interact safely ([#1064](https://github.com/bpmn-io/form-js/issues/1064))
* `CHORE`: replaced our markdown renderer from `showdown` to `marked` ([#1091](https://github.com/bpmn-io/form-js/issues/1091))
* `CHORE`: reduced text sizing in json editor components ([#1078](https://github.com/bpmn-io/form-js/issues/1078))

## 1.7.3

* `FIX`: properly pass `this` variable context to dynamic list elems  ([#1086](https://github.com/bpmn-io/form-js/pull/1086))

## 1.7.2

* `FIX`: non-submit buttons in the library now have `type="button"` ([#1077](https://github.com/bpmn-io/form-js/issues/1077))
* `FIX`: field readonly property now hidden when disabled property is set ([#1063](https://github.com/bpmn-io/form-js/issues/1063))
* `FIX`: expression-driven options fields now properly initialize with input values ([#1067](https://github.com/bpmn-io/form-js/issues/1067))
* `CHORE`: temporarily restrict preact dependency version to `<= 10.15.1` due to conflict with dragula ([#1057](https://github.com/bpmn-io/form-js/issues/1057))

## 1.7.1

* `FEAT`: fields announce their descriptions and labels properly ([#1043](https://github.com/bpmn-io/form-js/pull/1043))
* `FIX`: ensure searchable select filter is cleared with options ([#1056](https://github.com/bpmn-io/form-js/pull/1056))
* `FIX`: ensure repeatRenderManager passes down props correctly ([#1033](https://github.com/bpmn-io/form-js/pull/1033))
* `FIX`: prevent blur event from having value of out sync ([#1052](https://github.com/bpmn-io/form-js/pull/1052))
* `FIX`: ensure simpleSelect mouseDown event deactivates normally ([#1046](https://github.com/bpmn-io/form-js/pull/1046))
* `FIX`: ensure html content variables are included in getSchemaVariables ([#1048](https://github.com/bpmn-io/form-js/pull/1048))
* `FIX`: validate instead of automatically resetting height entries ([#1034](https://github.com/bpmn-io/form-js/pull/1034))
* `FIX`: fix HTML component link ([#1039](https://github.com/bpmn-io/form-js/pull/1039))

## 1.7.0

* `FIX`: resize textarea on input changes ([#1011](https://github.com/bpmn-io/form-js/issues/1011))
* `FIX`: synchronize field validation properly ([#1009](https://github.com/bpmn-io/form-js/issues/1009))
* `DEPS`: @bpmn-io/properties-panel@3.18.1 ([a4e9b6d](https://github.com/bpmn-io/form-js/commit/a4e9b6dbd3f6f01e9f88d04b43f77f94b745403d))

## 1.7.0-alpha.0

* `FEAT`: implement HTML component and cleanup Text component ([#999](https://github.com/bpmn-io/form-js/pull/999))
* `FIX`: repeatable entry parameters now validate with errors ([#1000](https://github.com/bpmn-io/form-js/pull/1000))
* `FIX`: show iframe title in editor ([#991](https://github.com/bpmn-io/form-js/pull/991))
* `FIX`: prevent demo data from being created on edited tables ([#1005](https://github.com/bpmn-io/form-js/pull/1005))
* `DEPS`: update to diagram-js@13.4.0, min-dash@4.2.1, min-dom@4.1.0, @bpmn-io/properties-panel@3.18.0 ([#1008](https://github.com/bpmn-io/form-js/pull/1008)) ([#1016](https://github.com/bpmn-io/form-js/pull/1016))

## 1.6.4

* `FIX`: explicitly depend on lodash ([#971](https://github.com/bpmn-io/form-js/pull/971))

## 1.6.3

* `FIX`: revert broken debouncing on number field ([#958](https://github.com/bpmn-io/form-js/issues/958))

## 1.6.2

* `FIX`: improved performance through viewer debounce ([#958](https://github.com/bpmn-io/form-js/issues/958))
* `FIX`: properly handle all formats of options sources ([#960](https://github.com/bpmn-io/form-js/issues/960))

## 1.6.1

* `FIX`: allow scripts in iframes by default ([#954](https://github.com/bpmn-io/form-js/issues/954))

## 1.6.0

### General

* `FEAT`: add dynamic list component ([#796](https://github.com/bpmn-io/form-js/issues/796))
* `FEAT`: add table component ([#888](https://github.com/bpmn-io/form-js/issues/888))
* `DEPS`: update to feelin@3 ([0fdf5e19](https://github.com/bpmn-io/form-js/commit/0fdf5e19f45a614cb5cc123f9aa264003641634f))

## 1.5.0

### General

* `FEAT`: added a new `form-json-schema` package ([6690d2e2](https://github.com/bpmn-io/form-js/commit/6690d2e2835bd95302577d567379e89451a3ac57))
* `FEAT`: introduced new SASS stylesheets to move away from styled-components ([633](https://github.com/bpmn-io/form-js/issues/633))
* `FEAT`: support iFrame component ([#887](https://github.com/bpmn-io/form-js/issues/887))
* `DEPS`: update to feelin@2.3 & feelers@1.2, bringing in new FEEL functionality ([4765bb24](https://github.com/bpmn-io/form-js/commit/4765bb2408aed0c02ae77c0449ade7a195f64b04))

### Viewer

* `FIX`: properly close dropdowns when opening other dropdowns ([#878](https://github.com/bpmn-io/form-js/issues/878))
* `FIX`: improved input data sanitation ([#894](https://github.com/bpmn-io/form-js/issues/894)) 
* `FIX`: ensure values not in options clear ([#817](https://github.com/bpmn-io/form-js/issues/817))

### Editor

* `FIX`: fixed an issue dragging rows into groups ([#861](https://github.com/bpmn-io/form-js/issues/861))
* `FIX`: adjusted palette size ([#846](https://github.com/bpmn-io/form-js/issues/846))
* `FIX`: renamed checklist and radio ([#846](https://github.com/bpmn-io/form-js/issues/846))

### Playground

* `FIX`: add tabIndex to json editors ([ad6c00fb](https://github.com/bpmn-io/form-js/commit/ad6c00fb581943d4fb278f7dbcda02d5c544dfca))

### Breaking Changes

The `@bpmn-io/form-js-carbon-styles` deprecates the `carbon-styles.js` styled component export. The `type` definitions got removed from the package. Please use the `src/carbon-styles.scss` stylesheet instead.

## 1.4.1

### Editor

* `FIX`: clean up default value on options source change ([#859](https://github.com/bpmn-io/form-js/issues/859))
* `FIX`: improve color contrast in input data placeholder ([#876](https://github.com/bpmn-io/form-js/pull/876))
* `FIX`: add title to remove action ([#877](https://github.com/bpmn-io/form-js/pull/877))
* `DEPS`: update to `@bpmn-io/properties-panel@3.13.0`

## 1.4.0

### General 

* `FEAT`: support custom form fields ([#123](https://github.com/bpmn-io/form-js/issues/123))
* `FEAT`: implement separator form field ([#480](https://github.com/bpmn-io/form-js/issues/480))
* `FEAT`: implement <formField.search> events ([#785](https://github.com/bpmn-io/form-js/issues/785))
* `CHORE`: update schemaVersion to 12

### Viewer

* `FEAT`: provide more customization options, as of ([#776](https://github.com/bpmn-io/form-js/pull/776))
  * extending form field config via `icon`, `iconUrl`, `propertiesPanelEntries`
  * re-export core components as `Label`, `Description`, `Errors`
* `FEAT`: make it easier to navigate over tags in `taglist` component([#435](https://github.com/bpmn-io/form-js/issues/435))
* `FEAT`: add focus and blur events ([#841](https://github.com/bpmn-io/form-js/pull/841))

### Editor

* `FEAT`: add properties panel providers mechanism ([#776](https://github.com/bpmn-io/form-js/pull/776))
* `FEAT`: collect palette entries and properties panel header information via form field configs ([#776](https://github.com/bpmn-io/form-js/pull/776))
* `FEAT`: add `isDefaultVisible` control to all properties panel entries ([#776](https://github.com/bpmn-io/form-js/pull/776))
* `FEAT`: re-export hooks
* `FEAT`: better keyboard support for pallette entries ([#536](https://github.com/bpmn-io/form-js/issues/536))
* `DEPS`: update to `@bpmn-io/properties-panel@3.11.0`
* `FIX`: improve pallette visuals ([#539](https://github.com/bpmn-io/form-js/issues/539)) ([#848](https://github.com/bpmn-io/form-js/issues/848))

### Playground

* `FEAT`: provide `additionalModules` to both viewer and editor ([#776](https://github.com/bpmn-io/form-js/pull/776))

## 1.3.3

## General

* `FIX`: getSchemaVariables filters all non-string variables ([#860](https://github.com/bpmn-io/form-js/issues/860))
* `FIX`: properly handle getSchemaVariables when combining contexts with paths ([#860](https://github.com/bpmn-io/form-js/issues/860))

## 1.3.2

### Viewer

* `FIX`: cleanup errors for hidden fields ([#825](https://github.com/bpmn-io/form-js/issues/825))
* `FIX`: hide controls from readonly number fields ([#810](https://github.com/bpmn-io/form-js/issues/810))

### General

* `FIX`: resize datetime properly ([#781](https://github.com/bpmn-io/form-js/issues/781))
* `FIX`: remove dateime unnecessary event context ([cc598798](https://github.com/bpmn-io/form-js/commit/cc598798986e67d56406d43a9dea424102e7546d))
* `DEPS`: bumped feelin@1.2.0 && feelers@1.0.0

## 1.3.1

### Editor

* `FIX`: cleanup FEEL popup editor lifecycle events
* `DEPS`: updated `properties-panel` to v3.8.0

## 1.3.0

### General

* `FEAT`: localized date picker based on browser language ([#733](https://github.com/bpmn-io/form-js/issues/733))
* `FEAT`: implemented Group component with multiple updates ([#768](https://github.com/bpmn-io/form-js/pull/768))
  * dynamic input/output data access
  * proper group component implementation
  * new `pathRegistry` module for conflict-free path and key management
  * added validation for drag-and-drop and properties panel in nested scenarios
  * introduced `EmptyRoot` render context for root of empty forms
  * enhanced `getSchemaVariables` for nested components
  * additional changes detailed in epic and pr
* `FEAT`: Added support for nested component keys ([#464](https://github.com/bpmn-io/form-js/issues/464))
* `FIX`: Dropdown options no longer reset when form reopens ([#764](https://github.com/bpmn-io/form-js/issues/764))
* `FIX`: Removed keying from buttons ([#778](https://github.com/bpmn-io/form-js/issues/778))
* `FIX`: Update options when expression evaluation changed ([#809](https://github.com/bpmn-io/form-js/issues/809))
* `CHORE`: Update schemaVersion to 11
* `DEPS`: Updated `properties-panel` to v3.7.0

### Viewer

* `CHORE`: export `FormField` component ([#797](https://github.com/bpmn-io/form-js/pull/797))

### Editor

* `FEAT`: allow defining `propertiesPanel.feelPopupContainer` ([#795](https://github.com/bpmn-io/form-js/pull/795))
* `FEAT`: incorporate `FeelPopup` module to interact via API ([#814](https://github.com/bpmn-io/form-js/pull/814))
* `FEAT`: add phone validation tooltip ([#815](https://github.com/bpmn-io/form-js/pull/815))

### Playground

* `FEAT`: added placeholder to playground input panel ([0f696119](https://github.com/bpmn-io/form-js/commit/0f6961191c076f8cc2d221428b2d7fdbab9a2fe3))

## 1.2.0

* `FEAT`: implement first set of tooltips ([e36de9a78](https://github.com/bpmn-io/form-js/commit/e36de9a78088485f6fdc65fea639d60779dceab9))
* `FIX`: dynamically set drag and drop axis ([34767366](https://github.com/bpmn-io/form-js/commit/3476736615050a301ab240c54da6658f579593cd))
* `FIX`: serialize empty labels as empty string ([3a700de5](https://github.com/bpmn-io/form-js/commit/3a700de5629c5244e49cdc8e507d38b790323321))
* `DEPS`: replaced `dragula` with our own `@bpmn-io/draggle@4.0.0` fork ([34767366](https://github.com/bpmn-io/form-js/commit/3476736615050a301ab240c54da6658f579593cd))

## 1.1.0

### General

* `FEAT`: add `spacer` component ([#731](https://github.com/bpmn-io/form-js/issues/731))
* `FIX`: properly parse variables in FEEL filter expressions ([#711](https://github.com/bpmn-io/form-js/pull/711))
* `FIX`: break overflowing words in text views ([#651](https://github.com/bpmn-io/form-js/issues/651))
* `CHORE`: update schemaVersion to 10
* `DEPS`: update to `@bpmn-io/properties-panel@3`
* `DEPS`: update to `feelin@1`
* `DEPS`: update to `feelers@0.1`

### Viewer

* `FEAT`: eagerly validate on blur and input ([#610](https://github.com/bpmn-io/form-js/pull/610))
* `FEAT`: support defining input/output in `getSchemaVariables` ([#555](https://github.com/bpmn-io/form-js/issues/555))
* `FIX`: hide empty rows in DOM tree ([#684](https://github.com/bpmn-io/form-js/issues/684))
* `FIX`: improve auto resize behavior in text views ([#546](https://github.com/bpmn-io/form-js/issues/546))

### Editor

* `FEAT`: update empty state for form editor ([#336](https://github.com/bpmn-io/form-js/issues/336))
* `FIX`: serialize empty text as empty string ([`cbcfdb5e`](https://github.com/bpmn-io/form-js/commit/cbcfdb5e67bd9347444d71a390e755623eecfb8f))
* `FIX`: render placeholder for whitespace empty text views ([#721](https://github.com/bpmn-io/form-js/issues/721))

### Carbon styles

* `FIX`: properly display links in text views ([`d3d8a0fa`](https://github.com/bpmn-io/form-js/commit/d3d8a0faeeb8b5d68214d28f02f172afbdb5ab07))
* `FIX`: click through select arrow ([`29f606e3`](https://github.com/bpmn-io/form-js/commit/29f606e32423862124bfdc7cc7cbb67d706289cf))

### Breaking Changes

The call signature of `getSchemaVariables` changed, favouring an options object over multiple params. This is very unlikely to have caused any issues as the old parameters were there only for very exceptional language override cases. 

## 1.0.0

### General

* `FEAT`: re-export external library styles separately ([#677](https://github.com/bpmn-io/form-js/issues/677))
* `FEAT`: support FEEL and templates for `prefixAdorner` and `suffixAdorner` ([#663](https://github.com/bpmn-io/form-js/pull/663))
* `FEAT`: support templates for `alt` and `source` properties ([#663](https://github.com/bpmn-io/form-js/pull/663))
* `FEAT`: support FEEL to populate multiselect values via `valuesExpression` ([#673](https://github.com/bpmn-io/form-js/issues/673))
* `FEAT`: support FEEL for `min`, `max`, `minLength` and `maxLength` ([#668](https://github.com/bpmn-io/form-js/pull/668))
* `FEAT`: support FEEL for `label` and `description` ([#658](https://github.com/bpmn-io/form-js/pull/658))
* `FEAT`: support `readonly` property ([#636](https://github.com/bpmn-io/form-js/pull/636))
* `FEAT`: support global `properties.disabled` ([#636](https://github.com/bpmn-io/form-js/pull/636))
* `FEAT`: allow uneven columns ([#605](https://github.com/bpmn-io/form-js/issues/605))
* `FEAT`: make styles themable ([#557](https://github.com/bpmn-io/form-js/pull/557))
* `FEAT`: add `fjs-no-theme` selector to disable themable styles ([#680](https://github.com/bpmn-io/form-js/issues/680))
* `FIX`: don't render empty strings as adorners ([d7e55851](https://github.com/bpmn-io/form-js/commit/d7e558511e2f81e143e49d1f5b0678d5ff204bf5))
* `FIX`: safely consume time interval ([4ccc3d85](https://github.com/bpmn-io/form-js/commit/4ccc3d859872fcaf838b5d1ef986e68c7db75611))
* `FIX`: support markdown tables in `text` ([#205](https://github.com/bpmn-io/form-js/issues/205))
* `CHORE`: introduce visual regression tests ([#632](https://github.com/bpmn-io/form-js/pull/632))
* `DEPS`: update to `diagram-js@12` ([`798ac2a2`](https://github.com/bpmn-io/form-js/commit/798ac2a204aab059ecc89c2c96bd302d34295982))
* `DEPS`: update to `@bpmn-io/properties-panel@2`
* `CHORE`: update `schemaVersion` to 9

### Viewer

* `FEAT`: provide `textLinkTarget` property ([#613](https://github.com/bpmn-io/form-js/pull/613))
* `FEAT`: correlate error messages to form fields ([#626](https://github.com/bpmn-io/form-js/pull/626))
* `FIX`: make `select` component accessible ([#617](https://github.com/bpmn-io/form-js/issues/617))
* `FIX`: sanitize `textfield` new lines ([#380](https://github.com/bpmn-io/form-js/issues/380))
* `CHORE`: rework component definitions ([#612](https://github.com/bpmn-io/form-js/issues/612))

### Editor

* `FEAT`: support UI modules ([#649](https://github.com/bpmn-io/form-js/issues/649))
* `FEAT`: make elements keyboard accessible ([#173](https://github.com/bpmn-io/form-js/issues/173))
* `FEAT`: use toggle switch for `disabled` property ([#639](https://github.com/bpmn-io/form-js/issues/639))
* `FEAT`: update delete icon ([#572](https://github.com/bpmn-io/form-js/issues/572))
* `FEAT`: resize form fields ([#566](https://github.com/bpmn-io/form-js/issues/566))
* `FIX`: set proper width to drop containers ([#623](https://github.com/bpmn-io/form-js/issues/623))
* `FIX`: improve search in palette ([#532](https://github.com/bpmn-io/form-js/issues/532))

### Playground

* `FEAT`: set aria label to each component ([#619](https://github.com/bpmn-io/form-js/pull/619))

### Carbon styles

* `FEAT`: introduce `@bpmn-io/form-js-carbon-styles` package ([#557](https://github.com/bpmn-io/form-js/pull/557))
* `FIX`: correct margins for lower screens ([#640](https://github.com/bpmn-io/form-js/pull/640))

### Breaking changes

We changed the behavior when providing the `readOnly` property to a Form. From this version, the form fields will be rendered as `readOnly` if the property is set. Previously, the form fields were rendered as `disabled`. To restore the same behavior, please use the `disabled` property instead.

```js
const form = new Form({
  container: document.querySelector('#form'),
  properties: {
    disabled: true
  }
});
```

We changed the structure of the static component configuration properties. These are now located on a static `config` object, and may now be accessed as follows:

```js
import { Button } from '@bpmn-io/form-js-viewer';
console.log('Button default label is ' + Button.config.label);
```

We changed the internal behavior of rendering `palette` in the editor. Following that, the `.fjs-editor-palette-container` selector was removed as it was optional. Please use the more generic `.fjs-palette-container` selector instead.

## 0.14.1

### Viewer

* `FIX`: properly align rows ([`7fb5c1de`](https://github.com/bpmn-io/form-js/commit/7fb5c1deae6b620acc6a7554167256279226bfc4))
* `FIX`: prevent submit on enter in `taglist` and `select` options ([#608](https://github.com/bpmn-io/form-js/issues/608))
* `FIX`: `getSchemaVariables` accounts for `text` templates ([#603](https://github.com/bpmn-io/form-js/pull/603))
* `FIX`: give adorners enough space ([#598](https://github.com/bpmn-io/form-js/issues/598))

### Editor

* `FIX`: validate unique labels in `values` ([#552](https://github.com/bpmn-io/form-js/issues/552))
* `FIX`: avoid redundant `properties` and `values` ([#614](https://github.com/bpmn-io/form-js/issues/614))

## 0.14.0

* `FEAT`: feat: implemented required parameter for checkboxes, checklists and taglists ([#594](https://github.com/bpmn-io/form-js/issues/594))
* `FIX`: prevented buttons from intercepting drag&drop action in editor ([#585](https://github.com/bpmn-io/form-js/issues/585))
* `FIX`: recentered form view ([#582](https://github.com/bpmn-io/form-js/issues/582))


## 0.13.1

### Viewer

* `FIX`: add missing `feelers` dependency ([#581](https://github.com/bpmn-io/form-js/issues/581))
* `FIX`: correct adorner alignments ([#584](https://github.com/bpmn-io/form-js/issues/584))

## 0.13.0

### General

* `FEAT`: allow primitives for multi select values ([#542](https://github.com/bpmn-io/form-js/issues/542))
* `FEAT`: bundle style exports ([#561](https://github.com/bpmn-io/form-js/pull/561))
* `FEAT`: support more flexible rows layout with columns ([#560](https://github.com/bpmn-io/form-js/issues/560))
* `FEAT`: support FEEL templating in `text` components ([#567](https://github.com/bpmn-io/form-js/pull/567))
* `CHORE`: update to `schemaVersion@8` ([`0779d6`](https://github.com/bpmn-io/form-js/pull/578/commits/0779d6b5d55206a0045ab21185f81137189aeb76))

### Viewer

* `FIX`: correct background for disabled `select` and `taglist` inputs ([#568](https://github.com/bpmn-io/form-js/issues/568))
* `CHORE`: replace `snarkdown` markdown parser with `showdown` ([#567](https://github.com/bpmn-io/form-js/pull/567))

### Editor

* `FEAT`: improve input values key description ([#303](https://github.com/bpmn-io/form-js/issues/303))
* `FEAT`: allow editing `columns` ([#560](https://github.com/bpmn-io/form-js/issues/560))
* `FEAT`: toggle between FEEL template and expression in `text` component ([#567](https://github.com/bpmn-io/form-js/pull/567))
* `CHORE`: rework dragging and selection visuals ([#560](https://github.com/bpmn-io/form-js/issues/560))

### Breaking Changes

* `@bpmn-io/form-js/dist/assets/dragula.css` got removed
* `@bpmn-io/form-js/dist/assets/flatpickr/light.css` got removed
* `@bpmn-io/form-js/dist/assets/properties-panel.css` got removed

The missing styles are included in the general style exports (`form-js.css`, `form-js-editor.css`, `form-js-playground.css`). If you need the base styles on their own, please find them in the additional `*-base.css` exports in the `dist/assets` directory.


## 0.12.2

### General

* `FIX`: use correct height for `datetime` inputs ([#548](https://github.com/bpmn-io/form-js/pull/548))

### Editor

* `FIX`: use correct articles in palette titles ([#545](https://github.com/bpmn-io/form-js/pull/545))
* `FIX`: use correct empty default value for `select` ([#562](https://github.com/bpmn-io/form-js/pull/562))

## 0.12.1

### General

* `FIX`: correct type generation ([#529](https://github.com/bpmn-io/form-js/issues/529))

### Viewer

* `FIX`: use ellipsis for text adorners ([#538](https://github.com/bpmn-io/form-js/pull/538))

### Editor

* `FIX`: use defined `validationType` for custom `validate` ([#537](https://github.com/bpmn-io/form-js/pull/537))

## 0.12.0

### General

* `FEAT`: normalized font and form field styling ([#506](https://github.com/bpmn-io/form-js/issues/506))
* `FEAT`: support searchable selects ([#381](https://github.com/bpmn-io/form-js/issues/381))
* `FIX`: only export `schemaVersion` once ([`a93b664d`](https://github.com/bpmn-io/form-js/commit/a93b664d62c17439144fe6b092f8c91598b4f571))
* `FIX`: prevent `date` values prior to 1900 ([#534](https://github.com/bpmn-io/form-js/pull/534)) 
* `CHORE`: change labels of `serializeToString`, `pattern` and `validationType` properties ([#454](https://github.com/bpmn-io/form-js/issues/454))
* `CHORE`: update to `schemaVersion@7` ([`293f918d`](https://github.com/bpmn-io/form-js/commit/293f918d6910b8434be5e79184ffd154989d4c55))

### Editor

* `FEAT`: emit `drag.*` events ([#462](https://github.com/bpmn-io/form-js/issues/462))
* `FEAT`: disable text links ([#439](https://github.com/bpmn-io/form-js/issues/439))
* `FEAT`: provide editor specific `text` component ([#521](https://github.com/bpmn-io/form-js/pull/521))
* `FEAT`: implement scalable palette component ([#503](https://github.com/bpmn-io/form-js/issues/503))
* `FEAT`: validate decimal properties ([#531](https://github.com/bpmn-io/form-js/pull/531))


## 0.11.1

### Editor

* `FIX`: properly clean up custom validate ([#485](https://github.com/bpmn-io/form-js/pull/485))

## 0.11.0

### General

* `FEAT`: simplify `checklist` icon ([`45c9b9ee`](https://github.com/bpmn-io/form-js/commit/45c9b9ee9a66e5622c84bb3e4d761e8f76834db2))
* `FEAT`: make `datetime` icon color customizable ([`1aa334bb`](https://github.com/bpmn-io/form-js/commit/1aa334bbab90bd719f12f1f12f46f80e6c159e68))
* `FIX`: truncate adorner texts ([`136a3234`](https://github.com/bpmn-io/form-js/commit/136a32346feecc9a6d0e10bd8f0f9a02bf8842cd))
* `FIX` allow `min` and `max` validation for all numbers ([#486](https://github.com/bpmn-io/form-js/issues/486))

### Viewer

* `FIX`: do not serialize standalone minus ([#492](https://github.com/bpmn-io/form-js/issues/492))
* `FIX`: properly use `increment` in validation ([`9b339dc2`](https://github.com/bpmn-io/form-js/commit/9b339dc275752b3f560199faf4159608b2d669b0))
* `FIX`: display `datetime` value when disabled ([`d775dc26`](https://github.com/bpmn-io/form-js/commit/d775dc268cde2aadf6923945737e691474467bb5))
* `FIX`: trim increment `number` value ([`b78667e2`](https://github.com/bpmn-io/form-js/commit/b78667e244c7d5760f38ecf2aa267bac1eb64fbd))
* `FIX`: do not collapse dropdown list on click scroll ([#367](https://github.com/bpmn-io/form-js/issues/367))

### Editor

* `FIX`: clear custom validation when using presets ([`13712915`](https://github.com/bpmn-io/form-js/commit/13712915beabb180a969d593ab19cc88bd012cdf))
* `FIX`: properly handle decimal values in `min` and `max` validation ([#497](https://github.com/bpmn-io/form-js/issues/497))

### Playground

* `FEAT`: add auto complete for variable names ([#295](https://github.com/bpmn-io/form-js/issues/295))
* `FIX`: do not force palette scrolling ([`1c81d837`](https://github.com/bpmn-io/form-js/commit/1c81d837dedf5c7a2d4285cd461336b26219ee17))
* `FIX`: render properties panel to the right ([`8289216f`](https://github.com/bpmn-io/form-js/commit/8289216fb5cc5ccc24241a84f1a57ca35098a622))
* `FIX`: handle tabbing in JSON editor ([`7bb44611`](https://github.com/bpmn-io/form-js/commit/7bb4461102a5535b1b3b60a8a5b9ac0e876bf92b))
* `FIX`: properly layout properties panel ([#487](https://github.com/bpmn-io/form-js/issues/487))
* `FIX`: restrict editor width to viewport ([`f345d111`](https://github.com/bpmn-io/form-js/commit/f345d111322384dd831ef6771a8b875e5ce6e66d))


## 0.10.1

### General

* `FIX`: aligned viewer, editor and control margins ([#424](https://github.com/bpmn-io/form-js/issues/424)) 
* `FIX`: set number field increment buttons to type 'button' ([#467](https://github.com/bpmn-io/form-js/issues/467)) 


## 0.10.0

### General

* `FEAT`: support prefix and suffix for `textfield` and `number` ([#420](https://github.com/bpmn-io/form-js/issues/420))
* `FEAT`: support `datetime` component, include `/dist/assets/flatpickr/light.css` to display it ([#340](https://github.com/bpmn-io/form-js/issues/340))
* `FEAT`: support expressions for `text` content ([#436](https://github.com/bpmn-io/form-js/issues/436)) 

### Viewer

* `FEAT`: allow `h6` elements in text view ([#412](https://github.com/bpmn-io/form-js/issues/412))
* `FIX`: hidden fields do not affect other fields ([#431](https://github.com/bpmn-io/form-js/issues/431))

## 0.10.0-alpha.3

### General

* `FIX`: remove ES2020 syntax ([#448](https://github.com/bpmn-io/form-js/pull/448))

## 0.10.0-alpha.2

### General

* `FEAT`: support decimal numbers ([#285](https://github.com/bpmn-io/form-js/issues/285))
* `FEAT`: add conditional rendering ([#374](https://github.com/bpmn-io/form-js/issues/374))
* `FEAT`: support `image` fields ([#383](https://github.com/bpmn-io/form-js/issues/383))
* `FEAT`: retrieve variables mentioned in conditions ([#401](https://github.com/bpmn-io/form-js/issues/401))
* `FEAT`: retrieve variables mentioned in expressions ([`32532aa7`](https://github.com/bpmn-io/form-js/commit/32532aa7d13b99ff621839300ba82282491fb9a8))
* `DEPS`: update to `diagram-js@11` ([`6e2d5a1d`](https://github.com/bpmn-io/form-js/commit/6e2d5a1d15fcd8a3c8c2b9787adcc637e46c552b))
* `DEPS`: update to `@bpmn-io/properties-panel@1` ([`fdda226f`](https://github.com/bpmn-io/form-js/commit/fdda226ff986532f6058a37dc647ac296ff3e8f4))

### Editor

* `FEAT`: validate `valuesKey` in properties panel ([#428](https://github.com/bpmn-io/form-js/issues/428))

## 0.10.0-alpha.1

### Editor

* `DEPS`: add `@bpmn-io/properties-panel` dependency ([#429](https://github.com/bpmn-io/form-js/pull/429))

### Viewer

* `FIX`: make `taglist` component accessible ([#413](https://github.com/bpmn-io/form-js/pull/429))

## 0.10.0-alpha.0

### General

* `FEAT`: add `textarea` component ([#283](https://github.com/bpmn-io/form-js/issues/283))
* `CHORE`: update to `schemaVersion@6` ([`5dd3f16c`](https://github.com/bpmn-io/form-js/commit/5dd3f16ca712eaa83b10d4f8059b8eac9bf81bc0))

### Viewer

* `CHORE`: add additional `.fjs-disabled` and `.fjs-checked` selectors ([#419](https://github.com/bpmn-io/form-js/pull/419))

### Editor

* `FEAT`: improve properties panel header for `text` fields ([#388](https://github.com/bpmn-io/form-js/issues/388))
* `FEAT`: add `email` validation type for `textfield` ([#414](https://github.com/bpmn-io/form-js/pull/414))
* `FEAT`: add `phone` validation type for `textfield` ([#414](https://github.com/bpmn-io/form-js/pull/414))

### Playground

* `FEAT`: enable JSON validation ([#386](https://github.com/bpmn-io/form-js/pull/386))
* `FEAT`: emit `formPlayground.inputDataError` ([`7341834b`](https://github.com/bpmn-io/form-js/commit/7341834bae4635970138f962583445867a89654e))

## 0.9.9

### Playground

* `FIX`: make JSON editors scrollable ([`2c155c1d`](https://github.com/bpmn-io/form-js/commit/2c155c1d2558de3dfd3f6b9da037879598f7f145))
* `FIX`: show submit data in output panel ([#273](https://github.com/bpmn-io/form-js/issues/273))

## 0.9.8

* `DEPS`: update to `diagram-js@9.0.0`
* `DEPS`: update to `eslint-plugin-bpmn-io@0.16.0`
* `DEPS`: update to `min-dom@4.0.0`

### Editor

* `FIX`: align default static values ([#355](https://github.com/bpmn-io/form-js/pull/355))

## 0.9.7

### Editor

* `FIX`: do not order values alphanumerical ([#350](https://github.com/bpmn-io/form-js/pull/350))

### Viewer

* `FIX`: inherit font family for inputs  ([#330](https://github.com/bpmn-io/form-js/pull/330))

## 0.9.6

### Editor

* `FIX`: ensure valueSource is undoable ([#349](https://github.com/bpmn-io/form-js/pull/349))
* `FIX`: scroll only palette fields ([#347](https://github.com/bpmn-io/form-js/pull/347))

### Playground

* `FIX`: fix overflowing palette container ([#348](https://github.com/bpmn-io/form-js/pull/348))

## 0.9.5

* `DEPS`: update to `didi@9`

## 0.9.4

* `CHORE`: update `package-lock.json` to v2

## 0.9.3

_Re-release of 0.9.2._

## 0.9.2

### General

* `CHORE`: upgrade to `properties-panel@0.21.0` ([b914b2f3](https://github.com/bpmn-io/form-js/commit/b914b2f3b862c0c9f2828f29e93ed2bbd076941c))

## 0.9.1

### Viewer

* `FIX`: increase description color contrast ([#334](https://github.com/bpmn-io/form-js/issues/334))

## 0.9.0

### Editor

* `CHORE`: show palette action names in compact mode ([`fc41baf9`](https://github.com/bpmn-io/form-js/commit/fc41baf97b4739ac8f688ea4dda3290f7d6dee8b))

### Playground

* `FEAT`: mirror editor API ([`30d4363b`](https://github.com/bpmn-io/form-js/commit/30d4363b524dd1f0159828f7b125db4cba415f82))
* `FEAT`: emit `formPlayground.init` after full initialization ([`dbb174c6`](https://github.com/bpmn-io/form-js/commit/dbb174c63a28e00bf3c9336192b5d5c46135867f))
* `FEAT`: allow to configure `exporter` ([#331](https://github.com/bpmn-io/form-js/issues/331))
* `FEAT`: make initial schema optional ([`e041c24a`](https://github.com/bpmn-io/form-js/commit/e041c24a86f3a5dc75ebba2cf5ac3ce724d65384))

## 0.8.0

### General

* `FEAT`: add playground distro ([#318](https://github.com/bpmn-io/form-js/issues/318))
* `FIX`: stop taglist duplicate entries during slowdowns  ([#268](https://github.com/bpmn-io/form-js/issues/268))

### Editor

* `FEAT`: provide properties panel module ([#286](https://github.com/bpmn-io/form-js/issues/286))
* `FEAT`: render properties panel per default ([#286](https://github.com/bpmn-io/form-js/issues/286))

### Playground

* `FEAT`: support components to be rendered flexible ([#292](https://github.com/bpmn-io/form-js/issues/292))
* `FEAT`: emit `formPlayground.rendered` event ([#292](https://github.com/bpmn-io/form-js/issues/292))
* `FEAT`: make it possible to render own properties panel ([#286](https://github.com/bpmn-io/form-js/issues/286))
* `CHORE`: clean up package definition ([#318](https://github.com/bpmn-io/form-js/issues/318))
* `CHORE`: use editor and viewer packages directly ([#318](https://github.com/bpmn-io/form-js/issues/318))

## 0.8.0-alpha.1

### General

* `FEAT`: provide `getSchemaVariables` utility ([#103](https://github.com/bpmn-io/form-js/issues/103))

### Editor

* `FEAT`: provide palette as feature module ([#280](https://github.com/bpmn-io/form-js/issues/280))
* `FIX`: remove term "process variable" from `key` property ([#241](https://github.com/bpmn-io/form-js/issues/241))
* `CHORE`: change labels `Values` to `Options` ([#304](https://github.com/bpmn-io/form-js/issues/304))

### Viewer

* `FEAT`: sanitize form field values on import ([#266](https://github.com/bpmn-io/form-js/issues/266))
* `FIX`: use outline for field focus state ([#267](https://github.com/bpmn-io/form-js/issues/267))
* `FIX`: filter invalid taglist options ([#303](https://github.com/bpmn-io/form-js/issues/303))

## 0.8.0-alpha.0

### General

* `FEAT`: add `checklist` component ([#196](https://github.com/bpmn-io/form-js/issues/196))
* `FEAT`: add `taglist` component ([#198](https://github.com/bpmn-io/form-js/issues/198))

### Editor

* `FEAT`: migrate properties panel to new framework ([#249](https://github.com/bpmn-io/form-js/issues/249))
* `FEAT`: allow to configure `valuesKey` ([#256](https://github.com/bpmn-io/form-js/issues/256))

### Viewer

* `FEAT`: load dynamic input data ([#197](https://github.com/bpmn-io/form-js/issues/197))

## 0.7.2

* `FIX`: serialize regex pattern as 'pattern' ([#245](https://github.com/bpmn-io/form-js/pull/245))
* `CHORE`: added build:watch script ([#248](https://github.com/bpmn-io/form-js/pull/248))
* `CHORE`: general local HTML coverage report ([#250](https://github.com/bpmn-io/form-js/pull/250))
* `CHORE`: format files to end with LF instead of CRLF ([#259](https://github.com/bpmn-io/form-js/issues/259))
* `DEPS`: cleaned up some audit errors ([#261](https://github.com/bpmn-io/form-js/pull/261))

## 0.7.1

* `FIX`: explicitly declare `Validator` dependencies ([#240](https://github.com/bpmn-io/form-js/issues/240))
* `FIX`: improve types ([#159](https://github.com/bpmn-io/form-js/issues/159))

## 0.7.0

### Editor

* `FEAT`: allow to set custom properties for form fields ([#226](https://github.com/bpmn-io/form-js/pull/226))
* `FIX`: validate TextInput when validate function changes ([#225](https://github.com/bpmn-io/form-js/pull/225))
* `FIX`: don't allow duplicate values for select and radio fields ([#229](https://github.com/bpmn-io/form-js/pull/229))

## 0.6.1

### Editor

* `FIX`: override `exporter` property on save ([#221](https://github.com/bpmn-io/form-js/pull/221))

## 0.6.0

### General

* `CHORE`: update color scheme ([#193](https://github.com/bpmn-io/form-js/pull/193))

### Viewer

* `FEAT`: be able to set default value of a field ([#213](https://github.com/bpmn-io/form-js/pull/213))
* `FIX`: submit data for every field that is not disabled ([#210](https://github.com/bpmn-io/form-js/pull/210))
* `FIX`: do not submit data without corresponding field ([#210](https://github.com/bpmn-io/form-js/pull/210))

### Editor

* `FIX`: prevent properties panel from losing focus ([#211](https://github.com/bpmn-io/form-js/pull/211))
* `CHORE`: properties panel inputs inherit font family ([#189](https://github.com/bpmn-io/form-js/pull/189))

### Breaking Changes

* Data will now be submitted for every form field that is not disabled.
* Imported data without form field will not be submitted anymore.

## 0.5.1

### Editor

* `FIX`: assign unique DOM IDs
* `FIX`: correctly handling of undo/redo shortcuts in form

### Viewer

* `FIX`: assign unique DOM IDs

## 0.5.0

### Editor

* `FEAT`: allow disabling of form fields ([#182](https://github.com/bpmn-io/form-js/pull/182), [#181](https://github.com/bpmn-io/form-js/issues/181))
* `FIX`: correct border radius on context pad ([#185](https://github.com/bpmn-io/form-js/pull/185))
* `FIX`: ensure form fields react to click events ([#186](https://github.com/bpmn-io/form-js/pull/186))

### Playground

_Initial public release of the `@bpmn-io/form-js-playground` :tada:._

## 0.4.4

### Viewer

* `FIX`: properly reset UI state of `select` and `number` fields ([#155](https://github.com/bpmn-io/form-js/issues/155))
* `FIX`: prevent un-checking of `radio` fields ([#176](https://github.com/bpmn-io/form-js/issues/176))
* `FIX`: correct display of `checkbox` fields without label ([#168](https://github.com/bpmn-io/form-js/issues/168))

## 0.4.3

### Editor

* `FIX`: correct form icon ([#170](https://github.com/bpmn-io/form-js/issues/170))

## 0.4.2

### Editor

* `FIX`: prevent generation of duplicate keys when creating form fields ([#161](https://github.com/bpmn-io/form-js/issues/161))
* `FIX`: make field hover and select state better distinguishable ([#163](https://github.com/bpmn-io/form-js/issues/163))

## 0.4.1

* `FIX`: update fields in registry on ID change ([#152](https://github.com/bpmn-io/form-js/issues/152))

## 0.4.0

* `FEAT`: refactor selection ([#140](https://github.com/bpmn-io/form-js/pull/140))
* `FEAT`: add selection behavior ([#140](https://github.com/bpmn-io/form-js/pull/140))
* `FEAT` add editor action to select form field ([#149](https://github.com/bpmn-io/form-js/pull/149))
* `FIX`: add missing select label to properties panel ([#148](https://github.com/bpmn-io/form-js/pull/148))
* `FIX`: fix palette overflow ([#147](https://github.com/bpmn-io/form-js/pull/147))
* `FIX`: fix type definitions for `container` option when creating form or form editor ([#145](https://github.com/bpmn-io/form-js/pull/145))

### Breaking Changes

* `Modeling#addFormField`, `Modeling#moveFormField` and `Modeling#remove` parameters have changed
* selection in `Selection` is now form field, not its ID

## 0.3.1

* `FIX`: use external type declarations ([#143](https://github.com/bpmn-io/form-js/pull/143))

## 0.3.0

### General

* `FEAT`: add `id` to form fields ([#80](https://github.com/bpmn-io/form-js/issues/80), [#137](https://github.com/bpmn-io/form-js/pull/137))
* `DOCS`: publish typings with documentation tags ([#138](https://github.com/bpmn-io/form-js/pull/138))
* `DOCS`: mark private and internal APIs
* `CHORE`: bump to `schemaVersion=2`

### Viewer

* `FEAT`: allow fields to be disabled via schema ([`bf185225`](https://github.com/bpmn-io/form-js/commit/bf185225f3545c54026f80c27a864119b2cd8107))
* `FIX`: assign unique keys for child components ([`cb86f75e`](https://github.com/bpmn-io/form-js/commit/cb86f75e3d7de96ceeb0c6e78553130358787f03), [`fd036484`](https://github.com/bpmn-io/form-js/commit/fd03648422cdd0331f10a60c9a1743aa02153300))
* `FIX`: santitize external links ([`9c53aa05`](https://github.com/bpmn-io/form-js/commit/9c53aa052dc5eb2fb37d320c0bbe334f2c3302fe))
* `FIX`: turn number field into a controlled component ([`874545e3`](https://github.com/bpmn-io/form-js/commit/874545e3b0290d0aff72359489d34596fd4cf769))
* `FIX`: correctly label selects ([`8eade6ca`](https://github.com/bpmn-io/form-js/commit/8eade6ca479604eb04ca08c6a17d32f73d465ead))

### Editor

* `FEAT`: add compact mode ([#130](https://github.com/bpmn-io/form-js/pull/130))
* `FEAT`: validate `key` property ([#58](https://github.com/bpmn-io/form-js/issues/58))
* `FEAT`: debounce input per default ([#132](https://github.com/bpmn-io/form-js/pull/132))
* `FEAT`: allow editing multiple properties at once ([`e68526c1`](https://github.com/bpmn-io/form-js/commit/e68526c14bae5e08ceecf4fb85d12de0081e60b6))
* `FEAT`: allow editing of form root ([`9193bb22`](https://github.com/bpmn-io/form-js/commit/9193bb220ea9be922433c026ecabe65542befb07))
* `FEAT`: improve form field selection and hover styles ([`71061807`](https://github.com/bpmn-io/form-js/commit/71061807451e99b73f913392bbfe2d5e8e340e3e))
* `FIX`: make form element drag sticky ([`e2c2bdd0`](https://github.com/bpmn-io/form-js/commit/e2c2bdd0f12539b0a0b049350a4a0d4763592d3f))
* `FIX`: clear before re-import ([#135](https://github.com/bpmn-io/form-js/issues/135))
* `FIX`: event listeners not de-registered ([#133](https://github.com/bpmn-io/form-js/issues/133))
* `FIX`: assign unique keys to rendered components ([#139](https://github.com/bpmn-io/form-js/pull/139))
* `CHORE`: rework import and field creation

## 0.2.4

* `FIX`: make options optional when creating `Form` and `FormEditor` instances ([`8d9e09ae`](https://github.com/bpmn-io/form-js/commit/8d9e09ae410cbfe42a8e11a2371e45df9d926fd0))
* `FIX`: import `schemaVersion` ([`05622a95`](https://github.com/bpmn-io/form-js/commit/05622a9568787a8c6f2fce79c60c7ff01f2b6083))
* `FIX`: ensure `required` works with empty string ([`0279c4c4`](https://github.com/bpmn-io/form-js/commit/0279c4c4e55a0d6c3cb7d57a6818b15ecd6a583e))
* `DOCS`: document new usage patterns ([#106](https://github.com/bpmn-io/form-js/issues/106))
* `DOCS`: document editor API ([#24](https://github.com/bpmn-io/form-js/issues/24))

## 0.2.3

* `FIX`: do not paragraph wrap `blockquote` and `ol` elements when rendering Markdown to HTML ([`a33d34ad`](https://github.com/bpmn-io/form-js/commit/a33d34ad584073bd3c9134997de94d325f88a0da))
* `FIX`: make HTML sanitizer more strict ([`122467df`](https://github.com/bpmn-io/form-js/commit/122467df3879afef69df0a7d9341638889a55d8c))
* `FIX`: gracefully handle unparseable `Text` input ([`a1121c0e`](https://github.com/bpmn-io/form-js/commit/a1121c0e7dc7a2e03854e9ff470dcdd4b6882faf))

## 0.2.2

* `FIX`: add missing `min-dom` dependency ([#100](https://github.com/bpmn-io/form-js/issues/100))
* `FIX`: improve sanitizing of text links ([#102](https://github.com/bpmn-io/form-js/issues/102))

## 0.2.1

* `FIX`: remove `async` from public API (polyfilling `Promise` is all that is needed)
* `CHORE`: expose `FormEditor` and `Form` in public API

## 0.2.0

### General

* `FIX`: prevent embedded images from breaking the form layout ([#92](https://github.com/bpmn-io/form-js/pull/92))
* `FIX`: generate proper paragraphs from markdown text ([#93](https://github.com/bpmn-io/form-js/pull/93))
* `CHORE`: refactor for extensibility and testability
* `CHORE`: separate component instantation and import

### Viewer

* `FEAT`: improve robustness of form import ([#79](https://github.com/bpmn-io/form-js/issues/79))
* `FEAT`: allow programmatic form validation ([#30](https://github.com/bpmn-io/form-js/issues/30))
* `FEAT`: prevent submission of readonly form
* `FIX`: correct submission of empty fields ([#54](https://github.com/bpmn-io/form-js/issues/54))
* `FIX`: correct submission of disabled fields ([#6](https://github.com/bpmn-io/form-js/issues/6))

### Editor

* `FEAT`: improve robustness of form editor import ([#91](https://github.com/bpmn-io/form-js/issues/91))
* `FEAT`: add undo and redo ([#45](https://github.com/bpmn-io/form-js/issues/45))

### Breaking Changes

* Form viewer and editor import are now asynchronous. Creating either via `#createForm` and `#createFormEditor` must be awaited.

## 0.1.0

_This release adds new form fields that are not supported by older versions of form-js._

### General

* `FEAT`: add `checkbox` field
* `FEAT`: add `radio` field
* `FEAT`: add `select` field
* `FEAT`: add read-only `text` field
* `FEAT`: add `number` field
* `CHORE`: add `UMD` distributions for `editor` and `viewer`

### Editor

* `FEAT`: make editor field preview match renderered form
* `FEAT`: add `schemaVersion` to exported form files
* `FEAT`: add ability to specify `exporter`

### Viewer

* `FEAT`: decrease visual presence of descriptions

## 0.0.12

* fix `required` checkbox in properties panel by passing correct props ([#53](https://github.com/bpmn-io/form-js/pull/53))

## 0.0.11

* fix drag and drop by adding/removing event listeners on mount/unmount and attach/detach ([#51](https://github.com/bpmn-io/form-js/pull/51))

## 0.0.10

* `FIX`: fix empty textfield and number input behavior in properties panel ([#42](https://github.com/bpmn-io/form-js/issues/42))

## 0.0.9

### Viewer

* `FEAT`: improve positioning of powered by logo
* `FEAT`: simplify initial form element labels
* `FIX`: restore `for` and `name` properties on inputs and labels ([#32](https://github.com/bpmn-io/form-js/issues/32))
* `FIX`: correct commonjs bundle issue ([#29](https://github.com/bpmn-io/form-js/issues/29))

### Editor

* `FEAT`: improve property labels
* `FEAT`: emit blur and focus events

## 0.0.8

_Re-publish of `v0.0.7`_.

## 0.0.7

### Viewer

* `FEAT`: fail on unknown form schema elements ([#27](https://github.com/bpmn-io/form-js/pull/27))
* `FEAT`: add `maxLength` validation

### Editor

_Initial editor release._

### Breaking Changes

* Form viewer instantiation now fails hard when supplied with an unsupported form schema.

## 0.0.6

### Viewer

* `FEAT`: emit `changed` event
* `CHORE`: remove debug logging

## 0.0.5

_Initial release._
