import { ControlBase } from './control-base';

export class DateControl extends ControlBase<string> {
  controlType = 'datepicker';
  type: Date;

  constructor(options: {} = {}) {
    super(options);
    this.type = options['type'] || '';
  }
}