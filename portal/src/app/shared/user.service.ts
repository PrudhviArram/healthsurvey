import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams} from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from './user.model';
import { Demographic } from './demoDetails.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  selectedUser: User = {
    participantCode: null,
    fullName: '',
    email: '',
    password: ''
  };

  noAuthHeader = { headers: new HttpHeaders({ 'NoAuth': 'True' }) };

  constructor(private http: HttpClient) { }

  //HttpMethods

  postUser(user: User){
    return this.http.post(environment.apiBaseUrl+'/register',user,this.noAuthHeader);
  }

  login(authCredentials) {
    return this.http.post(environment.apiBaseUrl + '/authenticate', authCredentials,this.noAuthHeader);
  }

  getUserProfile() {
    return this.http.get(environment.apiBaseUrl + '/userProfile');
  }

  submitDemo(details: Demographic){
      console.log("service");
      console.log(details);
      return this.http.post(environment.apiBaseUrl + '/saveDemographicDetails',details);
  }
  getDemographic(emailId: string){
    
    return this.http.get(environment.apiBaseUrl + '/findDemographic',{params:{
      email: emailId
      }});
  }
findForm(emailId: string){
  
  return this.http.get(environment.apiBaseUrl + '/findForm',{params:{
    email: emailId
    }});
}
getCount(emailId:string){
  return this.http.get(environment.apiBaseUrl + '/getCount',{params:{
    email: emailId
    }});
}

getMemories(emailId:string){
  return this.http.get(environment.apiBaseUrl + '/getMemories',{params:{
    email: emailId
    }});
}
saveFile(doc){
  console.log(doc);
  return this.http.post(environment.apiBaseUrl + '/saveFile',{params:{
    pdfbuffer: doc
    }});
}

addStrories(emailId:string,storyArray:any){
  return this.http.post(environment.apiBaseUrl + '/addStrories',{params:{
    email: emailId,story:storyArray
    }});
}
submitFeedback(id,feedback:string){
  return this.http.post(environment.apiBaseUrl + '/submitFeedback',{params:{
    id: id,feedback:feedback
    }});
}
  savePainScale(painscale){
    return this.http.post(environment.apiBaseUrl + '/savePainScale',painscale);
  }

  getAllUsers(){
    return this.http.get(environment.apiBaseUrl + '/getAllUsers');
  }
  getAllDemographic(){
    return this.http.get(environment.apiBaseUrl + '/getAllDemographic');
  }

  getAllSurvey(){
    return this.http.get(environment.apiBaseUrl + '/getAllSurvey');
  }
  //Helper Methods

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  deleteToken() {
    localStorage.removeItem('token');
  }

  getUserPayload() {
    var token = this.getToken();
    if (token) {
      var userPayload = atob(token.split('.')[1]);
      return JSON.parse(userPayload);
    }
    else
      return null;
  }

  isLoggedIn() {
    var userPayload = this.getUserPayload();
    if (userPayload)
      return userPayload.exp > Date.now() / 1000;
    else
      return false;
  }
}
