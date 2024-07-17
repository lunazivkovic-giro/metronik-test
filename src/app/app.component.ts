import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentRoute: string | undefined;

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
  }


}

/*this.router.events.subscribe(event => { ... }): Subscribes to router events to listen for navigation changes.
if (event instanceof NavigationEnd): Checks if the event is a NavigationEnd event, which signals that the router has successfully completed a navigation.
this.currentRoute = event.url: Updates the currentRoute property with the current URL.*/