import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Submission } from './models/submission';
import { map } from 'rxjs/operators';
import { ControlBase, TextboxControl, DropdownControl, DateControl } from '../shared';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable()
export class SubmissionService {

  constructor(private http: HttpClient) { }

  getSumbissions() : Observable<any> {
    return this.http
      .get('http://pcoliva.uniurb.it/api/submissions',httpOptions);
  }

  getSubmission(): Observable<Submission> {    
    
    let res = this.http
       .get<Submission>('http://pcoliva.uniurb.it/api/submissions',{         
          params: new HttpParams().set('userId', '2')        
      });

    return res;
  }

  getSumbissionControls(){
    let submissionControls: ControlBase<any>[] = [
      new TextboxControl({
        key: 'name',
        label: 'Nome',
        value: null,
        required: true,
        order: 1
      }),      
      new TextboxControl({
        key: 'surname',
        label: 'Cognome',
        value: null,
        required: true,
        order: 1
      }),      
      new DropdownControl({
        key: 'gender',
        label: 'Genere',
        options: [
          {key: 'm',  value: 'Maschio'},
          {key: 'f',  value: 'Femmina'},
        ],        
        required: true,
        order: 1
      }),       
      new TextboxControl({
        key: 'fiscalcode',
        label: 'Codice fiscale',
        value: null,
        required: true,
        order: 1
      }),      
      new TextboxControl({
        key: 'birthplace',
        label: 'Luogo di nascita',
        value: null,
        required: true,
        order: 1
      }),    
      new TextboxControl({
        key: 'birthprovince',
        label: 'Provincia di nascita',
        value: null,
        required: true,
        order: 1
      }),    
      new DateControl({
        key: 'birthdate',
        label: 'Data di nascita',
        value: null,
        required: true,
        order: 1
      }),    
      new TextboxControl({
        key: 'com_res',
        label: 'Comune di residenza',
        value: null,
        required: true,
        order: 1
      }),    
      new TextboxControl({
        key: 'prov_res',
        label: 'Provincia di residenza',
        value: null,
        required: true,
        order: 1
      }),    
      new TextboxControl({
        key: 'via_res',
        label: 'Via di residenza',
        value: null,
        required: true,
        order: 1
      }),    
      new TextboxControl({
        key: 'civ_res',
        label: 'Civico',
        value: null,
        required: true,
        order: 1
      }),    
      new TextboxControl({
        key: 'presso',
        label: 'Presso',
        value: null,
        required: true,
        order: 1
      })  
    ]

    return submissionControls;
  }



}
