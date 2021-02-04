// project type class
enum ProjectStatus {
    Active,
    Finished
}

class Project {
    constructor(public id: string, public title: string, public description: string, public people: number, public status: ProjectStatus){  }
}


// project state management
// type - encode a fn type with 1 word
type Listener <T> = (items: T[]) => void;

class State <T> {
    protected listeners: Listener <T>[] = [];

    addListener(listenerFn: Listener <T>){
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State <Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor(){ super(); }

    static getInstace(){
        if(this.instance){
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addProject(title:string, description: string, numOfPeople: number){
        const newProject = new Project(
            Math.random().toString(), title, description, numOfPeople, ProjectStatus.Active
        );
        this.projects.push(newProject);
        for(const listenerFn of this.listeners){
            listenerFn(this.projects.slice());
        }
    }
}

// to add ProjectState instance to another class method
    // global const; can be used anywhere in the file/project
const projectState = ProjectState.getInstace();

// Validate
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function validate(validatableInput: Validatable){
    let isValid = true;
    // only checking if required is set to true
    if(validatableInput.required){
        // if not 0, stays true
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string'){
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.min != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value >= validatableInput.min;
    }
    if(validatableInput.max != null && typeof validatableInput.value === 'number'){
        isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;
}

// autobind decorator
    // target, methodName, descriptor
function autobind(_1: any, _2: string, descriptor: PropertyDescriptor){
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        get(){
            const boundFn = originalMethod.bind(this);
            return boundFn;
        }
    };
    return adjustedDescriptor;
}

// component base class - render on screen
    // generic class type - when we inherit from it, we can set the concrete types
    // abstract - never directly instantiate; used for inheritance
                            // where to render      element to render
abstract class Component <T extends HTMLElement, U extends HTMLElement> {
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

// project item class
// render single project items
class ProjectItem extends Component <HTMLUListElement, HTMLLIElement> {
    private project: Project;

    get persons(){
        if(this.project.people === 1){
            return '1 person';
        } else{
            return `${this.project.people} people`;
        }
    }

    constructor(hostId: string, project: Project){
        super("single-project", hostId, false, project.id);
        this.project = project;

        this.configure();
        this.renderContent();
    }

    configure(){  }

    renderContent(){
        this.element.querySelector('h2')!.textContent = this.project.title;
        this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.element.querySelector('p')!.textContent = this.project.description;
    }

}

// project list class - renders project list
class ProjectList extends Component <HTMLDivElement, HTMLElement> {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', false, `${type}-projects`);

        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    configure(){
        // listener setup
        projectState.addListener((projects: Project[]) => {
            // added to Active only
            const relevantProjects = projects.filter(prj => {
                if(this.type === 'active'){
                    return prj.status === ProjectStatus.Active;
                }
                return prj.status === ProjectStatus.Finished;
            });
            this.assignedProjects = relevantProjects;
            // added to Active only ^^^
            this.renderProjects();
        });
    }

    // fill blank spaces
    renderContent(){
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private renderProjects(){
        const listEl = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;

        // avoid duplicates
        // when add new project, get rid of all LI's and then rerender all
            // not ideal for bigger projects
        listEl.innerHTML = '';

        for(const prjItem of this.assignedProjects){
            new ProjectItem(this.element.querySelector('ul')!.id, prjItem);
        }
    }

}

// project input class
class ProjectInput extends Component <HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor(){
        super('project-input', 'app', true, 'user-input');

        // get user input values
        // #title = title id
        this.titleInputElement = this.element.querySelector('#title')! as HTMLInputElement;
        this.descriptionInputElement = this.element.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.element.querySelector('#people')! as HTMLInputElement;

        this.configure();
    }

    configure(){                            /* decorator replaces this */
        this.element.addEventListener('submit', this.submitHandler/*.bind(this)*/);
    }

    renderContent(){  }

    // insertions and fine tuning
        // return tuple
    private gatherUserInput(): [string, string, number] | void {
        const enteredTitle = this.titleInputElement.value;
        const enteredDescription = this.descriptionInputElement.value;
        const enteredPeople = this.peopleInputElement.value;

        const titleValidatable: Validatable = {
            value: enteredTitle,
            required: true
        }
        const descriptionValidatable: Validatable = {
            value: enteredDescription,
            required: true
        }
        const peopleValidatable: Validatable = {
            value: +enteredPeople,
            required: true,
            min: 0
        }

        if(
            !validate(titleValidatable) ||
            !validate(descriptionValidatable) ||
            !validate(peopleValidatable)
        ){
            alert('Invalid input, please try again!');
            return;
        } else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }

    private clearInputs(){
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @autobind
    private submitHandler(event: Event){
        event.preventDefault();
        // console.log(this.titleInputElement.value);
        const userInput = this.gatherUserInput();
        if(Array.isArray(userInput)){
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            projectState.addProject(title, desc, people);
            this.clearInputs();
        }
    }

}

const projInp = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');