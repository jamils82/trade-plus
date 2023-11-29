import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
    providedIn: 'root'
})
export class inputStateService {
    public statusControl: boolean = false;
    // stateUpdated$: BehaviorSubject<boolean>;
    // constructor() {
    //     this.stateUpdated$  = new BehaviorSubject(false);
    //  }
    readonly _stateUpdated = new BehaviorSubject<boolean>(false);
    // private readonly _stateUpdate = new BehaviorSubject<{state: boolean,  isNavigate: boolean}>({
    //     state : false,
    //     isNavigate : false
    // });
    readonly stateUpdated$ = this._stateUpdated.asObservable();
    
    public setUpdatedState(updatedValue){
        this.statusControl = updatedValue;
        this._stateUpdated.next(updatedValue);
    }
    
    public clearState(){
        this._stateUpdated.unsubscribe();
    }

    public getCurrentState(){
        return this._stateUpdated.getValue();
    }
}
