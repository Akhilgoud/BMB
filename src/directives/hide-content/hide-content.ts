import { Directive, Input, ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the HideContentDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[hide-content]', // Attribute selector
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideContentDirective {

  @Input("passHideContentToHide") passHideContentToHide: HTMLElement;
  bandHight;
  scrollContent;
  constructor(public element: ElementRef, public renderer: Renderer) {
    console.log('Hello HideContentDirective Directive being initialized');
  }

  ngOnInit(){
    this.bandHight = this.passHideContentToHide.clientHeight;
    this.renderer.setElementStyle(this.passHideContentToHide, 'webkitTransition', 'top 800ms');
    this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 800ms');
  }

onContentScroll(event){
  if(event.scrollTop > 36){
    this.renderer.setElementStyle(this.passHideContentToHide, 'top', '-36px');
    this.renderer.setElementStyle(this.scrollContent, 'margin-top', '0px');
  } else {
    this.renderer.setElementStyle(this.passHideContentToHide, 'top', '0px');
    this.renderer.setElementStyle(this.scrollContent, 'margin-top', '36px');
  }
}
}
