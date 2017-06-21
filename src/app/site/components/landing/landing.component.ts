import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'jp-landing',
  templateUrl: 'landing.component.html'
})

export class LandingComponent {
    public documentId;

  constructor(private router: Router) {
  }

  public openDocument(_id: string) {
    if (_id) {
      // [$&+,:;=?@#|'<>.-^*()%!]" -> regexp special chars
      // remove all special chars of URIs and regexp
      /*
        Test:
        var s = "A[B$C&D+E,F:G;H=I?J@K#L|M'N<O>P.Q-R^S*U(V)W%X!Y]Z\"A";
        var pattern = /[\:/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\"\|\<\>\-\^\%\.]/g
        s.replace(pattern, s) == "ABCDEFGHIJKLMNOPQRSUVWXYZA"
      */

      let pattern = /[\:/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\"\|\<\>\-\^\%\.]/g;
      _id = _id.replace(pattern, '');
      _id = _id.split(' ').join('-').substr(0, 64).toLowerCase();
      let link = ['edit', _id];
      this.router.navigate(link);
    }
  }

}
