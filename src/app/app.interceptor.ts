import { inject } from '@angular/core'
import { HttpErrorResponse, HttpEvent, HttpHeaders, HttpInterceptorFn } from '@angular/common/http'
import { catchError, throwError } from 'rxjs'
import { AuthService } from './auth/auth.service'
import { AUTH_TOKEN } from './auth/auth.service'
import { NzMessageService } from 'ng-zorro-antd/message'

const API_URL = 'http://localhost:3000/api/v1'

export const appInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService)
  const token = localStorage.getItem(AUTH_TOKEN)
  const message = inject(NzMessageService)
  let headers = new HttpHeaders()

  headers = headers.append('Accept', 'application/json')
  headers = headers.append('Content-Type', 'application/json')

  if (token) {
    headers = headers.append('Authorization', `Bearer ${token}`)
  }

  const resolvedReq = request.clone({
    headers,
    url: API_URL + request.url,
  })

  return next(resolvedReq)
    .pipe(
      catchError((error: HttpEvent<any>) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            authService.logout()
          }

          if (error.error.message) {
            message.error(error.error.message)
          }
        }

        return throwError(() => error)
      }),
    )
}
