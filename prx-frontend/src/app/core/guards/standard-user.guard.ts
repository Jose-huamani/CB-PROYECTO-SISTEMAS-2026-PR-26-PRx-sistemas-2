import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthFacade } from '@features/auth/application/facades/auth.facade';
import { Role } from '@shared/enums/role.enum';

export const standardUserGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  return authFacade.currentUser()?.role === Role.estandar ? true : router.createUrlTree(['/']);
};
