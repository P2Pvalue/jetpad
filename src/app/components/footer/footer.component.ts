import {Component} from "@angular/core";

@Component({
  selector: 'app-footer',
  template: `
        <footer>
            <div class="row">
            <nav class="navbar navbar-default">
                <div class="col-md-3 text-center footer">
                  <h5>Powered by</h5>
                  <a href="http://swellrt.org/">
                    <img height="100" class="center-block" src="assets/img/swellrt_logo.png" alt="">
                  </a>
                </div>
                <div class="col-md-3 text-center footer">
                  <h5>Get the code</h5>
                  <a href="https://github.com/P2Pvalue">
                    <img height="80" class="center-block" src="assets/img/github_logo.png" alt="">
                  </a>
                </div>
                <div class="col-md-3 text-center footer">
                  <h5>Contact with us</h5>
                  <h5>info@jetpad.com</h5>
                </div>
                <div class="col-md-2 col-md-offset-1 footer">
                  <h5>Home</h5>     
                  <h5>Login</h5>
                  <h5>Register</h5>                
                  <h5>Terms and conditions</h5>                    
                </div>
            </nav>
          </div>
        </footer>
        `
})

export class FooterComponent {

  constructor() {
  }

}
