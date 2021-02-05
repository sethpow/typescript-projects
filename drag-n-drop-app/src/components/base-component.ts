// component base class - render on screen
    // generic class type - when we inherit from it, we can set the concrete types
    // abstract - never directly instantiate; used for inheritance
// where to render      element to render
export abstract class Component <T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    element: U;
    
    constructor(templateId: string, hostElementId: string, insertAtStart: boolean, newElementId?: string){
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.hostElement = document.getElementById(hostElementId)! as T;

        const importedNode = document.importNode(
            this.templateElement.content, true
        );
        this.element = importedNode.firstElementChild as U;

        if(newElementId){
            this.element.id = newElementId;
        }
        this.attach(insertAtStart);
    }

    private attach(insertAtBeginning: boolean){
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : "beforeend", this.element);
    }

    // any class inheriting Component must add these 2 methods
    abstract configure(): void;
    abstract renderContent(): void;
    
}