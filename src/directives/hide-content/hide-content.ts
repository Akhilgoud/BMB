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

  @Input("passContentToHide") passContentToHide: HTMLElement;
  bandHight;
  scrollContent;
  constructor(public element: ElementRef, public renderer: Renderer) { }

  ngOnInit() {
    this.bandHight = this.passContentToHide.clientHeight;
    this.renderer.setElementStyle(this.passContentToHide, 'webkitTransition', 'top 400ms');
    this.scrollContent = this.element.nativeElement.getElementsByClassName('scroll-content')[0];
    this.renderer.setElementStyle(this.scrollContent, 'webkitTransition', 'margin-top 400ms');
  }

  onContentScroll(event) {
    if (event.scrollTop > 36 && event.directionY == "down") {
      this.renderer.setElementStyle(this.passContentToHide, 'top', '-36px');
      this.renderer.setElementStyle(this.scrollContent, 'margin-top', '0px');
    } else {
      this.renderer.setElementStyle(this.passContentToHide, 'top', '0px');
      this.renderer.setElementStyle(this.scrollContent, 'margin-top', '36px');
    }
  }
}
