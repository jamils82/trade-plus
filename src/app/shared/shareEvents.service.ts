import { Injectable } from "@angular/core";
import { GlobalMessageConfig, GlobalMessageService, GlobalMessageType } from "@spartacus/core";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable()
export class ShareEvents {
    constructor(private globalMessageService: GlobalMessageService,
        private globalConfig: GlobalMessageConfig) { }
    // Share Events Subjects Declraration
    private contactCustomerServiceSubject = new Subject<any>();
    private contactMobileCustomerServiceSubject = new Subject<any>();
    private helpWithProductSubject = new Subject<any>();
    private mobileProductSearchSidePanelSubject = new Subject<any>();
    private mobileHamburgerMenuSubject = new Subject<any>();
    private productMenuSubject = new Subject<any>();
    private addTeamMemberSubject = new Subject<any>();
    private removeTeamMemberSubject = new Subject<any>();
    private accountsInfoAvailableSubject = new Subject<any>();
    private teamMemberSearch = new Subject<any>();
    private teamMemberReset = new Subject<any>();
    public teamMemberSearchVal = '';
    public orderSearchVal = '';
    public mobileSearchVal: string = '';
    public mobileSearchPage: string = '';
    public mobileSearchSubject = new BehaviorSubject<string>(undefined);


    /* ---------------------------Send and Receive Events---------------------------*/

    // Send and Receive Events---------Contact Customer Service Popup Subject
    contactCustomerServicePopupSendEvent() {
        this.contactCustomerServiceSubject.next();
    }
    contactCustomerServicePopupReceiveEvent() {
        return this.contactCustomerServiceSubject.asObservable();
    }

    // Send and Receive Events--------- Mobile Contact Customer Service Popup Subject
    contactCustomerServicePopupMobileSendEvent() {
        this.contactMobileCustomerServiceSubject.next();
    }
    contactCustomerServicePopupMobileReceiveEvent() {
        return this.contactMobileCustomerServiceSubject.asObservable();
    }

    // Send and Receive Events--------- Mobile Contact Customer Service Popup Subject
    helpWithProductSubjectSendEvent() {
        this.helpWithProductSubject.next();
    }
    helpWithProductSubjectReceiveEvent() {
        return this.helpWithProductSubject.asObservable();
    }

    productMenuSubjectSendEvent() {
        this.productMenuSubject.next();
    }
    productMenuSubjectReceiveEvent() {
        return this.productMenuSubject.asObservable();
    }

    //mobileProductSearchSidePanelSubject Send and Receive Event
    mobileProductSearchSidePanelSubjectSentEvent() {
        this.mobileProductSearchSidePanelSubject.next();
    }

    mobileProductSearchSidePanelSubjectReceiveEvent() {
        return this.mobileProductSearchSidePanelSubject.asObservable();
    }

    // mobileHamburgerMenuSubject Send and Receive Event
    mobileHamburgerMenuSubjectSendEvent() {
        this.mobileHamburgerMenuSubject.next();
    }
    mobileHamburgerMenuSubjectReceiveEvent() {
        return this.mobileHamburgerMenuSubject.asObservable();
    }


    // mobileHamburgerMenuSubject Send and Receive Event
    addTeamMemberSubjectSendEvent() {
        this.addTeamMemberSubject.next();
    }
    addTeamMemberSubjectReceiveEvent() {
        return this.addTeamMemberSubject.asObservable();
    }

    // removeTeamMemberSubject Send and Receive Event
    removeTeamMemberSubjectSendEvent() {
        this.removeTeamMemberSubject.next();
    }
    removeTeamMemberSubjectReceiveEvent() {
        return this.removeTeamMemberSubject.asObservable();
    }

    // removeTeamMemberSubject Send and Receive Event
    accountsInfoAvailableSubjectSendEvent() {
        this.accountsInfoAvailableSubject.next();
    }
    accountsInfoAvailableSubjectReceiveEvent() {
        return this.accountsInfoAvailableSubject.asObservable();
    }

    // Mobile teamMember Search Send and Receive Event
    mobileTeamMemberSearchSendEvent(e) {
        this.teamMemberSearch.next(e);
    }
    mobileTeamMemberSearchReceiveEvent() {
        return this.teamMemberSearch.asObservable();
    }

    // Mobile teamMember Reset Send and Receive Event
    mobileTeamMemberResetSendEvent() {
        this.teamMemberReset.next();
    }
    mobileTeamMemberResetReceiveEvent() {
        return this.teamMemberReset.asObservable();
    }

     // globalMessgae notification
     notificationInfo(message) {
        this.globalConfig.globalMessages['[GlobalMessage] Information'].timeout = 3000;
        this.globalMessageService.add(
            message,
            GlobalMessageType.MSG_TYPE_INFO
        );
    }

    // globalMessgae warning
    warningInfo(message) {
        this.globalMessageService.add(
            message,
            GlobalMessageType.MSG_TYPE_WARNING,
            3000
        );
    }

    //Clear globalMessages
    clearMessage(type) {
        this.globalMessageService.remove(type);
    }

}
