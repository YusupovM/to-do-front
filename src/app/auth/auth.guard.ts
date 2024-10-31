import { CanActivateFn, Router } from '@angular/router'
import { inject } from '@angular/core'
import { AuthService } from './auth.service'

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService),
    router = inject(Router),
    isLoggedIn = authService.isLoggedIn

  if (!isLoggedIn) {
    router.navigate(['/login'])
  }

  return isLoggedIn
}
