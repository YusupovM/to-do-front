import { Component, DestroyRef, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { LoginForm } from '../../models/login-form'
import { TypedForm } from '../../models/typed-form'
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form'
import { NzInputDirective, NzInputGroupComponent } from 'ng-zorro-antd/input'
import { NzColDirective } from 'ng-zorro-antd/grid'
import { NzButtonComponent } from 'ng-zorro-antd/button'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzColDirective,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzInputDirective,
    NzInputGroupComponent,
    ReactiveFormsModule,
  ],
})
export class LoginComponent implements OnInit {
  form: FormGroup<TypedForm<LoginForm>>

  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.createForm()
  }

  login() {
    Object.values(this.form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({onlySelf: true});
      }
    })

    if (this.form.invalid) return

    this.authService.login(this.form.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/'])
      })
  }

  private createForm() {
    this.form = new FormGroup<TypedForm<LoginForm>>({
      password: new FormControl<string>('', Validators.required),
      username: new FormControl<string>('', Validators.required),
    })
  }
}
