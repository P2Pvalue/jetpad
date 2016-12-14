import {Component} from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: 'jp-landing',
  templateUrl: './_landing.component.html'
})

export class _LandingComponent {
  constructor(private router: Router) {
  }

  openDocument(_id: string) {
    if (_id) {
      _id = _id.split(" ").join("-").substr(0, 64);
      let link = ['edit', _id];
      this.router.navigate(link);
    }
  }

}
