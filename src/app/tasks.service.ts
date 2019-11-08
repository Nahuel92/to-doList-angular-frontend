import {Injectable} from '@angular/core';
import {TodoItem} from './entities/TodoItem';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NewTodoItem} from './entities/NewTodoItem';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private apiURL = 'http://localhost:8080/v1/todo-list/items';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient) {
    }

    deleteAll() {
        return this.httpClient.delete(this.apiURL);
    }

    deleteTodoItem(deletedTask: TodoItem) {
        return this.httpClient.delete(`${this.apiURL}/${deletedTask.id}`);
    }

    getAllTodoItems(): Observable<TodoItem[]> {
        return this.httpClient.get<TodoItem[]>(this.apiURL, {responseType: 'json'});
    }

    postTodoItem(newTask: NewTodoItem) {
        return this.httpClient.post(this.apiURL, newTask, this.httpOptions);
    }

    updateTodoItem(updatedTask: TodoItem) {
        return this.httpClient.patch(this.apiURL, updatedTask, this.httpOptions);
    }
}
