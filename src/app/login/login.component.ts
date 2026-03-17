import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  [x: string]: any;
  Email: string;
  Password: string;
  LoginType: number;
  LoginBtnText = 'Submit';
  PrevUrl:string;
  showPassword = false;
  inputtype = "password";
  constructor(
    private router: Router,
    private dataService: DataService,
    private validation: ValidationService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.PrevUrl=this.activatedRoute.snapshot.queryParams["ref"];
  }

  EnterLogin(event){
    if(event.keyCode == 13){
      this.Login();
    }
  }
 Login(): void{
    if (this.dataService.EmptyNullOrUndefined(this.Email) || this.dataService.EmptyNullOrUndefined(this.Password)){
      alert('Email and Password is mandatory for login');
    }else{
      this.LoginBtnText = 'Please wait ...';
      const LoginData = {Email: this.Email, Password: this.Password, LoginType: 0};
      const Response = this.dataService.PostAdventumRequest('v1/login', LoginData).subscribe((response) => {
        if (response.response.n === 1){
          this.dataService.login();
          sessionStorage.setItem('UserId' , response.user.Id);
          sessionStorage.setItem('UserName' , response.user.Name);
          sessionStorage.setItem('UserEmail' , response.user.Email);
          sessionStorage.setItem('User' , JSON.stringify(response.user));
          if(this.validation.isNullEmptyUndefined(this.PrevUrl)){
            this.router.navigate(['/']);
          }else{
            this.router.navigate([this.PrevUrl])
          }
          
        }else if (response.response.n === 0){
          alert(response.response.Msg);
        }else{
          alert('Something went wrong please try agian later');
        }
        this.LoginBtnText = 'Submit';
      });
    }
  
}

showpassword(){
  this.showPassword = true;
  this.inputtype = "text";
}

hidepassword(){
    this.showPassword = false;
    this.inputtype = "password";
}
}
