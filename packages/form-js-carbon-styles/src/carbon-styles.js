/**
 * DEPRECATED: This file is deprecated and will be removed with one of the next releases.
 */

import { css, createGlobalStyle } from 'styled-components';
import { rem } from '@carbon/elements';

function getSelectArrowSvg(color) {
  return `url('data:image/svg+xml;base64,${window.btoa(
    `<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="${color}" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path></svg>`,
  )}')`;
}

function getNumberInputMinusSvg(color) {
  return `url('data:image/svg+xml;base64,${window.btoa(
    `<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="${color}" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M8 15H24V17H8z" /></svg>`,
  )}')`;
}

function getNumberInputPlusSvg(color) {
  return `url('data:image/svg+xml;base64,${window.btoa(
    `<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="${color}" width="16" height="16" viewBox="0 0 32 32" aria-hidden="true"><path d="M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z" /></svg>`,
  )}')`;
}

const getBaseInputStyles = ({ height }) => css`
  color: var(--cds-text-primary);
  border-radius: 0;
  border: none;
  border-bottom: 1px solid var(--cds-border-strong);
  height: ${height};
  font-size: var(--cds-body-short-01-font-size);
  font-weight: var(--cds-body-short-01-font-weight);
  line-height: var(--cds-body-short-01-line-height);
  letter-spacing: var(--cds-body-short-01-letter-spacing);

  &:focus {
    outline: 2px solid var(--cds-focus);
    outline-offset: -2px;
  }

  &::placeholder {
    color: var(--cds-text-placeholder);
  }
`;

const getSelectArrowStyles = ({ arrowRightPosition, color }) => css`
  color: var(--cds-text-primary);
  background-color: var(--cds-field);
  cursor: pointer;
  appearance: none;
  background-image: ${getSelectArrowSvg(color)};
  background-repeat: no-repeat;
  background-position: right ${arrowRightPosition} bottom 50%;
`;

const MARKDOWN_STYLES = css`
  .fjs-container .fjs-form-field.fjs-form-field-text .markup {
    font-size: var(--cds-body-long-01-font-size);
    font-weight: var(--cds-body-long-01-font-weight);
    line-height: var(--cds-body-long-01-line-height);
    letter-spacing: var(--cds-body-long-01-letter-spacing);

    & p {
      font-size: var(--cds-body-long-01-font-size);
      font-weight: var(--cds-body-long-01-font-weight);
      line-height: var(--cds-body-long-01-line-height);
      letter-spacing: var(--cds-body-long-01-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & h1 {
      font-size: var(--cds-productive-heading-06-font-size);
      font-weight: var(--cds-productive-heading-06-font-weight);
      line-height: var(--cds-productive-heading-06-line-height);
      letter-spacing: var(--cds-productive-heading-06-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & h2 {
      font-size: var(--cds-productive-heading-05-font-size);
      font-weight: var(--cds-productive-heading-05-font-weight);
      line-height: var(--cds-productive-heading-05-line-height);
      letter-spacing: var(--cds-productive-heading-05-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & h3 {
      font-size: var(--cds-productive-heading-04-font-size);
      font-weight: var(--cds-productive-heading-04-font-weight);
      line-height: var(--cds-productive-heading-04-line-height);
      letter-spacing: var(--cds-productive-heading-04-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & h4 {
      font-size: var(--cds-productive-heading-03-font-size);
      font-weight: var(--cds-productive-heading-03-font-weight);
      line-height: var(--cds-productive-heading-03-line-height);
      letter-spacing: var(--cds-productive-heading-03-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & h5 {
      font-size: var(--cds-productive-heading-02-font-size);
      font-weight: var(--cds-productive-heading-02-font-weight);
      line-height: var(--cds-productive-heading-02-line-height);
      letter-spacing: var(--cds-productive-heading-02-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & h6 {
      font-size: var(--cds-productive-heading-01-font-size);
      font-weight: var(--cds-productive-heading-01-font-weight);
      line-height: var(--cds-productive-heading-01-line-height);
      letter-spacing: var(--cds-productive-heading-01-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & code {
      font-family: var(--cds-code-02-font-family);
      font-size: var(--cds-code-02-font-size);
      font-weight: var(--cds-code-02-font-weight);
      line-height: var(--cds-code-02-line-height);
      letter-spacing: var(--cds-code-02-letter-spacing);
      white-space: pre-wrap;
      margin-bottom: var(--cds-spacing-05);
    }

    & blockquote {
      font-family: var(--cds-quotation-02-font-family);
      font-size: var(--cds-quotation-02-font-size);
      font-weight: var(--cds-quotation-02-font-weight);
      line-height: var(--cds-quotation-02-line-height);
      letter-spacing: var(--cds-quotation-02-letter-spacing);
      margin-bottom: var(--cds-spacing-05);
    }

    & ul,
    & ol {
      box-sizing: border-box;
      padding: 0;
      border: 0;
      margin: 0;
      list-style: none;
      margin-bottom: var(--cds-spacing-05);
    }

    & ul {
      margin-left: var(--cds-spacing-05);
    }

    & ol {
      margin-left: var(--cds-spacing-05);
    }

    & ul li {
      position: relative;

      &:before {
        position: absolute;
        left: calc(-1 * var(--cds-spacing-05));
        content: '–';
      }
    }

    & ol li {
      position: relative;
      counter-increment: item;

      &:before {
        position: absolute;
        left: calc(-1 * var(--cds-spacing-05));
        content: counter(item) '.';
      }
    }

    pre {
      margin-bottom: var(--cds-spacing-05);
    }

    div > :last-child {
      margin-bottom: 0;
    }
  }
`;

