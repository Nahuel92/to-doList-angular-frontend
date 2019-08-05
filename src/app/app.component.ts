import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TodoItem} from './entities/TodoItem';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

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
    private apiURL = 'http://localhost:8080/todo-list/items';
    private tasksFromServer: TodoItem[] = [];

    constructor(private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.getAllTodoItemsFromServer();
    }

    drop(event: CdkDragDrop<TodoItem[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
            return;
        }

        transferArrayItem(event.previousContainer.data, event.container.data,
            event.previousIndex, event.currentIndex);

        this.changeTaskStatus(event);
    }

    createNewTask() {
        const newTask: TodoItem = {
            id: null, description: this.newTaskDescription,
            status: 'Pending', createdDatetime: null
        };
        this.toDos.push(newTask);
    }

    descriptionIsInvalid(): boolean {
        return this.newTaskDescription.trim().length < 1;
    }

    delete(item: TodoItem, list: TodoItem[]) {
        const itemIndex = list.indexOf(item);
        list.splice(itemIndex, 1);
    }

    private getAllTodoItemsFromServer() {
        this.httpClient
            .get<TodoItem[]>(this.apiURL, {responseType: 'json'})
            .subscribe(apiData => {
                this.tasksFromServer = apiData;
                this.arrangeTasksByStatus();
            });
    }

    private arrangeTasksByStatus() {
        this.toDos = this.tasksFromServer.filter(a => a.status === 'Pending');
        this.inProgress = this.tasksFromServer.filter(a => a.status === 'In Progress');
        this.done = this.tasksFromServer.filter(a => a.status === 'Done');
    }

    private changeTaskStatus(event: CdkDragDrop<TodoItem[]>) {
        const task = event.container.data[event.currentIndex];

        switch (event.container.id) {
            case 'toDos':
                task.status = 'Pending';
                break;
            case 'inProgress':
                task.status = 'In Progress';
                break;
            case 'done':
                task.status = 'Done';
                break;
        }
    }

    edit() {
        this.notEditing = !this.notEditing;
    }
}
