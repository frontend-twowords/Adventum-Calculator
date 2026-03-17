import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ValidationService } from '../validation.service';
declare var $: any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  constructor(public router: Router, public validation: ValidationService) { }

  ngOnInit(): void {
    // $(window).scroll(function(){
    //   let elementNav=document.getElementById("navHeader");
    //   if ($(window).scrollTop() >= 50) {
    //     elementNav.classList.add('fixed-header');
    //   }
    //   else {
    //     elementNav.classList.remove('fixed-header');   
    //   }
    // });
  }
  About()
  {
    this.router.navigate(['/about']);
  }
  changepage = (type: number ): void => {
    if (type === 1){
      this.router.navigate(['/login']);
    }
    else{
      this.router.navigate(['/register']);
    }
  }
  Logout(): void{
    sessionStorage.clear();
  }

  
}
