export function evalStringExpression(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `return ${expression};`) as any;
    } catch (error) {
      console.error(error);
    }
  }
  
  export function evalExpressionValueSetter(expression: string, argNames: string[]) {
    try {
      return Function(...argNames, `${expression} = expressionValue;`) as (value: any) => void;
    } catch (error) {
      console.error(error);
    }
  }
  
  export function evalExpression(expression: string | Function | boolean, thisArg: any, argVal: any[]): any {
    if (expression instanceof Function) {
      return expression.apply(thisArg, argVal);
    } else {
      return expression ? true : false;
    }
  }

  export function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
  }
  
  export function toString(value: any): string {
    return (value !== undefined && value !== null) ? `${value}` : '';
  }
  
  export function getValueInRange(value: number, max: number, min = 0): number {
    return Math.max(Math.min(value, max), min);
  }
  
  export function isString(value: any): value is string {
    return typeof value === 'string';
  }
  
  export function isNumber(value: any): value is number {
    return !isNaN(toInteger(value));
  }
  
  export function isInteger(value: any): value is number {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  }
  
  export function isDefined(value: any): boolean {
    return value !== undefined && value !== null;
  }
  
  export function padNumber(value: number) {
    if (isNumber(value)) {
      return `0${value}`.slice(-2);
    } else {
      return '';
    }
  }
  
  export function regExpEscape(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }
  
  export function hasClassName(element: any, className: string): boolean {
    return element && element.className && element.className.split &&
        element.className.split(/\s+/).indexOf(className) >= 0;
  }