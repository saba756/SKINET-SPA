import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from './../../account/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private accountService: AccountService, 
              private router: Router )
              {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean >{
    return this.accountService.currentUser$.pipe(
      map( auth => {
        if(auth){
          return true;
        }
        this.router.navigate(['account/login'] , {queryParams : {returnUrl : state.url}});
      })
    );
    }
}