const ANCHOR_STYLES = css`
  .fjs-container .fjs-form-field-text a {
    color: var(--cds-link-primary);
    outline: none;
    text-decoration: underline;
    font-size: inherit;
    font-weight: inherit;
    line-height: var(--cds-body-compact-01-line-height);
    letter-spacing: var(--cds-body-compact-01-letter-spacing);

    &:hover {
      color: var(--cds-link-primary-hover);
    }

    &:focus {
      outline: 1px solid var(--cds-focus);
    }

    &:active,
    &:active:visited,
    &:active:visited:hover {
      color: var(--cds-text-primary);
    }

    &:visited {
      color: var(--cds-link-primary);
    }

    &:visited:hover {
      color: var(--cds-link-primary-hover);
    }
  }
`;

const READONLY_STYLES = css`
  ${({ theme }) => css`
    .fjs-container {
      .fjs-readonly {
        .fjs-input:read-only:not(:disabled),
        .fjs-textarea:read-only:not(:disabled),
        .fjs-select:read-only:not(:disabled),
        &.fjs-taglist,
        .fjs-input-group {
          background-color: transparent;
        }

        &.fjs-form-field {
          .fjs-input-group {
            border-bottom: 1px solid var(--cds-border-subtle);
          }
        }

        &.fjs-form-field-number {
          .fjs-input-group .fjs-number-arrow-container {
            background-color: transparent;

            .fjs-number-arrow-up,
            .fjs-number-arrow-down {
              background-color: transparent;
              pointer-events: none;
            }
          }
        }

        &.fjs-form-field:not(.fjs-form-field-datetime) {
          .fjs-input-group .fjs-input-adornment {
            background: transparent;
          }
        }

        &.fjs-form-field-select {
          .fjs-input-group {
            cursor: unset;
            background-image: ${getSelectArrowSvg(theme.iconDisabled)};
            background-color: transparent;

            .fjs-input:read-only:not(:disabled) {
              border-color: transparent;
            }

            .fjs-select-display {
              color: var(--cds-text-primary);
            }
          }
        }

        &.fjs-form-field-datetime {
          .fjs-input-group {
            cursor: unset;

            .fjs-input-adornment {
              background-color: transparent;
            }

            .flatpickr-input {
              cursor: unset;
            }

            .fjs-input-adornment svg {
              cursor: unset;
            }
          }
        }

        &.fjs-form-field-checkbox,
        &.fjs-form-field-radio,
        &.fjs-form-field-checklist {
          .fjs-input:read-only {
            opacity: 1;
            background-color: transparent;

            &:before {
              border-color: var(--cds-icon-disabled);
            }
          }

          &.fjs-checked .fjs-input[type='checkbox'],
          .fjs-form-field-label.fjs-checked .fjs-input[type='checkbox'] {
            &:before {
              border: 1px solid var(--cds-icon-disabled);
              background: transparent;
            }

            &:after {
              border-bottom: 2px solid var(--cds-icon-primary);
              border-left: 2px solid var(--cds-icon-primary);
            }
          }
        }

        &.fjs-taglist .fjs-taglist-tag {
          .fjs-taglist-tag-label {
            padding: 2px 0px;
          }
        }
      }
    }
  `}
`;

