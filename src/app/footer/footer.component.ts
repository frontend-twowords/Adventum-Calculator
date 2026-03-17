import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  removefromcarousel=false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    var $carousel = $('.carousel');
    $('.carousel').carousel({
      interval: 1000 * 10
    });
    $('.carousel').on('touchstart', function (event) {
      const xClick = event.originalEvent.touches[0].pageX;
      $(this).one('touchmove', function (event) {
        const xMove = event.originalEvent.touches[0].pageX;
        const sensitivityInPx = 5;

        if (Math.floor(xClick - xMove) > sensitivityInPx) {
          $(this).carousel('next');
        }
        else if (Math.floor(xClick - xMove) < -sensitivityInPx) {
          $(this).carousel('prev');
        }
      });
      $(this).on('touchend', function () {
        $(this).off('touchmove');
      });
    });
   
  }
  next(step) {
    switch (step) {
      case 1:
        $('#navbar-modal').modal('hide');
        localStorage.setItem('CalculatorText', '1');
        this.router.navigate(['/step1']);
        break;
      case 2:
        $('#navbar-modal').modal('hide');
        localStorage.setItem('CalculatorText', '2');
        this.router.navigate(['/capital-growth-calculator/step1']);
        break;
      case 3:
        $('#navbar-modal').modal('hide');
        localStorage.setItem('CalculatorText', '3');
        this.router.navigate(['/estimated-weekly-rent-calculator/step1']);
        break;
      case 4:
        $('#navbar-modal').modal('hide');
        localStorage.setItem('CalculatorText', '4');
        this.router.navigate(['/predictive-foreign-exchange/step1']);
        break;
      case 5:
        $('#navbar-modal').modal('hide');
        localStorage.setItem('CalculatorText', '5');
        this.router.navigate(['/stamp-duty-calculator/step1']);
        break;
      case 6:
        $('#navbar-modal').modal('hide');
        localStorage.setItem('CalculatorText', '6');
        this.router.navigate(['/cashflow/step1']);
        break;
        case 7:
          $('#navbar-modal').modal('hide');
          localStorage.setItem('CalculatorText', '7');
          this.router.navigate(['/ated/step1']);
          break;
      case 8:
        $('#navbar-modal').modal('hide');
        this.router.navigate(['/about']);
        break;
      case 9:
          $('#navbar-modal').modal('hide');
          this.router.navigate(['/login']);
          break;
      case 10:
        $('#navbar-modal').modal('hide');
        this.router.navigate(['/register']);
        break;
      

    }
  }
}
