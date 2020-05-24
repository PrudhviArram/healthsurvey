import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import {UserService} from '../shared/user.service';
import { NgForm } from "@angular/forms";
import { state, trigger, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  animations: [
    trigger('rowExpansionTrigger', [
        state('void', style({
            transform: 'translateX(-10%)',
            opacity: 0
        })),
        state('active', style({
            transform: 'translateX(0)',
            opacity: 1
        })),
        transition('* <=> *', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent implements OnInit {
  
  registeredUsers:any;
  demoGraphicDetails:any;
  userCols:any[]; 
  cols:any[];
  surveyCols:any[];
  surveyDetails:any;
  expanded:any;
  story1:any;
  story2:any;
  form:any={email:'',story1:'',story2:'',story3:''};
  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  success:any=null;
  @ViewChild('htmlData') htmlData:ElementRef;
  constructor(private userService : UserService, private router: Router) { }
  
  
  public openPDF():void {
    let DATA = this.htmlData.nativeElement;
    let doc = new jsPDF('p','pt', 'a4');
    let handleElement = {
      '#editor':function(element,renderer){
        return true;
      }
    };
    doc.fromHTML(DATA.innerHTML,30,30,{
      'width': 200,
      'elementHandlers': handleElement
    });
    var buffer = doc.output('arraybuffer');
    console.log(buffer);
    
    doc.save('angular-demo.pdf');

       // var file =    doc.save('angular-demo.pdf');

this.userService.saveFile(buffer).subscribe(
  res => {
    console.log(res);
  }
);


  }


  ngOnInit() {
    this.userCols=[
      {field: 'participantCode',header:'Participant Code'},
      {field: 'fullName',header:'Full Name'},
      {field: 'email',header:'Email'}
    ];
    this.cols = [
      
      {field: 'email', header: 'Email Id' },
      { field: 'age', header: 'age' },
      { field: 'gender', header: 'Gender' },
      {field:'race', header:'race'},
      { field: 'chronicPain', header: 'Pain' },
      { field: 'paincPeriod', header: 'Period' },
      { field: 'degree', header: 'degree' },
      { field: 'employment', header: 'Employment' },
      { field: 'date', header: 'Date' }
  ];
  this.surveyCols = [
    {field: 'pcode', header: 'Participant Code'},
    {field: 'name', header: 'Full Name'},
    {field: 'emailId', header: 'Email ID'},
    {field: 'date', header: 'Date'}
  ];

    this.getAllUsers();
    this.getAllDemographic();
    this.getAllSurvey();
  }

getAllUsers(){
  this.userService.getAllUsers().subscribe(
    res => {
      let data:any = res;
      this.registeredUsers = data.user;
    }
  );
}

getAllDemographic(){
  this.userService.getAllDemographic().subscribe(
    res => {
      let data:any = res;
      this.demoGraphicDetails = data.user;
    }
  );
}
getAllSurvey(){
  this.userService.getAllSurvey().subscribe(
    res => {
      let data:any = res;
      this.surveyDetails = data.user;     
    }
  );
  
}

story(form:NgForm){
  console.log("in story");
  let data:any[]=[];
  data.push(this.form.story1);
  data.push(this.form.story2);
  data.push(this.form.story3);
  console.log(data);
  this.userService.addStrories(this.form.email,data).subscribe(
    res => {
      console.log(res);
      let data:any=res;
      this.success =data.message;
      setTimeout(() => this.success = null, 4000);
      form.resetForm();
      this.getAllUsers();
    },
    err => {
      if (err.status === 422) { 
       // this.serverErrorMessages = err.error.join('<br/>');
      }
      else{}
       // this.serverErrorMessages = 'Something went wrong.Please contact admin.';
    }
  );
}

onLogout(){
  this.userService.deleteToken();
  this.router.navigate(['/login']);
  sessionStorage.clear();
}
}
