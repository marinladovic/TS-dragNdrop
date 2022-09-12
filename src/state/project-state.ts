import { Project, ProjectStatus } from "../models/project.js";

/**
 * Define a custom function type for the listener
 * @param items - array of projects
 */
type Listener<T> = (items: T[]) => void;

class State<T> {
  /** 5 */
  protected listeners: Listener<T>[] = [];
  /** 6 */
  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

export class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );
    this.projects.push(newProject);
    for (const listenerFn of this.listeners) {
      listenerFn(this.projects.slice());
    }
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      for (const listenerFn of this.listeners) {
        listenerFn(this.projects.slice());
      }
    }
  }
}

/** Global variable to store the state of the project */
export const projectState = ProjectState.getInstance();
