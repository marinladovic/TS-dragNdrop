/**
 * PROJECT CLASS - definition of a project
 * @param id - project id
 * @param title - project title
 * @param description - project description
 * @param people - number of people working on the project
 * @param status - project status (active | finished)
 */

export enum ProjectStatus {
  Active, // 0
  Finished, // 1
}

export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}