const DISABLED_STYLES = css`
  .fjs-container {
    .fjs-disabled {
      &.fjs-form-field-textfield .fjs-input,
      &.fjs-form-field-datetime .fjs-input,
      & .fjs-textarea:disabled,
      & .fjs-taglist.fjs-disabled,
      & .fjs-taglist.fjs-disabled .fjs-taglist-input,
      &.fjs-form-field-select .fjs-input-group.disabled,
      &.fjs-form-field-select .fjs-input-group.disabled .fjs-select-display,
      &.fjs-form-field-select .fjs-input-group.disabled .fjs-input,
      &.fjs-form-field .fjs-form-field-label,
      &.fjs-form-field.fjs-form-field-radio .fjs-form-field-label,
      &.fjs-form-field.fjs-form-field-checklist .fjs-form-field-label,
      & .fjs-form-field-description {
        /* todo(pinussilvestrus): mitigate https://github.com/carbon-design-system/carbon/issues/13286 */
        color: var(--cds-text-disabled);
        cursor: var(--cursor-disabled, not-allowed);
      }

      &.fjs-form-field-textfield .fjs-input-group,
      &.fjs-form-field-datetime .fjs-input-group,
      & .fjs-textarea:disabled,
      & .fjs-taglist.fjs-disabled,
      & .fjs-taglist.fjs-disabled .fjs-taglist-input,
      &.fjs-form-field-select .fjs-input-group.disabled,
      &.fjs-form-field-select .fjs-input-group.disabled .fjs-select-display,
      &.fjs-form-field-select .fjs-input-group.disabled .fjs-input {
        border: none;
      }
    }

    .fjs-disabled.fjs-form-field-number .fjs-input-group {
      border: none;
      cursor: var(--cursor-disabled, not-allowed);
    }

    .fjs-disabled.fjs-form-field-number .fjs-input-group .fjs-input {
      cursor: var(--cursor-disabled, not-allowed);
    }

    .fjs-form-field.fjs-disabled.fjs-checked .fjs-input[type='checkbox'] {
      cursor: var(--cursor-disabled, not-allowed);
      &:before {
        border-color: var(--cds-icon-disabled);
        background-color: var(--cds-icon-disabled);
        cursor: var(--cursor-disabled, not-allowed);
      }

      &:after {
        cursor: var(--cursor-disabled, not-allowed);
      }
    }

    .fjs-form-field.fjs-disabled .fjs-input[type='checkbox'] {
      cursor: var(--cursor-disabled, not-allowed);
      &:before {
        border-color: var(--cds-icon-disabled);
        cursor: var(--cursor-disabled, not-allowed);
      }
    }

    .fjs-form-field-datetime.fjs-disabled .fjs-input-group .fjs-input-adornment svg {
      color: var(--cds-icon-disabled);
      cursor: var(--cursor-disabled, not-allowed);
    }

    .fjs-taglist.fjs-disabled .fjs-taglist-tag {
      background-color: var(--cds-layer-01);

      .fjs-taglist-tag-label {
        padding: 2px 0px;
        opacity: 0.7;
        color: var(--cds-text-on-color-disabled);
      }
    }
  }
`;

const LABEL_DESCRIPTION_ERROR_STYLES = css`
  .fjs-container {
    .fjs-form-field-label {
      font-size: var(--cds-label-01-font-size);
      font-weight: var(--cds-label-01-font-weight);
      line-height: var(--cds-label-01-line-height);
      letter-spacing: var(--cds-label-01-letter-spacing);
    }

    .fjs-form-field:not(.fjs-form-field-checkbox, .fjs-form-field-grouplike) .fjs-form-field-label:first-child {
      margin: 0;
      margin-bottom: var(--cds-spacing-03);
    }

    .fjs-form-field.fjs-form-field-radio .fjs-form-field-label:not(:first-of-type),
    .fjs-form-field.fjs-form-field-checklist .fjs-form-field-label:not(:first-of-type) {
      margin: 0;
      margin-bottom: 0.1875rem;
    }

    .fjs-form-field.fjs-form-field-radio .fjs-form-field-label:not(:first-of-type) {
      min-height: ${rem(27)};
    }

    .fjs-form-field-description {
      margin: 0;
      margin-top: var(--cds-spacing-02);
      font-size: var(--cds-helper-text-01-font-size);
      font-weight: var(--cds-helper-text-01-font-weight);
      line-height: var(--cds-helper-text-01-line-height);
      letter-spacing: var(--cds-helper-text-01-letter-spacing);
    }

    .fjs-form-field-error {
      margin: 0;
      margin-top: var(--cds-spacing-02);
      font-size: var(--cds-label-01-font-size);
      font-weight: var(--cds-label-01-font-weight);
      line-height: var(--cds-label-01-line-height);
      letter-spacing: var(--cds-label-01-letter-spacing);
    }

    .fjs-has-errors .fjs-form-field-description {
      display: none;
    }
  }
`;

