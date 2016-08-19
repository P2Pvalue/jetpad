import { RouterConfig } from '@angular/router';
import { LandingComponent } from './landing';
import { UserSpaceComponent } from './user-space';
import { EditorComponent } from './editor';
import { NoContent } from './no-content';

// import { DataResolver } from './app.resolver';

export const routes: RouterConfig = [
  // { path: '',      component: Home },
  // { path: 'home',  component: Home },
  // // make sure you match the component type string to the require in asyncRoutes
  // { path: 'about', component: 'About',
  //   resolve: {
  //     'yourData': DataResolver
  //   }},
  // // async components with children routes must use WebpackAsyncRoute
  // { path: 'detail', component: 'Detail',
  //   canActivate: [ WebpackAsyncRoute ],
  //   children: [
  //     { path: '', component: 'Index' }  // must be included
  //   ]},



  // When your are anonymous
  { path: '', component: LandingComponent },

  { // User Space
    path: 'user',
    component: UserSpaceComponent
  },

  { // Document Editor
    path: 'edit/:id',
    component: EditorComponent
  },

  { path: '**',    component: NoContent },

];

export const asyncRoutes: AsyncRoutes = {
  // we have to use the alternative syntax for es6-promise-loader to grab the routes
  // 'About': require('es6-promise-loader!./about'),
  // 'Detail': require('es6-promise-loader!./+detail'),
  // 'Index': require('es6-promise-loader!./+detail'), // must be exported with detail/index.ts
};


// Optimizations for initial loads
// An array of callbacks to be invoked after bootstrap to prefetch async routes
export const prefetchRouteCallbacks: Array<IdleCallbacks> = [
  // asyncRoutes['About'],
  // asyncRoutes['Detail'],
   // es6-promise-loader returns a function
];


// Es6PromiseLoader and AsyncRoutes interfaces are defined in custom-typings
