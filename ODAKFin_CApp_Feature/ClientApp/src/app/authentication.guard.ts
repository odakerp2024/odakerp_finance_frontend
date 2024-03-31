import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthguardServiceService } from './authguard-service.service';
import { RouterModule } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {
    constructor(private Authguardservice: AuthguardServiceService, private router: Router) { }
    canActivate(): boolean {
        if (!this.Authguardservice.gettoken()) {
          debugger
          this.router.navigate(['/views/finance/financemaster',{tabName : 'transactions'}],);
        }
    //next: ActivatedRouteSnapshot,
    //state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
  
}