const CHECKBOX_STYLES = css`
  .fjs-container {
    .fjs-input[type='checkbox'],
    .fjs-input[type='checkbox']:focus {
      all: unset;
      width: ${rem(6)};
    }

    .fjs-form-field .fjs-input[type='checkbox'] {
      position: relative;
      display: flex;
      min-height: ${rem(24)};
      padding-top: ${rem(3)};
      padding-left: ${rem(20)};
      cursor: pointer;
      user-select: none;
      font-size: var(--cds-body-short-01-font-size);
      font-weight: var(--cds-body-short-01-font-weight);
      line-height: var(--cds-body-short-01-line-height);
      letter-spacing: var(--cds-body-short-01-letter-spacing);

      &:before,
      &:after {
        box-sizing: border-box;
      }

      &:before {
        position: absolute;
        top: ${rem(3)};
        left: 0;
        width: ${rem(16)};
        height: ${rem(16)};
        border: 1px solid var(--cds-icon-primary);
        margin: ${rem(2)} ${rem(2)} ${rem(2)} ${rem(3)};
        background-color: transparent;
        border-radius: 1px;
        content: '';
      }

      &:after {
        position: absolute;
        top: ${rem(9)};
        left: ${rem(7)};
        width: ${rem(9)};
        height: ${rem(5)};
        border-bottom: 2px solid var(--cds-icon-inverse);
        border-left: 2px solid var(--cds-icon-inverse);
        margin-top: ${rem(-3)};
        background: 0 0;
        content: '';
        transform: scale(0) rotate(-45deg);
        transform-origin: bottom right;
      }
    }

    .fjs-form-field .fjs-input[type='checkbox']:focus {
      &:before {
        outline: 2px solid var(--cds-focus);
        outline-offset: 1px;
      }
    }

    .fjs-form-field.fjs-checked .fjs-input[type='checkbox'],
    .fjs-form-field .fjs-form-field-label.fjs-checked .fjs-input[type='checkbox'] {
      &:before {
        border: none;
        border-width: 1px;
        background-color: var(--cds-icon-primary);
      }

      &:after {
        transform: scale(1) rotate(-45deg);
      }
    }

    .fjs-form-field-checklist .fjs-form-field-label:not(:first-of-type) {
      font-size: var(--cds-body-short-01-font-size);
      font-weight: var(--cds-body-short-01-font-weight);
      line-height: var(--cds-body-short-01-line-height);
      letter-spacing: var(--cds-body-short-01-letter-spacing);
      color: var(--cds-text-primary);
    }

    .fjs-form-field-checkbox .fjs-form-field-label {
      font-size: var(--cds-body-short-01-font-size);
      font-weight: var(--cds-body-short-01-font-weight);
      line-height: var(--cds-body-short-01-line-height);
      letter-spacing: var(--cds-body-short-01-letter-spacing);
      color: var(--cds-text-primary);
    }
  }
`;

const TAGLIST_STYLES = css`
  .fjs-container {
    .fjs-taglist {
      display: flex;
      align-items: center;
      min-height: 2.5rem;
      height: unset !important;
    }

    .fjs-taglist:focus-within {
      outline: 2px solid var(--cds-focus);
      outline-offset: -2px;
    }

    .fjs-taglist .fjs-taglist-input {
      &,
      &::placeholder {
        color: var(--cds-text-primary);
      }
    }

    .fjs-taglist .fjs-taglist-tag {
      font-size: var(--cds-label-01-font-size);
      font-weight: var(--cds-label-01-font-weight);
      line-height: var(--cds-label-01-line-height);
      letter-spacing: var(--cds-label-01-letter-spacing);
      max-width: 100%;
      padding: 0 0.5rem;
      border-radius: 0.9375rem;
      word-break: break-word;
      min-width: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      & .fjs-taglist-tag-label {
        padding: 0;
        max-width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      & .fjs-taglist-tag-remove {
        all: unset;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        padding: 0;
        border: 0;
        margin: 0 ${rem(-8)} 0 0.125rem;
        cursor: pointer;
      }

      & .fjs-taglist-tag-remove svg {
        all: unset;
        color: var(--cds-icon-inverse);
      }

      & .fjs-taglist-tag-remove:focus {
        background-color: transparent;
        outline: 1px solid var(--cds-focus-inverse);
      }
    }
  }
`;

