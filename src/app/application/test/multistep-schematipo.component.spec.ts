import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { AppModule } from 'src/app/app.module';
import { ApplicationService } from '../application.service';
import { Observable, of } from 'rxjs';
import { MultistepSchematipoComponent } from '../pages/multistep-schematipo.component';



class MockApplicationService extends ApplicationService {

  getDipartimenti(): Observable<any> {
    return of([]);
  }

  getPagamenti(): Observable<any> {
    return of([]);
  }

  getClassificazioni(): Observable<any> {
    return of([]);
  }
  
  getValidationOffices(): Observable<any> {
    return of([]);
  }
}

describe('MultistepSchematipoComponent', () => {
    let comp: MultistepSchematipoComponent;
    let fixture: ComponentFixture<MultistepSchematipoComponent>;
    let de: DebugElement;
    let el: HTMLElement;
  
    beforeEach(async(() => {  

      TestBed.configureTestingModule({
        declarations: [            
        ],
        imports: [                 
            AppModule
        ], 
        providers: [
          {provide: ApplicationService, useClass: MockApplicationService },          
        ]
      }).compileComponents().then(() => {
        fixture = TestBed.createComponent(MultistepSchematipoComponent);
  
        comp = fixture.componentInstance; // ContactComponent test instance    
        fixture.detectChanges();

      });
    }));
  
    // it(`should have as text 'inerimento convenzione'`, async(() => {
    //   expect(comp.text).toEqual('contact page');
    // }));
  
    // it(`should set submitted to true`, async(() => {
    //   comp.onSubmit();
    //   expect(comp.submitted).toBeTruthy();
    // }));
  
    // it(`should call the onSubmit method`, async(() => {
    //   spyOn(comp, 'onSubmit');
    //   el = fixture.debugElement.query(By.css('button')).nativeElement;
    //   el.click();
    //   expect(comp.onSubmit).toHaveBeenCalled();
    // }));
  
   it(`form should be invalid`, async(() => {    
      expect(comp.form.valid).toBeFalsy();
    }));
  
    it(`form should be valid`, async(() => {

      expect(comp.form.controls['descrizione_titolo']).not.toBeNull();
      expect(comp.form.controls['resp_scientifico']).not.toBeNull();
      expect(comp.form.controls['ambito']).not.toBeNull();
      
      //comp.form.controls['email'].setValue('asd@asd.com');     
      //expect(comp.form.valid).toBeTruthy();
    }));
  });