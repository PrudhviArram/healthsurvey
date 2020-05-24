import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { SignUpComponent } from './user/sign-up/sign-up.component';
import { SignInComponent } from './user/sign-in/sign-in.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthGuard } from './auth/auth.guard';
import { MemoriesComponent } from './memories/memories.component';
import { AdminComponent } from './admin/admin.component';
import { AdminAuthGuard } from './auth/authAdmin.guard';


const routes: Routes = [
  {
      path: 'signup', component: UserComponent,
      children: [{ path: '', component: SignUpComponent }]
  },
  {
      path: 'login', component: UserComponent,
      children: [{ path: '', component: SignInComponent }]
  },
  {
      path: 'userprofile', component: UserProfileComponent,canActivate:[AuthGuard]
      
  },
  {  
       path:'memories', component: MemoriesComponent, canActivate:[AuthGuard]
  },
  {
      path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
      path: 'admin', component: AdminComponent,canActivate:[AdminAuthGuard]
      
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