const RADIO_STYLES = css`
  .fjs-container .fjs-form-field-radio {
    .fjs-input {
      appearance: none;
      width: 0;
      margin: 0;
      margin-right: calc(${rem(18)} + var(--cds-spacing-03));
      position: relative;
      height: ${rem(18)};
      outline: none;

      &:focus:before {
        outline: 2px solid var(--cds-focus);
        outline-offset: 1.5px;
      }

      &:before {
        position: absolute;
        top: 0;
        left: 0;
        width: ${rem(18)};
        height: ${rem(18)};
        border: 1px solid var(--cds-icon-primary);
        background-color: transparent;
        border-radius: 50%;
        content: '';
      }
    }

    .fjs-checked .fjs-input:after {
      position: relative;
      top: 0;
      left: 0;
      display: inline-block;
      width: ${rem(18)};
      height: ${rem(18)};
      background-color: var(--cds-icon-primary);
      border-radius: 50%;
      content: '';
      transform: scale(0.5);
    }

    &.fjs-disabled .fjs-input:before {
      border-color: var(--cds-icon-disabled);
    }

    &.fjs-disabled .fjs-checked .fjs-input:after {
      background-color: var(--cds-icon-disabled);
    }

    .fjs-form-field-label:not(:first-of-type) {
      font-size: var(--cds-body-short-01-font-size);
      font-weight: var(--cds-body-short-01-font-weight);
      line-height: var(--cds-body-short-01-line-height);
      letter-spacing: var(--cds-body-short-01-letter-spacing);
      color: var(--cds-text-primary);
    }
  }
`;

const BUTTON_STYLES = css`
  .fjs-container {
    .fjs-form-field.fjs-form-field-button .fjs-button {
      font-size: var(--cds-body-short-01-font-size);
      font-weight: var(--cds-body-short-01-font-weight);
      line-height: var(--cds-body-short-01-line-height);
      letter-spacing: var(--cds-body-short-01-letter-spacing);
      min-height: ${rem(32)};
      padding: calc(0.375rem - 3px) 60px calc(0.375rem - 3px) 12px;
      text-align: left;
      color: var(--cds-button-tertiary);
      border: 1px solid var(--cds-button-tertiary);
      border-radius: 0;
      background-color: transparent;
      cursor: pointer;
    }

    .fjs-form-field.fjs-form-field-button .fjs-button:hover {
      color: var(--cds-text-inverse);
      background-color: var(--cds-button-tertiary-hover);
    }

    .fjs-form-field.fjs-form-field-button .fjs-button:focus {
      border-color: var(--cds-focus);
      box-shadow:
        inset 0 0 0 1px var(--cds-focus),
        inset 0 0 0 2px var(--cds-background);
      color: var(--cds-text-inverse);
      background-color: var(--cds-button-tertiary);
    }

    .fjs-form-field.fjs-form-field-button .fjs-button:active {
      border-color: transparent;
      background-color: var(--cds-button-tertiary-active);
      color: var(--cds-text-inverse);
    }

    .fjs-form-field.fjs-form-field-button .fjs-button:disabled {
      border: 1px solid var(--cds-button-disabled);
      background: transparent;
      box-shadow: none;
      color: var(--cds-text-on-color-disabled);
      cursor: var(--cursor-disabled, not-allowed);
      outline: none;
    }

    .fjs-form-field.fjs-form-field-button .fjs-button[type='submit'] {
      background-color: var(--cds-button-primary);
      border: 1px solid transparent;
      color: var(--cds-text-on-color);
    }

    .fjs-form-field.fjs-form-field-button .fjs-button[type='submit']:disabled {
      background: var(--cds-button-disabled);
    }
  }
`;

