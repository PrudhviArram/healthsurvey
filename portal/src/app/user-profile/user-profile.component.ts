import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { NgForm } from '@angular/forms';
import { PainForm } from '../shared/painForm.model';
import { PainScale } from '../shared/painScale.model';
import { RuminationForm } from '../shared/ruminationForm.model';
import { ControlForm } from '../shared/control.model';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userDetails;
  public userName:string;
  painQuestions: Array<PainForm>;
  painscale = new PainScale();
  ruminationAuestions: Array<RuminationForm>;
  controlQuestions: Array<ControlForm>;
  years:number;
  months:number;
  weeks:number;
  days:number;
  panicError:boolean=false;
  yearsArray:number[]=[];
  monthsArray:number[]=[];
  weeksArray:number[]=[];
  daysArray:number[]=[];
  showSucessMessage:boolean=false;
  showDemographic:boolean=false;
  showAlert:boolean = false;
  remainingDays:number;
  demographicMessage:boolean=false;
  serverErrorMessages:any;
  feedback:any;
  demoDetails ={
    pcode:null,
    name:'',
    email:'',
    age :'',
    race:[],
    gender:'',
    chronicPain:'',
    paincPeriod:'',
    degree:'',
    employment:'',
    date:null

  };
  pagenumber = 1;
  showFeedback: boolean;
  feedbackRequired: boolean=false;
  id: any;
  feedbackMessage: boolean;
  constructor(private userService: UserService) { 
    for(var i=1;i<=90;i++){
      this.yearsArray.push(i);
    }
    for(var i=1;i<=12;i++){
      this.monthsArray.push(i);
    }
    for(var i=1;i<=4;i++){
      this.weeksArray.push(i);
    }
    for(var i=1;i<=31;i++){
      this.daysArray.push(i);
    }
    
  }

  ngOnInit() {

    this.painQuestions = [
      { q: 'How would you rate your pain on a 0-10 scale at the present time, this is right now', ans: null},
      { q: 'In the past 5 days, how intense was your worst pain rated on a 0-10 scale?', ans: null },
      { q: 'In the past 5 days, on average, how intense was your pain rated on a 0-10 scale? (That is your usual pain at times you were experiencing pain.)', ans: null },
      { q: 'About how many days in the last 5 days have you been kept from your usual activities (work, school, housework) because of this pain?', ans: null },
      { q:'In the past 5 days, how much has this pain interfered with your daily activities on a 0-10 scale where 0 is \'no interference\' and 10 is \'extreme change\'?',ans:null},
      { q:'In the past 5 days, how much has this pain changed your ability to take part in recreational, social, and family activities where 0 is \'no change\' and 10 is \'extreme change\'?',ans:null},
      { q:'In the past 5 days, how has this pain changed your ability to work (including housework) where 0 is \'no change\' and 10 is \'extreme change\'?',ans:null}
    ];

    this.ruminationAuestions =[
      {q:'Pain interrupts my thinking',ans:null},
      {q:'I can\'t stop thinking about pain',ans:null},
      {q:'Pain goes around and around in my head',ans:null},
      {q:'It is hard to think about anything else but pain',ans:null},
      {q:'I can\'t push pain out of my thoughts',ans:null},
      {q:'Pain dominates my thinking',ans:null},
      {q:'Pain easily captures my thinking',ans:null},
      {q:'I keep thinking about pain',ans:null},
      {q:'When my mind wanders it goes to pain',ans:null},
      {q:'Pain intrudes on my thoughts',ans:null}
    ];

    this.controlQuestions =[
      {q:'How much control do you feel like you have over your pain?',ans:null},
      {q:'How much do you trust yourself to handle your own pain?',ans:null},
      {q:'How hopeful do you feel about your pain in the future?',ans:null},
      {q:'How much distress do you feel about your pain?',ans:null}
    ]
    this.userService.getUserProfile().subscribe(
      res => {
        this.userDetails = res['user'];
        
        sessionStorage.setItem('userName',this.userDetails.fullName);
        sessionStorage.setItem('emailId', this.userDetails.email);
        sessionStorage.setItem('pcode', this.userDetails.participantCode);
       this.userName = sessionStorage.getItem('userName');
       
       this.findDemographic();

      },
      err => { 
        console.log(err); 
        
      }
    );
    
  }

  findDemographic() {
    let data:any;
    this.userService.getDemographic(this.userDetails.email).subscribe(
      res => {
        data = res;
        
        if(data.message == 'User record found'){
          this.showDemographic = false;
          this.findForm();
        }else this.showDemographic = true;
        
      }
    );
  }
  findForm(){
    console.log("in form");
    this.userService.findForm(this.userDetails.email).subscribe(
      res => {
        let data :any;
        
        data = res;
        console.log(res);
        if(data.message=='User record found'){
        let date = new Date( data.user.date);
        var diff = Math.abs( new Date().getTime() - date.getTime()); 
        var diffDays = Math.ceil(diff / (1000 * 3600 * 24)); 
        this.remainingDays = 7 - diffDays;
        console.log(this.remainingDays);
        if(this.remainingDays>0){
        this.showAlert = true;
        }else if(this.remainingDays<=0 && data.user.feedback==''){
          this.showFeedback = true;
          this.id = data.user._id;
          console.log(this.id);
          
        }
        }
        else{
          this.showAlert= false;
        }
      }
    );
  }
  onSubmit(form :NgForm){
    if(this.years!=undefined || this.months!=undefined || this.weeks!=undefined || this.days!=undefined){
      this.panicError = false;
      if(this.years!=undefined){
        this.demoDetails.paincPeriod=this.demoDetails.paincPeriod+this.years.toString()+"years ";
      }
      if(this.months!=undefined){
        this.demoDetails.paincPeriod=this.demoDetails.paincPeriod+this.months.toString()+"months ";
      }
      if(this.weeks!=undefined){
        
        this.demoDetails.paincPeriod=this.demoDetails.paincPeriod+ this.weeks.toString()+"weeks ";
      }
      if(this.days!=undefined){
        this.demoDetails.paincPeriod=this.demoDetails.paincPeriod+this.days.toString()+"days ";
      }
      
      //service call starts here
      this.demoDetails.pcode = this.userDetails.participantCode;
      this.demoDetails.name = this.userDetails.fullName;
      this.demoDetails.email = this.userDetails.email;
      this.demoDetails.date = new Date().toDateString();
      
      this.userService.submitDemo(this.demoDetails).subscribe(
        res => {
         
          this.demographicMessage = true;
          setTimeout(() => {this.demographicMessage = false, this.showDemographic = false;}, 4000);
          this.resetForm(form);
        },
        err => {
          if (err.status === 422) 
            console.log("422");
          else
          console.log("admin");
        }
      );

    }
    else{ 
      this.panicError = true;
    }
  }

  raceCheck(event,data){
    if(event.target.checked) {
      this.demoDetails.race.push(data);
    } else {
    for(var i=0 ; i < this.demoDetails.race.length; i++) {
      if(this.demoDetails.race[i] == data) {
        this.demoDetails.race.splice(i,1);
     }
   }
 }
  }

  resetForm(form :NgForm){
    form.resetForm();
    this.serverErrorMessages='';
  }

  prev(){
    this.pagenumber = this.pagenumber - 1;
  }
  next(){
    this.pagenumber = this.pagenumber+1;
  }
  
  painSubmit(){
    this.painscale.pcode = this.userDetails.participantCode;
    this.painscale.name = this.userDetails.fullName;
    this.painscale.emailId= this.userDetails.email;
    this.painscale.painScale = this.painQuestions;    
    this.painscale.ruminationScale = this.ruminationAuestions;
    this.painscale.controlScale = this.controlQuestions;
    
    this.painscale.date = new Date();
    this.userService.savePainScale(this.painscale).subscribe(res => {
      let data :any;
      data = res;
    
    if(data[0]=="painscale saved"){
      this.findForm();
      this.showAlert = true;
    }
    },
    err => {
      if (err.status === 422) 
        console.log("422"); 
      else
      console.log("admin");
    }
  );
  }
  
  submitFeedback(){
    console.log(this.feedback);
    if(this.feedback==undefined || this.feedback==''){
      this.feedbackRequired = true;
    }
    else{
      this.userService.submitFeedback(this.id,this.feedback).subscribe(res => {
        let data :any;
        data = res;
        this.feedbackMessage = true;

        setTimeout(() => {this.showAlert = false;
          this.showFeedback = false;}, 4000);
        
          },
          err => {
            if (err.status === 422) 
              console.log("422"); 
            else
            console.log("admin");
          }
        );
    }
  }

}


