import { autobind } from "../decorators/autobind";
import { projectState } from "../state/project-state";
import { Validatable, validate } from "../util/validation";
import { Component } from "./base-component";

/**
 * ProjectInput Class
 */

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