const NUMBER_INPUTS = css`
  ${({ theme }) => css`
    .fjs-container .fjs-form-field-number .fjs-input-group {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid var(--cds-border-strong);
      height: 2.5rem;
      box-sizing: border-box;

      &:focus-within {
        outline: 2px solid var(--cds-focus);
        outline-offset: -2px;
      }

      & .fjs-input {
        border-radius: 0;
        border: none;
        font-size: var(--cds-body-short-01-font-size);
        font-weight: var(--cds-body-short-01-font-weight);
        line-height: var(--cds-body-short-01-line-height);
        letter-spacing: var(--cds-body-short-01-letter-spacing);
      }

      & .fjs-number-arrow-container {
        all: unset;
        border: none;
        border-radius: 0;
        display: flex;
        flex-direction: row-reverse;
        align-items: center;
        background-color: var(--cds-field);
      }

      & .fjs-number-arrow-container .fjs-number-arrow-up,
      & .fjs-number-arrow-container .fjs-number-arrow-down {
        width: 40px;
        height: calc(40px - 1px);
        background-color: var(--cds-field);
        color: transparent;

        &:hover {
          background-color: var(--cds-field-hover);
          cursor: pointer;
        }
      }

      &.fjs-disabled .fjs-number-arrow-container .fjs-number-arrow-up:hover,
      &.fjs-disabled .fjs-number-arrow-container .fjs-number-arrow-down:hover {
        background-color: var(--cds-field);
        cursor: not-allowed;
      }

      & .fjs-number-arrow-container .fjs-number-arrow-separator {
        width: 0.0625rem;
        height: 1rem;
        background-color: var(--cds-border-subtle);
      }

      & .fjs-number-arrow-container .fjs-number-arrow-down {
        background-image: ${getNumberInputMinusSvg(theme.iconPrimary)};
        background-repeat: no-repeat;
        background-position: right 50% bottom 50%;
      }

      & .fjs-number-arrow-container .fjs-number-arrow-up {
        background-image: ${getNumberInputPlusSvg(theme.iconPrimary)};
        background-repeat: no-repeat;
        background-position: right 50% bottom 50%;
      }

      &.fjs-disabled .fjs-number-arrow-container .fjs-number-arrow-up {
        background-image: ${getNumberInputPlusSvg(theme.iconDisabled)};
      }

      &.fjs-disabled .fjs-number-arrow-container .fjs-number-arrow-down {
        background-image: ${getNumberInputMinusSvg(theme.iconDisabled)};
      }
    }
  `}
`;

const DATETIME_INPUTS = css`
  ${({ theme }) => css`
    .fjs-container {
      .fjs-form-field-datetime {
        .fjs-input.flatpickr-input {
          width: 100%;
          height: 100%;
          border: none;
          border-radius: 0;

          &,
          &::placeholder {
            color: var(--cds-text-primary);
          }
        }

        .fjs-input.flatpickr-input:disabled {
          color: var(--cds-text-disabled);
        }

        .fjs-input.flatpickr-input:disabled::placeholder {
          color: var(--cds-text-disabled);
        }

        .fjs-input.flatpickr-input:disabled::placeholder {
          color: var(--cds-text-disabled);
        }

        select {
          ${getBaseInputStyles({ height: '1.5rem' })};
          ${getSelectArrowStyles({
            arrowRightPosition: 'var(--cds-spacing-03)',
            color: theme.iconPrimary,
          })};
          border-bottom: none;
          padding-right: 2rem;
        }

        .fjs-input-group {
          display: flex;
          flex-direction: row-reverse;
          position: relative;
        }

        .fjs-input-group .fjs-input-adornment {
          border: none;
          border-radius: 0;
          background-color: var(--cds-field);
          display: flex;
          padding-right: var(--cds-spacing-05);
        }

        .fjs-input-group .fjs-input-adornment svg {
          color: var(--cds-icon-primary);
          cursor: pointer;
        }

        .flatpickr-wrapper {
          height: 100%;
          position: initial;
        }

        .fjs-timepicker.fjs-timepicker-anchor {
          position: unset;
        }

        .flatpickr-calendar.static {
          top: calc(100% + 3px);
        }

        .flatpickr-calendar .flatpickr-prev-month svg,
        .flatpickr-calendar .flatpickr-next-month svg {
          height: 16px;
        }

        .flatpickr-day.today {
          position: relative;
          color: var(--cds-link-primary);
          font-weight: 600;
          border-color: transparent;
        }

        .flatpickr-day.selected,
        .flatpickr-day.today.selected,
        .flatpickr-day.selected:hover,
        .flatpickr-day.today.selected:hover {
          background-color: var(--cds-button-primary);
          color: var(--cds-text-on-color);
        }

        .flatpickr-day:focus {
          outline: 2px solid var(--cds-focus);
          outline-offset: -2px;
        }

        .flatpickr-day.selected:focus {
          outline: 0.0625rem solid var(--cds-focus);
          outline-offset: -0.1875rem;
        }

        .flatpickr-day:hover {
          background: var(--cds-layer-hover);
        }

        .flatpickr-days,
        .flatpickr-weekdays {
          padding: unset;
          width: unset;
        }
      }
    }
  `}
`;

