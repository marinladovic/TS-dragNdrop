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
 * ProjectList Class
 */
class ProjectList {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  sectionEl: HTMLElement;

  constructor(private type: "active" | "finished") {
    this.templateEl = document.querySelector(
      ".project-list"
    )! as HTMLTemplateElement;
    this.hostEl = document.querySelector("#app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.sectionEl = importedNode.firstElementChild as HTMLElement;
    this.sectionEl.id = `${this.type}-projects`;

    this.attach();
    this.renderContent();
  }

  private renderContent() {
    const listId = `${this.type}-projects-list`;
    this.sectionEl.querySelector("ul")!.id = listId;
    this.sectionEl.querySelector("h2")!.textContent =
      this.type.toUpperCase() + " PROJECTS";
  }

  private attach() {
    this.hostEl.insertAdjacentElement("beforeend", this.sectionEl);
  }
}

/**
 * ProjectInput Class
 */
class ProjectInput {
  templateEl: HTMLTemplateElement;
  hostEl: HTMLDivElement;
  formEl: HTMLFormElement;
  titleInputEl: HTMLInputElement;
  descriptionInputEl: HTMLInputElement;
  peopleInputEl: HTMLInputElement;

  constructor() {
    this.templateEl = document.querySelector(
      "#project-input"
    )! as HTMLTemplateElement;
    this.hostEl = document.querySelector("#app")! as HTMLDivElement;

    const importedNode = document.importNode(this.templateEl.content, true);
    this.formEl = importedNode.firstElementChild as HTMLFormElement;
    this.formEl.id = "user-input";

    /**
     * get access to the form elements
     */
    this.titleInputEl = this.formEl.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputEl = this.formEl.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.peopleInputEl = this.formEl.querySelector(
      "#people"
    )! as HTMLInputElement;

    this.configure();
    this.attach();
  }

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
      console.log(title, desc, people);
      this.clearInputs();
    }
  }

  private configure() {
    this.formEl.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
  }
}

const inputForm = new ProjectInput();
const ActiveProjectList = new ProjectList("active");
const FinishedProjectList = new ProjectList("finished");
