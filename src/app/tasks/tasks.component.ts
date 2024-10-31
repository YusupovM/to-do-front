import { Component, DestroyRef, OnInit } from '@angular/core';
import { TaskService } from './tasks.service';
import { Task, TaskFilter, TaskStatus } from '../models/task';
import { NzModalService } from 'ng-zorro-antd/modal';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { debounceTime, filter, switchMap } from 'rxjs'
import { NzButtonComponent } from 'ng-zorro-antd/button'
import { NzTableModule, NzTableQueryParams } from 'ng-zorro-antd/table'
import { CreateTaskComponent } from './create-task/create-task.component'
import { NzPopconfirmDirective } from 'ng-zorro-antd/popconfirm'
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select'
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms'
import { TypedForm } from '../models/typed-form'
import { AuthService } from '../auth/auth.service'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  standalone: true,
  imports: [
    NzButtonComponent,
    NzOptionComponent,
    NzPopconfirmDirective,
    NzSelectComponent,
    NzTableModule,
    ReactiveFormsModule,
    DatePipe,
  ],
})
export class TaskListComponent implements OnInit {
  filter: FormGroup<TypedForm<TaskFilter>>
  tasks$ = this.taskService.tasks$
  total: number
  readonly taskStatusEnum = TaskStatus

  constructor(
    private authService: AuthService,
    private destroyRef: DestroyRef,
    private taskService: TaskService,
    private modal: NzModalService,
  ) {
  }

  ngOnInit(): void {
    this.createFilters()
    this.getTasks()
  }

  addTask(): void {
    const modal = this.modal.create({
      nzTitle: 'Add Task',
      nzContent: CreateTaskComponent,
      nzFooter: null,
    });

    modal.afterClose
      .pipe(
        filter(result => !!result),
        switchMap(result => this.taskService.addTask(result)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.total++
      })
  }

  editTask(task: Task): void {
    const modal = this.modal.create({
      nzTitle: 'Edit Task',
      nzContent: CreateTaskComponent,
      nzFooter: null,
      nzData: task,
    });

    modal.afterClose
      .pipe(
        filter(result => !!result),
        switchMap(result => this.taskService.updateTask(result, task.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe()
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.total--
      })
  }

  logout() {
    this.authService.logout()
  }

  onChangePagination(params: NzTableQueryParams) {
    this.filter.patchValue({
      page: params.pageIndex,
      limit: params.pageSize,
    })
  }

  private createFilters() {
    this.filter = new FormGroup<TypedForm<TaskFilter>>({
      status: new FormControl<TaskStatus>(TaskStatus.All),
      page: new FormControl<number>(1),
      limit: new FormControl<number>(10),
    })
  }

  private getTasks(): void {
    this.filter.valueChanges
      .pipe(
        debounceTime(30),
        switchMap(() => this.taskService.getTasks(this.filter.getRawValue())),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(res => {
        this.total = res.total
      })
  }
}
