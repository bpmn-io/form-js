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
import TextIcon from './Text.svg';
import TextfieldIcon from './Textfield.svg';
import TextareaIcon from './Textarea.svg';
import ImageIcon from './Image.svg';

export const iconsByType = (type) => {
  return {
    button: ButtonIcon,
    checkbox: CheckboxIcon,
    checklist: ChecklistIcon,
    columns: ColumnsIcon,
    datetime: DatetimeIcon,
    image: ImageIcon,
    number: NumberIcon,
    radio: RadioIcon,
    select: SelectIcon,
    taglist: TaglistIcon,
    text: TextIcon,
    textfield: TextfieldIcon,
    textarea: TextareaIcon,
    default: FormIcon
  }[type];
};