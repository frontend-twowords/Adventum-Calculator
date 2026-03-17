import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  webAPIkey = environment.webAPIKey;
  serverUrl = environment.serverUrl;
  dropdownArray=[{
    'Id':1,
    'Value':'More than £500,000 up to £1 million',
    'Result':'£3,700'
  },
  {
    'Id':2,
    'Value':'More than £1 million up to £2 million',
    'Result':'£7,500'
  },
  {
    'Id':3,
    'Value':'More than £2 million up to £5 million',
    'Result':'£25,300'
  },
  {
    'Id':4,
    'Value':'More than £5 million up to £10 million',
    'Result':'£59,100'
  },
  {
    'Id':5,
    'Value':'More than £10 million up to £20 million',
    'Result':'£118,600'
  },
  {
    'Id':6,
    'Value':'More than £20 million',
    'Result':'£237,400'
  }
];
  private loggedIn = new BehaviorSubject<boolean>(false);
  private header = { headers: new HttpHeaders()
                          .set('Access-Control-Allow-Origin', '*')
                          .set('Content-Type', 'application/json')
                          .set('apiKey', this.webAPIkey)
                    };
  constructor(private httpClient: HttpClient) { }
  public GetRequest(url): any{
    return this.httpClient.get(url);
  }


  public GetRequest1(url): Observable<any>{
    return this.httpClient.get(url);
  }

  public GetAdventumRequest(url: string): Observable<any>{
    url = this.serverUrl + url;
    return this.httpClient.get(url, this.header);
  }

  public PostAdventumRequest(url: string, data: any): Observable<any>{
    url = this.serverUrl + url;
    const postData = JSON.stringify(data);
    return this.httpClient.post(url, postData, this.header);
  }

  // tslint:disable-next-line: typedef
  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }
  // tslint:disable-next-line: typedef
  public login(){
    if (!this.EmptyNullOrUndefined(sessionStorage.getItem('UserId'))) { // {3}
       this.loggedIn.next(true);
    }else{
      this.loggedIn.next(false);
    }
  }

  public EmptyNullOrUndefined(str: string): boolean{
    if (str === null || str === '' || str === undefined){
      return true;
    }else{
      return false;
    }
  }

  public isNotNo(str): boolean{
    if (isNaN(str)){
      return true;
    }else{
      return false;
    }
  }
}
