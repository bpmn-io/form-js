import ButtonIcon from './Button.svg';
import CheckboxIcon from './Checkbox.svg';
import ChecklistIcon from './Checklist.svg';
import DatetimeIcon from './Datetime.svg';
import TaglistIcon from './Taglist.svg';
import FormIcon from './Form.svg';
import ColumnsIcon from './Group.svg';
import NumberIcon from './Number.svg';
import RadioIcon from './Radio.svg';
import SelectIcon from './Select.svg';
import SeparatorIcon from './Separator.svg';
import SpacerIcon from './Spacer.svg';
import DynamicListIcon from './DynamicList.svg';
import TextIcon from './Text.svg';
import HTMLIcon from './HTML.svg';
import ExpressionFieldIcon from './ExpressionField.svg';
import TextfieldIcon from './Textfield.svg';
import TextareaIcon from './Textarea.svg';
import IFrameIcon from './IFrame.svg';
import ImageIcon from './Image.svg';
import GroupIcon from './Group.svg';
import TableIcon from './Table.svg';

export const iconsByType = (type) => {
  return {
    button: ButtonIcon,
    checkbox: CheckboxIcon,
    checklist: ChecklistIcon,
    columns: ColumnsIcon,
    datetime: DatetimeIcon,
    group: GroupIcon,
    iframe: IFrameIcon,
    image: ImageIcon,
    number: NumberIcon,
    expression: ExpressionFieldIcon,
    radio: RadioIcon,
    select: SelectIcon,
    separator: SeparatorIcon,
    spacer: SpacerIcon,
    dynamiclist: DynamicListIcon,
    taglist: TaglistIcon,
    text: TextIcon,
    html: HTMLIcon,
    textfield: TextfieldIcon,
    textarea: TextareaIcon,
    table: TableIcon,
    default: FormIcon
  }[type];
};
