import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Name: string;
  Email: string;
  Password: string;
  ConfirmPassword: string;
  TermAccepted = false;
  buttonText = 'Sign Up';
  showPassword = false;
  showcnfPassword = false;
  inputtype = "password";
  cnfinputtype = "password";
  constructor( private router: Router,private dataService: DataService) { }

  ngOnInit(): void {
  }
  async registerUser(): Promise<void>{
    // tslint:disable-next-line: max-line-length
    if (this.dataService.EmptyNullOrUndefined(this.Name) || this.dataService.EmptyNullOrUndefined(this.Email) || this.dataService.EmptyNullOrUndefined(this.Password) || this.dataService.EmptyNullOrUndefined(this.ConfirmPassword)){
        alert('All field are mandatory');
    }else if (this.Password !== this.ConfirmPassword){
        alert('Password and Confirm password does not match');
    }else if (!this.TermAccepted){
        alert('Please accept the terms');
    }else{
      this.buttonText = 'Please wait ...';
      const Postdata = {Name: this.Name, Email: this.Email, Password: this.Password,RepeatPassword:this.ConfirmPassword};
      const Response = this.dataService.PostAdventumRequest('v1/register', Postdata).subscribe((response) => {   
        const result = response;
        if (result.n === 1){
          alert(result.Msg);
          this.reset();
          this.router.navigate(['/login']);
        }else if (result.n === 0){
          alert(result.Msg);
        }else{
          alert('Something went wrong please try agian later');
        }
        this.buttonText = 'Sign Up';
      });
      await Response;
    }
  }

  reset(): void{
    this.Name = '';
    this.Email = '';
    this.Password = '';
    this.ConfirmPassword = '';
    this.TermAccepted = false;
  }

  showpassword(){
    this.showPassword = true;
    this.inputtype = "text";
  }

  hidepassword(){
    this.showPassword = false;
    this.inputtype = "password";
  }

  showcnfpassword(){
    this.showcnfPassword = true;
    this.cnfinputtype = "text";
  }

  hidecnfpassword(){
    this.showcnfPassword = false;
    this.cnfinputtype = "password";
  }

}
