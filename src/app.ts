/**
 * Drag & Drop Interfaces
 */
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

/**
 * PROJECT CLASS - definition of a project
 * @param id - project id
 * @param title - project title
 * @param description - project description
 * @param people - number of people working on the project
 * @param status - project status (active | finished)
 *
 *
 */

enum ProjectStatus {
  Active, // 0
  Finished, // 1
}
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

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
class ProjectState extends State<Project> {
  /** 4 */
  private projects: Project[] = [];
  /** 2 */
  private static instance: ProjectState;

  /** 1 */
  private constructor() {
    super();
  }

  /** 3 */
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  /** 7 */
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
const projectState = ProjectState.getInstance();

/**
 * VALIDATION
 * 1. Define the structure of the object that is able to be validated (Validatable)
 * 2. Define a function that takes an object and returns a boolean (validate)
 */
interface Validatable {
  /* 1. */
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(input: Validatable) {
  /* 2. */
  let isValid = true;

  /* If the input is required, check if there is an input */
  if (input.required) {
    isValid = isValid && input.value.toString().trim().length !== 0;
  }

  /* If the input has a minimum length, check if the input is long enough */
  if (input.minLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length >= input.minLength;
  }

  /* If the input has a maximum length, check if the input is short enough */
  if (input.maxLength != null && typeof input.value === "string") {
    isValid = isValid && input.value.length <= input.maxLength;
  }

  /* If the input has a minimum value, check if the input is big enough */
  if (input.min != null && typeof input.value === "number") {
    isValid = isValid && input.value >= input.min;
  }

  /* If the input has a maximum value, check if the input is small enough */
  if (input.max != null && typeof input.value === "number") {
    isValid = isValid && input.value <= input.max;
  }

  return isValid;
}

/**
 * DECORATORS
 * AUTOBIND DECORATOR - BINDS METHODS TO THE CLASS INSTANCE
 */
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };
  return adjustedDescriptor;
}

/**
 * COMPONENT BASE CLASS - abstract class that defines the structure of a component
 * @param templateId - id of the template
 * @param hostElementId - id of the host element
 * @param insertAtStart - boolean to determine if the element should be inserted at the start or end of the host element
 * @param newElementId - (optional) id of the new element
 *
 */

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateEl: HTMLTemplateElement;
  hostEl: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateEl = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostEl = document.getElementById(hostElementId)! as T;

    /** 2 */
    const importedNode = document.importNode(this.templateEl.content, true);
    this.element = importedNode.firstElementChild as U;
    /** 3 */
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  /** 4 */
  private attach(insertAtBeginning: boolean) {
    this.hostEl.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }

  abstract configure(): void;
  abstract renderContent(): void;
}

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  private project: Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people} persons`;
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.persons + " assigned";
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    /** 5 */
    this.configure();

    /** 5 */
    this.renderContent();
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const projectId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      projectId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure(): void {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      /** Returns the elements of an array that meet the condition specified in a callback function. */
      const relevantProjects = projects.filter((project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  /** 5 */
  renderContent() {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  /** 6 */
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    /** Clear the list of projects and then re-render them */
    listEl.innerHTML = "";
    for (const projectItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
    }
  }
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

    this.titleInputEl = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputEl = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputEl = this.element.querySelector(
      "#people"
    )! as HTMLInputElement;

    /** 5 */
    this.configure();
  }
  /** 5 */
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent(): void {}

  /** 6 */
  private fetchUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputEl.value;
    const enteredDescription = this.descriptionInputEl.value;
    const enteredPeople = this.peopleInputEl.value;

    const validatableTitle: Validatable = {
      value: enteredTitle,
      required: true,
    };

    const validatableDescription: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const validatablePeople: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1,
      max: 10,
    };

    if (
      !validate(validatableTitle) ||
      !validate(validatableDescription) ||
      !validate(validatablePeople)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  /** 8 */
  private clearInputs() {
    this.titleInputEl.value = "";
    this.descriptionInputEl.value = "";
    this.peopleInputEl.value = "";
  }

  @autobind
  private submitHandler(e: Event) {
    e.preventDefault();
    const userInput = this.fetchUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      /** 7 */
      projectState.addProject(title, desc, people);
      /** 8 */
      this.clearInputs();
    }
  }
}

const inputForm = new ProjectInput();
const ActiveProjectList = new ProjectList("active");
const FinishedProjectList = new ProjectList("finished");
