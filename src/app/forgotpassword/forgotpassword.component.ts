import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { ValidationService } from '../validation.service';
declare var $:any
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  Email:string;
  Otp:string;
  Password: string;
  ConfirmPassword: string;
  LoginBtnText = 'Submit';
  buttonText = 'Submit';
  resendbuttonText = 'Resend OTP';
  showPassword = false;
  showcnfPassword = false;
  inputtype = "password";
  cnfinputtype = "password";
  interval : any;
  alertmsg:string;
  constructor( private router: Router,
    private dataService: DataService,
    private validation: ValidationService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
  }

  hidealert(){
    $("#errormsg").css("display","none");
  }

  
  countdown() { 
  clearInterval(this.interval);
  this.interval = setInterval(() => {
      var timer:any = this.resendbuttonText;
      timer =  timer.split(':');
      var minutes =  timer[0];
      var seconds =  timer[1];
      seconds -= 1;
      if (minutes < 0) return;
      else if (seconds < 0 && minutes != 0) {
          minutes -= 1;
          seconds = 59;
      }
      else if (seconds < 10 && seconds.length != 2){
        seconds = '0' + seconds
      };

      this.resendbuttonText = minutes + ':' + seconds;

      if (minutes == 0 && seconds == 0){ 
        clearInterval(this.interval)
        this.resendbuttonText = 'Resend OTP';
      };
  }, 1000);
  
}


  sendOtp(){
    $("#errormsg").css("display","none");
    var filter = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
    if (this.dataService.EmptyNullOrUndefined(this.Email)){
      alert('Email is mandatory');
    }
    else if(!filter.test(this.Email)){
      alert('Invalid Email');
    }
    else{
      if(this.LoginBtnText == 'Submit' && $("#sendotpdiv").css("display") == "block"){
        this.LoginBtnText = 'Please wait ...';
      }
      if(this.resendbuttonText == 'Resend OTP' && $("#changepassworddiv").css("display") == "block"){
        this.resendbuttonText = 'Please wait ...';
      }
      
      const data = {
        "Email" : this.Email
      }
      this.dataService.PostAdventumRequest("v1/sendotp",data).subscribe(response =>{
        if(response.response.n == 1){
          this.alertmsg = response.response.Msg;
          $("#sendotpdiv").css("display","none");
          $("#resetpassalert").css("display","block");
          $("#changepassworddiv").css("display","block");
          this.resendbuttonText = "3:00"
          this.countdown();
        }
        else if(response.response.n == 0){
          this.alertmsg = response.response.Msg;
          $("#errormsg").css("display","block");
        }
        else{
          alert('Something went wrong please try agian later')
        }
        this.LoginBtnText = 'Submit';
        //clearInterval(this.interval);
        //this.resendbuttonText = 'Resend OTP'
      })
    }

    
  }

  hideresetalert(){
    $("#resetpassalert").css("display","none");
    $("#resetpassalert").removeClass("alert-danger");
    $("#resetpassalert").addClass("alert-success");
  }

  resetPassword(){
    $("#resetpassalert").css("display","none");
    if (this.dataService.EmptyNullOrUndefined(this.Otp) || this.dataService.EmptyNullOrUndefined(this.Password) || this.dataService.EmptyNullOrUndefined(this.ConfirmPassword)){
      alert('All field are mandatory');
  }
  else if (this.Password !== this.ConfirmPassword){
      alert('Password and Confirm password does not match');
  }
  else if (this.Password.length < 8){
    alert('Password length should be 8 letters long');
}
else if (this.ConfirmPassword.length < 8){
  alert('Confirm Password length should be 8 letters long');
}
else{
  this.buttonText = 'Please wait ...';
  const data = {
    "Email" : this.Email,
    "Otp" : this.Otp,
    "Password" : this.Password,
    "ConfirmPassword" : this.ConfirmPassword
  }
  this.dataService.PostAdventumRequest("v1/resetpassword",data).subscribe(response =>{
    if(response.response.n == 1){
      alert(response.response.Msg);
      this.Resetform();
      this.router.navigate(['/login']);
    }
    else if(response.response.n == 0){
      this.alertmsg = response.response.Msg;
      $("#resetpassalert").removeClass("alert-success");
      $("#resetpassalert").addClass("alert-danger");
      $("#resetpassalert").css("display","block");
    }
    else{
      alert('Something went wrong please try agian later');
    }
    this.buttonText = 'Submit';
  })
}
 
  }

  Resetform(){
    this.Otp = "";
    this.Password = "";
    this.ConfirmPassword = "";
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