const SELECT_STYLES = css`
  ${({ theme }) => css`
    .fjs-container {
      .fjs-form-field-select .fjs-input-group {
        ${getBaseInputStyles({ height: '2.5rem' })}
        ${getSelectArrowStyles({
          arrowRightPosition: 'var(--cds-spacing-05)',
          color: theme.iconPrimary,
        })}

        .fjs-select-display {
          display: flex;
          align-items: center;
        }

        .fjs-select-arrow {
          color: transparent;
        }

        .fjs-select-cross {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: var(--cds-spacing-04);
          width: 2.5rem;
          height: calc(2.5rem - 1px);

          &:hover {
            background-color: var(--cds-layer-hover);
          }

          svg {
            color: var(--cds-icon-primary);
          }
        }

        .fjs-input {
          color: var(--cds-text-primary);
          background-color: var(--cds-field);
          border-radius: 0;
          border: none;
          border-bottom: 1px solid var(--cds-border-strong);
          height: 2.5rem;
          font-size: var(--cds-body-short-01-font-size);
          font-weight: var(--cds-body-short-01-font-weight);
          line-height: var(--cds-body-short-01-line-height);
          letter-spacing: var(--cds-body-short-01-letter-spacing);
        }
      }

      .fjs-form-field-select .fjs-select-anchor .fjs-dropdownlist {
        position: absolute;
        top: -4px;
      }

      .fjs-form-field-select .fjs-input-group:focus-within {
        outline: 2px solid var(--cds-focus);
        outline-offset: -2px;
      }

      .fjs-form-field-select.fjs-disabled .fjs-input-group {
        ${getSelectArrowStyles({
          arrowRightPosition: 'var(--cds-spacing-05)',
          color: theme.iconDisabled,
        })}
      }

      .fjs-has-errors.fjs-form-field-select .fjs-input-group:focus-within {
        outline: 2px solid var(--cds-focus);
        outline-offset: -2px;
      }

      .fjs-has-errors.fjs-form-field-select .fjs-input-group {
        outline: 2px solid var(--cds-text-error);
        outline-offset: -2px;
      }
    }
  `}
`;

const REMAINING_INPUTS = css`
  .fjs-container {
    .fjs-form-field-textfield .fjs-input-group,
    .fjs-form-field-datetime .fjs-input-group,
    .fjs-textarea,
    .fjs-taglist,
    .fjs-form-field-select.fjs-disabled .fjs-input-group {
      ${getBaseInputStyles({ height: '2.5rem' })}
    }

    .fjs-form-field-textfield .fjs-input-group,
    .fjs-form-field-datetime .fjs-input-group {
      &:focus-within {
        outline: 2px solid var(--cds-focus);
        outline-offset: -2px;
      }
    }
    .fjs-form-field-textfield .fjs-input,
    .fjs-form-field-datetime .fjs-input {
      background-color: var(--cds-field);
      color: var(--cds-text-primary);
      border-radius: 0;
    }

    .fjs-has-errors.fjs-form-field-number .fjs-input-group:focus-within,
    .fjs-has-errors.fjs-form-field-textarea .fjs-textarea:focus,
    .fjs-form-field-textfield.fjs-has-errors .fjs-input-group:focus-within,
    .fjs-form-field-textfield.fjs-has-errors .fjs-input-group:focus,
    .fjs-form-field-datetime.fjs-has-errors .fjs-input-group:focus-within,
    .fjs-form-field-datetime.fjs-has-errors .fjs-input-group:focus {
      outline: 2px solid var(--cds-focus);
      outline-offset: -2px;
    }

    .fjs-has-errors.fjs-form-field-number .fjs-input-group,
    .fjs-has-errors.fjs-form-field-textarea .fjs-textarea,
    .fjs-form-field-textfield.fjs-has-errors .fjs-input-group,
    .fjs-form-field-textfield.fjs-has-errors .fjs-input-group,
    .fjs-form-field-datetime.fjs-has-errors .fjs-input-group,
    .fjs-form-field-datetime.fjs-has-errors .fjs-input-group {
      outline: 2px solid var(--cds-text-error);
      outline-offset: -2px;
    }
  }
`;

