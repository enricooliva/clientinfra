import { ControlBase } from "..";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";

export default class ControlUtils {
   
    static toFormGroup(controls: ControlBase<any>[] ) {
        let group: any = {};
    
        controls.forEach(ctrl => {
          if (ctrl.controlType ===  'array'){
            group[ctrl.key] =  new FormArray([]);                                
          }else{
            group[ctrl.key] =  new FormControl(ctrl.value || '', this.mapValidators(ctrl.validation));
          }      
        });    
        return new FormGroup(group);
      }
    
      static normalizeArray<T>(array: Array<T>, indexKey: keyof T) {
        const normalizedObject: any = {}
        for (let i = 0; i < array.length; i++) {
             const key = array[i][indexKey]
             normalizedObject[key] = array[i]
        }
        return normalizedObject as { [key: string]: T }
      }
      
      static  mapValidators(validators) {
        const formValidators = [];
      
        if(validators) {
          for(const validation of Object.keys(validators)) {
            if(validation === 'required') {
              formValidators.push(Validators.required);
            } else if(validation === 'min') {
              formValidators.push(Validators.min(validators[validation]));
            }
          }
        }  
        return formValidators;
      }
    
}