import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
 
@Injectable({
    providedIn: 'root'
})
export class saveByNavigationService {
    private readonly _saveByNavigation = new BehaviorSubject<boolean>(false);
    readonly stateUpdated$ = this._saveByNavigation.asObservable();
    
    public saveByNavigation(updatedValue){
        this._saveByNavigation.next(updatedValue);
    }
    
    public clearState(){
        this._saveByNavigation.unsubscribe();
    }

    public getCurrentState(){
        return this._saveByNavigation.getValue();
    }
}
