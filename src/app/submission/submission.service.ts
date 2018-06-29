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
        validation: {
          required: true
        }
      }),      
      new TextboxControl({
        key: 'surname',
        label: 'Cognome',
        value: null,
        validation: {
          required: true
        }
      }),      
      new DropdownControl({
        key: 'gender',
        label: 'Genere',
        options: [
          {key: 'm',  value: 'Maschio'},
          {key: 'f',  value: 'Femmina'},
        ],        
        validation: {
          required: true
        }
      }),       
      new TextboxControl({
        key: 'fiscalcode',
        label: 'Codice fiscale',
        value: null,
        validation: {
          required: true
        }
      }),      
      new TextboxControl({
        key: 'birthplace',
        label: 'Luogo di nascita',
        value: null,
        validation: {
          required: true
        }
      }),    
      new TextboxControl({
        key: 'birthprovince',
        label: 'Provincia di nascita',
        value: null,
        validation: {
          required: true
        }
      }),    
      new DateControl({
        key: 'birthdate',
        label: 'Data di nascita',
        value: null, //{ "year": 2017, "month": 2, "day": 25 },
        validation: {
          required: true
        }
      }),    
      new TextboxControl({
        key: 'com_res',
        label: 'Comune di residenza',
        value: null,
        validation: {
          required: true
        }
      }),    
      new TextboxControl({
        key: 'prov_res',
        label: 'Provincia di residenza',
        value: null,
        validation: {
          required: true
        }
      }),    
      new TextboxControl({
        key: 'via_res',
        label: 'Via di residenza',
        value: null,
        validation: {
          required: true
        }
      }),    
      new TextboxControl({
        key: 'civ_res',
        label: 'Civico',
        value: null,
        validation: {
          required: true
        }
      }),    
      new TextboxControl({
        key: 'presso',
        label: 'Presso',
        value: null,
        validation: {
          required: true
        }
      })  
    ]

    return submissionControls;
  }



}