const DROPDOWN_STYLES = css`
  .fjs-container {
    .fjs-form-field-taglist .fjs-taglist-anchor .fjs-dropdownlist,
    .fjs-form-field-datetime .fjs-timepicker-anchor .fjs-dropdownlist,
    .fjs-form-field-select .fjs-select-anchor .fjs-dropdownlist {
      margin: 0;
      max-height: ${rem(264)};
      border: none;
      background-color: var(--cds-layer);
      overflow-y: auto;
      cursor: pointer;
      border-radius: 0;
      box-shadow: 0 2px 6px var(--cds-shadow);

      & .fjs-dropdownlist-item {
        border: none;
        box-sizing: border-box;
        padding: 0;
        margin: 0 var(--cds-spacing-05);
      }

      & .fjs-dropdownlist-item:not(:first-of-type):not(:hover) {
        border-top: 1px solid var(--cds-border-subtle);
      }

      & .fjs-dropdownlist-item,
      & .fjs-dropdownlist-empty {
        font-size: var(--cds-body-short-01-font-size);
        font-weight: var(--cds-body-short-01-font-weight);
        line-height: var(--cds-body-short-01-line-height);
        letter-spacing: var(--cds-body-short-01-letter-spacing);
        height: ${rem(40)};
        color: var(--cds-text-secondary);
        cursor: pointer;
        user-select: none;
        display: flex;
        align-items: center;
        background-color: transparent;
      }

      & .fjs-dropdownlist-empty {
        color: var(--cds-text-disabled);
        cursor: default;
      }

      & .fjs-dropdownlist-item:hover,
      & .fjs-dropdownlist-item.focused {
        background-color: var(--cds-layer-hover);
        color: var(--cds-text-primary);
        margin: 0;
        padding: 0 var(--cds-spacing-05);
      }

      & .fjs-dropdownlist-item:not(:first-of-type):hover {
        padding-top: 1px;
      }

      & .fjs-dropdownlist-item.focused + .fjs-dropdownlist-item {
        border: none;
        padding-top: 1px;
      }
    }
  }
`;

const ADORNMENTS_STYLES = css`
  .fjs-container .fjs-form-field:not(.fjs-form-field-datetime) {
    .fjs-input-group .fjs-input-adornment {
      all: unset;
      display: flex;
      align-items: center;
      background-color: var(--cds-field);
      color: var(--cds-text-secondary);
      padding: 0 var(--cds-spacing-04);
      cursor: default;

      &.border-right {
        padding-right: 0;
      }

      &.border-left {
        padding-left: 0;
      }
    }

    &.fjs-disabled .fjs-input-group .fjs-input-adornment {
      color: var(--cds-text-disabled);
    }
  }
`;

const CARBON_STYLES = css`
  ${MARKDOWN_STYLES}
  ${ANCHOR_STYLES}
  ${READONLY_STYLES}
  ${DISABLED_STYLES}
  ${LABEL_DESCRIPTION_ERROR_STYLES}
  ${CHECKBOX_STYLES}
  ${TAGLIST_STYLES}
  ${RADIO_STYLES}
  ${BUTTON_STYLES}
  ${NUMBER_INPUTS}
  ${DATETIME_INPUTS}
  ${REMAINING_INPUTS}
  ${ADORNMENTS_STYLES}
  ${DROPDOWN_STYLES}
  ${SELECT_STYLES}

  .fjs-container {
    width: 100%;
    height: min-content;

    .cds--grid {
      padding: 0;
    }

    .fjs-form {
      background-color: transparent;
      color: var(--cds-text-primary);
      padding: 0;
    }

    @media (width < 66rem) {
      // Carbon lg width breakpoint
      .fjs-layout-column .fjs-form-field {
        margin-left: 0;
        margin-right: 0;
      }
    }

    .fjs-input-group {
      margin: 0;
    }
  }
`;

const GlobalFormStyling = createGlobalStyle`
  ${CARBON_STYLES}
`;

export { CARBON_STYLES, GlobalFormStyling };
