import { Injectable } from "@angular/core";
import { ShareEvents } from "src/app/shared/shareEvents.service";

@Injectable()
export class PermissionService {

    constructor(private shareEvents: ShareEvents) { }
    private userPermissions: string[] = [];

    setUserPermissions(permissions: string[]) {
        this.userPermissions = permissions;
        this.shareEvents.accountsInfoAvailableSubjectSendEvent();
    }

    isPermissionAllowed(permission) {
        // If User User, Provide All Permissions
        return (this.userPermissions?.indexOf("fbAccountOwnerAdminGroup") > -1) || ((this.userPermissions?.indexOf(permission) > -1));
    }

}