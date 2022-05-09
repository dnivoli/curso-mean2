import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY';
  public user : User;
  public user_register : User;
  public identity : any;
  public token: any;
  public errorMenssage: any;
  public alertRegister: any;
  
  constructor(
      private _userService:UserService
  ){
    this.user = new User('','','','','','ROLE_USER','');
    this.user_register = new User('','','','','','ROLE_USER','');
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear(); 
    this.identity = null;
    this.token = null;

    this.user = new User('','','','','','ROLE_USER','');
  }

  public onSubmit(){
    this._userService.singup(this.user).subscribe(
    response => {
      let identity = response; //response.user
      this.identity = identity;
      
      if(!this.identity.user._id){
        alert('El usuario no esta correctamente identificado');
      }else{
        localStorage.setItem('identity', JSON.stringify(identity));

        let hash = true;

        this._userService.singup(this.user, hash).subscribe(
        response => {
          let token = response; 
          this.token = token;

          if(this.token.length <= 0){
            alert('El token no se ha generado');
          }else{
            localStorage.setItem('token', this.token);
          }
        },
        error => {
          var errorMenssage = <any>error;
            
          if(errorMenssage != null){
            var body = error.error;
            this.errorMenssage = body.message;
          }
        });
      }
    },
    error => {
      var errorMenssage = <any>error;

      if(errorMenssage != null){
        var body = error.error;
        this.errorMenssage = body.message;
      }
    } 
  );
  }

  onSubmitRegister(){
    this._userService.register(this.user_register).subscribe(
      (response:any) => {
        let user:User = response.user;
        this.user_register = user;
     
        console.log(this.user_register);
     
        if(!this.user_register._id){
          this.alertRegister = 'Error al registrarse';
        }else{
          this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+ this.user_register.email;

          this.user_register = new User('','','','','','ROLE_USER','');
        }
      },
      error => {
        var errorMenssage = <any>error;

        if(errorMenssage != null){
          var body = error.error;
          this.alertRegister = body.message;
        }
      } 
    );  
  }

}

