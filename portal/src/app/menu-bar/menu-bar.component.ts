import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit {
userName:string;

  constructor(private userService: UserService, private router: Router) { 
    this.userName = sessionStorage.getItem('userName')
  }

  ngOnInit() {
  }
  onLogout(){
    this.userService.deleteToken();
    this.router.navigate(['/login']);
    sessionStorage.clear();
  }
}
