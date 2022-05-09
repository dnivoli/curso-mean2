import { Component, OnInit } from "@angular/core";
import { UserService } from "../services/user.service";
import { User } from "../models/user";

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit{
    public titulo: string;
    public user: User;
    public identity: any;

    constructor(
        private _userService: UserService;
    ){
        
    }
   
    ngOnInit(): void {
        console.log('user-edit.component.ts cargado');
    }
}