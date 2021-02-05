import { DragTarget } from '../models/drag-drop.js'
import { Project, ProjectStatus } from '../models/project.js';
import { Component } from './base-component.js';
import { autobind } from '../decorators/autobind.js'
import { projectState } from '../state/project-state.js'
import { ProjectItem } from './project-item.js'

// project list class - renders project list
export class ProjectList extends Component <HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished'){
        super('project-list', 'app', false, `${type}-projects`);

        this.assignedProjects = [];

        this.configure();
        this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
        // check drag area; if there are more than 1 droppable areas, check if it is a match
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault(); // default does not allow dragging/dropping
            // show droppable area
            const listEl = this.element.querySelector('ul')!;
            listEl.classList.add('droppable');
        }

    };
    
    @autobind
    dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
    };
    
    @autobind
    dragLeaveHandler(_: DragEvent) {
        // update styling; background colors revert to white
        const listEl = this.element.querySelector('ul')!;
        listEl.classList.remove('droppable');
    };


    configure(){
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);

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