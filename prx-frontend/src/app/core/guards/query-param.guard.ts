import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export function requireQueryParamsGuard(
  paramNames: string | string[],
  redirectTo = '/',
): CanActivateFn {
  return (route: ActivatedRouteSnapshot) => {
    const router = inject(Router);

    const params = Array.isArray(paramNames) ? paramNames : [paramNames];

    for (const param of params) {
      const value = route.queryParamMap.get(param);

      if (!value) {
        return router.createUrlTree([redirectTo]);
      }
    }

    return true;
  };
}
