import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { trigger,state,style,animate,transition } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations:[
    trigger('thirdsectionheading',[
    state(
      'visible',
      style({
        opacity:'1'
       })
      ),state(
        'hide',
        style({
          opacity:'0',
         })
        ),
      transition('* => visible', [animate('3s ease-out')])
  ]),
  trigger('thirdsection1block',[
    state(
      'visible',
      style({
        opacity:'1'
       })
      ),state(
        'hide',
        style({
          opacity:'0'
         })
        ),
      transition('* => visible', [animate('2s ease-in-out')])
  ]),
  trigger('thirdsection2block',[
    state(
      'visible',
      style({
        opacity:'1'
       })
      ),state(
        'hide',
        style({
          opacity:'0'
         })
        ),
      transition('* => visible', [animate('2s 0.5s ease-in-out')])
  ]),
  trigger('thirdsection3block',[
    state(
      'visible',
      style({
        opacity:'1'
       })
      ),state(
        'hide',
        style({
          opacity:'0'
         })
        ),
      transition('* => visible', [animate('2s 1s ease-in-out')])
  ]),
  trigger('thirdsection4block',[
    state(
      'visible',
      style({
        opacity:'1'
       })
      ),state(
        'hide',
        style({
          opacity:'0'
         })
        ),
      transition('* => visible', [animate('2s 1.5s ease-in-out')]),
  ])
]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('bgVideo') bgVideo: ElementRef<HTMLVideoElement>;
  showthirdsection:boolean;
  CalculatorType='';
  constructor(
    private router:Router,
    public viewportScroller:ViewportScroller
    ) {
    localStorage.clear();
  }

  ngAfterViewInit(): void {
    const video = this.bgVideo?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }

  ngOnInit(): void {
 
    $(function(){
      $("#img1").on({
        mouseenter: function(){
          $("#img1 img").attr('src','./assets/calculator-11.svg');
        },
        mouseleave: function(){
          $("#img1 img").attr('src','./assets/calculator-1.svg');
        }
      });
      $("#img2").on({
        mouseenter: function(){
          $("#img2 img").attr('src','./assets/calculator-22.svg');
        },
        mouseleave: function(){
          $("#img2 img").attr('src','./assets/calculator-2.svg');
        }
      });
      $("#img3").on({
        mouseenter: function(){
          $("#img3 img").attr('src','./assets/calculator-33.svg');
        },
        mouseleave: function(){
          $("#img3 img").attr('src','./assets/calculator-3.svg');
        }
      });
      $("#img4").on({
        mouseenter: function(){
          $("#img4 img").attr('src','./assets/calculator-44.svg');
        },
        mouseleave: function(){
          $("#img4 img").attr('src','./assets/calculator-4.svg');
        }
      });
      $("#img5").on({
        mouseenter: function(){
          $("#img5 img").attr('src','./assets/calculator-55.svg');
        },
        mouseleave: function(){
          $("#img5 img").attr('src','./assets/calculator-5.svg');
        }
      });
      $("#img6").on({
        mouseenter: function(){
          $("#img6 img").attr('src','./assets/calculator-66.svg');
        },
        mouseleave: function(){
          $("#img6 img").attr('src','./assets/calculator-6.svg');
        }
      });
      $("#img7").on({
        mouseenter: function(){
          $("#img7 img").attr('src','./assets/calculator-77.svg');
        },
        mouseleave: function(){
          $("#img7 img").attr('src','./assets/calculator-7.svg');
        }
      });
    });
  }
  next (step){
    switch (step){
        case 1:
          localStorage.setItem('CalculatorType', '1');
          localStorage.setItem('CalculatorText', '1');
          this.router.navigate(['/step1']);
          break;
        case 2:
          localStorage.setItem('CalculatorType', '2');
          localStorage.setItem('CalculatorText', '2');
          this.router.navigate(['/capital-growth-calculator/step1']);
          break;
        case 3:
          localStorage.setItem('CalculatorType', '3');
          localStorage.setItem('CalculatorText', '3');
          this.router.navigate(['/estimated-weekly-rent-calculator/step1']);
          break;
        case 4:
          localStorage.setItem('CalculatorType', '4');
          localStorage.setItem('CalculatorText', '4');
          if (!localStorage.getItem('calcData') || !JSON.parse(localStorage.getItem('calcData')).City) {
            const d: any = { City: 'United Kingdom', lat: 51.6112486, long: -0.2806403, Country: 'england', reportSavedOnServer: false };
            localStorage.setItem('calcData', JSON.stringify(d));
          }
          this.router.navigate(['/Predictive-Foreign-calculator/question']);
          break;
        case 5:
          localStorage.setItem('CalculatorType', '5');
          localStorage.setItem('CalculatorText', '5');
          if (!localStorage.getItem('calcData') || !JSON.parse(localStorage.getItem('calcData')).City) {
            const d: any = { City: 'United Kingdom', lat: 51.6112486, long: -0.2806403, Country: 'england', reportSavedOnServer: false };
            localStorage.setItem('calcData', JSON.stringify(d));
          }
          this.router.navigate(['/stamp-duty-calculator/question']);
          break;
        case 6:
          localStorage.setItem('CalculatorType', '6');
          localStorage.setItem('CalculatorText', '6');
          this.router.navigate(['/cashflow/step1']);
          break;
        case 7:
          localStorage.setItem('CalculatorType', '7');
          localStorage.setItem('CalculatorText', '7');
          this.router.navigate(['/ated/step1']);
          break;
    }
  }
}
