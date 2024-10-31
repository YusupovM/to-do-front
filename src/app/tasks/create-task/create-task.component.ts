import { Component, inject, OnInit } from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { Task, TaskStatus } from '../../models/task';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { TypedForm } from '../../models/typed-form'
import { NzInputDirective } from 'ng-zorro-antd/input'
import { NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form'
import { NzColDirective, NzRowDirective } from 'ng-zorro-antd/grid'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select'

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzInputDirective,
    NzFormDirective,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzRowDirective,
    NzButtonComponent,
    NzColDirective,
    NzSelectComponent,
    NzOptionComponent,
  ],
})
export class CreateTaskComponent implements OnInit {
  form: FormGroup<Partial<TypedForm<Task>>> = this.createForm()
  task: Task = inject(NZ_MODAL_DATA)
  readonly taskStatusEnum = TaskStatus

  constructor(
    private modalRef: NzModalRef,
  ) {
  }

  ngOnInit(): void {
    if (this.task) {
      this.form.patchValue(this.task)
    }
  }

  submit(): void {
    Object.values(this.form.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({onlySelf: true});
      }
    })

    if (this.form.invalid) return

    this.modalRef.close(this.form.getRawValue())
  }

  private createForm() {
    return new FormGroup<Partial<TypedForm<Task>>>({
      title: new FormControl(null, Validators.required),
      description: new FormControl(null),
      status: new FormControl(TaskStatus.Incomplete, Validators.required),
    })
  }
}
