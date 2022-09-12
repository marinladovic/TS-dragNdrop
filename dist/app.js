"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function validate(input) {
    let isValid = true;
    if (input.required) {
        isValid = isValid && input.value.toString().trim().length !== 0;
    }
    if (input.minLength != null && typeof input.value === "string") {
        isValid = isValid && input.value.length >= input.minLength;
    }
    if (input.maxLength != null && typeof input.value === "string") {
        isValid = isValid && input.value.length <= input.maxLength;
    }
    if (input.min != null && typeof input.value === "number") {
        isValid = isValid && input.value >= input.min;
    }
    if (input.max != null && typeof input.value === "number") {
        isValid = isValid && input.value <= input.max;
    }
    return isValid;
}
function autobind(_, _2, descriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction;
        },
    };
    return adjustedDescriptor;
}
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateEl = document.querySelector(".project-list");
        this.hostEl = document.querySelector("#app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.sectionEl = importedNode.firstElementChild;
        this.sectionEl.id = `${this.type}-projects`;
        this.attach();
        this.renderContent();
    }
    renderContent() {
        const listId = `${this.type}-projects-list`;
        this.sectionEl.querySelector("ul").id = listId;
        this.sectionEl.querySelector("h2").textContent =
            this.type.toUpperCase() + " PROJECTS";
    }
    attach() {
        this.hostEl.insertAdjacentElement("beforeend", this.sectionEl);
    }
}
class ProjectInput {
    constructor() {
        this.templateEl = document.querySelector("#project-input");
        this.hostEl = document.querySelector("#app");
        const importedNode = document.importNode(this.templateEl.content, true);
        this.formEl = importedNode.firstElementChild;
        this.formEl.id = "user-input";
        this.titleInputEl = this.formEl.querySelector("#title");
        this.descriptionInputEl = this.formEl.querySelector("#description");
        this.peopleInputEl = this.formEl.querySelector("#people");
        this.configure();
        this.attach();
    }
    fetchUserInput() {
        const enteredTitle = this.titleInputEl.value;
        const enteredDescription = this.descriptionInputEl.value;
        const enteredPeople = this.peopleInputEl.value;
        const validatableTitle = {
            value: enteredTitle,
            required: true,
        };
        const validatableDescription = {
            value: enteredDescription,
            required: true,
            minLength: 5,
        };
        const validatablePeople = {
            value: enteredPeople,
            required: true,
            min: 1,
            max: 10,
        };
        if (!validate(validatableTitle) ||
            !validate(validatableDescription) ||
            !validate(validatablePeople)) {
            alert("Invalid input, please try again!");
            return;
        }
        else {
            return [enteredTitle, enteredDescription, +enteredPeople];
        }
    }
    clearInputs() {
        this.titleInputEl.value = "";
        this.descriptionInputEl.value = "";
        this.peopleInputEl.value = "";
    }
    submitHandler(e) {
        e.preventDefault();
        const userInput = this.fetchUserInput();
        if (Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
            this.clearInputs();
        }
    }
    configure() {
        this.formEl.addEventListener("submit", this.submitHandler);
    }
    attach() {
        this.hostEl.insertAdjacentElement("afterbegin", this.formEl);
    }
}
__decorate([
    autobind
], ProjectInput.prototype, "submitHandler", null);
const inputForm = new ProjectInput();
const ActiveProjectList = new ProjectList("active");
const FinishedProjectList = new ProjectList("finished");
