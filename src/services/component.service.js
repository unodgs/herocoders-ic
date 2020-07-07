const LEAD_ASSIGNEE_TYPE = "COMPONENT_LEAD"

export class ComponentService {
  #projectService
  
  constructor(projectService) {
    this.#projectService = projectService
  }
  
  #componentHasLead = component => component.hasOwnProperty("lead") ||
    component.assigneeType === LEAD_ASSIGNEE_TYPE

  #issueBelongsToComponent = (issue, component) =>
    issue.fields?.components?.find(c => c.id === component.id) ?? false

  /**
   * Iteratively updates component issues.
   * Issues are fetched in pages to save memory on long issue list and they
   * are fetched only once for all components to speed up the process
   * @param   {Array<{id, name, issues }>} components Component list
   * @returns {Promise<{ id, name, issues }>} the same list of input components with updated issue list
   */
  #setComponentsIssues = async (components) => {
    let issues = await this.#projectService.getIssues(0)
    let issueStartIndex = issues.length

    while (issues.length > 0) {
      components.forEach(c => {
        const componentIssues = issues
          .filter(i => this.#issueBelongsToComponent(i, c))
          .map(i => ({
            id: i.id,
            key: i.key
          }))
        
        c.issues = c.issues.concat(componentIssues)
      })
      
      issues = await this.#projectService.getIssues(issueStartIndex)
      issueStartIndex += issues.length
    }
  }

  #getNoLeadComponents = async () => {
    const components = await this.#projectService.getComponents()
    return components
      .filter(c => this.#componentHasLead(c) === false)
      .map(c => ({
        id: c.id,
        name: c.name,
        issues: []
      }))
  }

  /**
   * Returns list of components with no lead and with assigned issues
   * @returns {Promise<Array<{id, name, issues}>>}
   */
  async getNoLeadComponentsIssues() {
    const components = await this.#getNoLeadComponents()
    await this.#setComponentsIssues(components)
    return components
  }
}