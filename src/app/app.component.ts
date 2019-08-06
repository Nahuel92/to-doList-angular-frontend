import {Component, OnInit} from '@angular/core';
import {TodoItem} from './entities/TodoItem';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TasksService} from './tasks.service';

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
    notEditing = true;

    constructor(private tasksService: TasksService) {
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
        const newTask: TodoItem = {
            id: 1900, description: this.newTaskDescription,
            status: 'Pending', createdDatetime: null
        };

        this.toDos.push(newTask);

        this.tasksService
            .postTodoItem(newTask)
            .subscribe(() => {
                },
                error => console.log(error));
    }

    delete(item: TodoItem, list: TodoItem[]): void {
        this.tasksService.deleteTodoItem(item).subscribe(() => {
        }, error => console.log(error));

        const itemIndex = list.indexOf(item);
        list.splice(itemIndex, 1);
    }

    edit(): void {
        this.notEditing = !this.notEditing;
    }

    descriptionIsInvalid(): boolean {
        return this.newTaskDescription.trim().length < 1;
    }

    update(updatedTask: TodoItem) {
        this.tasksService.updateTodoItem(updatedTask).subscribe(() => {
            },
            error => console.log(error)
        );
        this.edit();
    }

    private getAllTodoItemsFromServer(): void {
        this.tasksService.getAllTodoItemsFromServer()
            .subscribe(tasksFromServer => {
                    this.arrangeTasksByStatus(tasksFromServer);
                },
                error => console.log(error)
            );
    }

    private arrangeTasksByStatus(tasksFromServer: TodoItem[]): void {
        this.toDos = tasksFromServer.filter(a => a.status === 'Pending');
        this.inProgress = tasksFromServer.filter(a => a.status === 'In Progress');
        this.done = tasksFromServer.filter(a => a.status === 'Done');
    }

    private changeTaskStatus(event: CdkDragDrop<TodoItem[]>): void {
        const task = event.container.data[event.currentIndex];

        switch (event.container.id) {
            case 'toDos':
                task.status = 'Pending';
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
}
