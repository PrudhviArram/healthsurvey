import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service'
import { Router } from "@angular/router";

@Component({
  selector: 'app-memories',
  templateUrl: './memories.component.html',
  styleUrls: ['./memories.component.css']
})
export class MemoriesComponent implements OnInit {
  userEmail:string;
  //activityCount:any;
  viewCount=0;
  userStories:any=[];
  counter:any;
  showStory:boolean=false;
  story:any;
  storyCount=0;
  pcode:string;
  flag2:boolean=false;
  userGroup: number;
  constructor(private userService: UserService, private router :Router) { 
    this.counter="START";
  }

  ngOnInit() {
      this.userEmail = sessionStorage.getItem('emailId');
      this.pcode = sessionStorage.getItem('pcode');
      
      if(this.userEmail!=null){
     
        /* this.userService.getCount(this.userEmail).subscribe(
        res=>{
          let data:any= res;
          this.activityCount = data.message;
              
        }
      );*/
        this.getMemories(this.userEmail);
      }
      else{
        this.router.navigateByUrl('/login');
      }
      if(this.pcode.startsWith('1')){
        this.userGroup = 1;
      }
      else if(this.pcode.startsWith('2')){
        this.userGroup = 2;
      }
      else{
        this.userGroup = 3;
      }
      
  }
  
  getMemories(emailId){
    this.userService.getMemories(emailId).subscribe(
      res=>{
        
        let data:any = res;
        this.userStories = data.user.userStories;
      }
    );
  }

  startCountdown(){
    if(this.userGroup=1){
      
      if(this.viewCount%2 ==1){
        this.counter=1;
      }
      else {
            this.counter=1;
      }
  }
    else{
    this.counter = 120; 
    }
    const interval = setInterval(() => {
      this.counter--; 
        
      if (this.counter < 0 ) {
        if(this.pcode=='100001'){
        if(this.storyCount == 3){
          
          this.storyCount=4;
        }
        
        clearInterval(interval);
        this.counter ="START";
        this.viewCount=this.viewCount+1;
          if(this.viewCount%2 ==1){
            this.showStory=true;             
            
            this.storyCount = this.storyCount+1;
          }
          else {
            this.showStory=false;
            
          }       
      }
      else{
        clearInterval(interval);
        this.counter ="START";
        this.flag2=true;
      }
    }
    }, 1000);
  }

}
 