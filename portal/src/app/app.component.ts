import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { UserService } from './shared/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'portal';
  constructor(private _userService:UserService) { }

  @HostListener('window:beforeunload', ['$event'])
   onWindowClose(event: any): void {
    // Do something
    this._userService.deleteToken();
    sessionStorage.clear();  
  }
}
