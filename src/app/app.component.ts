import {Component, OnInit} from '@angular/core';
import {TodoItem} from './entities/TodoItem';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TasksService} from './tasks.service';
import {ToastrService} from 'ngx-toastr';
import {NewTodoItem} from './entities/NewTodoItem';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    toDos: TodoItem[] = [];
    inProgress: TodoItem[] = [];
    done: TodoItem[] = [];
    newTaskDescription = '';
    private taskBeingEditing: TodoItem;

    constructor(private tasksService: TasksService, private toastr: ToastrService) {
    }

    ngOnInit() {
        this.getAllTodoItemsFromServer();
    }

    drop(event: CdkDragDrop<TodoItem[]>): void {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return;
        }

        transferArrayItem(event.previousContainer.data, event.container.data,
            event.previousIndex, event.currentIndex);

        this.changeTaskStatus(event);
    }

    createNewTask(): void {
        const newTask: NewTodoItem = {
            description: this.newTaskDescription
        };
        this.newTaskDescription = '';

        this.tasksService
            .postTodoItem(newTask)
            .subscribe((taskCreated: TodoItem) => this.toDos.push(taskCreated),
                error => this.toastr.error(error.error.errorMessages, 'Error')
            );
    }

    areTasksListsEmpty(): boolean {
        return this.toDos.length < 1 && this.inProgress.length < 1 && this.done.length < 1;
    }

    delete(item: TodoItem, list: TodoItem[]): void {
        this.tasksService.deleteTodoItem(item).subscribe(() => list.splice(list.indexOf(item), 1),
            error => this.toastr.error(error.error.errorMessages, 'Error')
        );
    }

    deleteAll(): void {
        this.tasksService.deleteAll().subscribe(() => this.pruneTasksLists(),
            error => this.toastr.error(error.error.errorMessages, 'Error')
        );
    }

    edit(task: TodoItem): void {
        this.taskBeingEditing = task;
    }

    isEditing(task: TodoItem): boolean {
        return this.taskBeingEditing === task;
    }

    stopEditing(): void {
        this.taskBeingEditing = null;
    }

    update(updatedTask: TodoItem): void {
        this.tasksService.updateTodoItem(updatedTask).subscribe(() => this.stopEditing(),
            error => this.toastr.error(error.error.errorMessages, 'Error')
        );
    }

    private changeTaskStatus(event: CdkDragDrop<TodoItem[]>): void {
        const task = event.container.data[event.currentIndex];

        switch (event.container.id) {
            case 'toDos':
                task.status = 'Created';
                this.tasksService.updateTodoItem(task).subscribe();
                break;
            case 'inProgress':
                task.status = 'In Progress';
                this.tasksService.updateTodoItem(task).subscribe();
                break;
            case 'done':
                task.status = 'Done';
                this.tasksService.updateTodoItem(task).subscribe();
                break;
        }
    }

    descriptionIsInvalid(): boolean {
        return this.newTaskDescription.trim().length < 1;
    }

    private pruneTasksLists(): void {
        this.toDos = [];
        this.inProgress = [];
        this.done = [];
    }

    private getAllTodoItemsFromServer(): void {
        this.tasksService.getAllTodoItems()
            .subscribe(tasksFromServer => this.arrangeTasksByStatus(tasksFromServer),
                error => this.toastr.error(error.error.errorMessages, 'Error')
            );
    }

    private arrangeTasksByStatus(tasksFromServer: TodoItem[]): void {
        this.toDos = tasksFromServer.filter(a => a.status === 'Created');
        this.inProgress = tasksFromServer.filter(a => a.status === 'In Progress');
        this.done = tasksFromServer.filter(a => a.status === 'Done');
    }
}
