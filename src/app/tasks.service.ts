import {Injectable} from '@angular/core';
import {TodoItem} from './entities/TodoItem';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TasksService {
    private apiGetURL = 'http://localhost:8080/todo-list/items';
    private apiURL = 'http://localhost:8080/todo-list/item';
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private httpClient: HttpClient) {
    }

    deleteTodoItem(deletedTask: TodoItem) {
        const deleteURL = `${this.apiURL}/${deletedTask.id}`;
        return this.httpClient.delete(deleteURL);
    }

    getAllTodoItemsFromServer(): Observable<TodoItem[]> {
        return this.httpClient
            .get<TodoItem[]>(this.apiGetURL, {responseType: 'json'});
    }

    postTodoItem(newTask: TodoItem) {
        return this.httpClient.post(this.apiURL, newTask, this.httpOptions);
    }

    updateTodoItem(updatedTask: TodoItem) {
        return this.httpClient.patch(this.apiURL, updatedTask, this.httpOptions);
    }
}
