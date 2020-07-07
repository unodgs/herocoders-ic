import Axios from "axios"

export const DEFAULT_ISSUES_FETCH_BUCKET = 50

export class ProjectApiService {
  #api
  #projectName
  
  constructor(projectName) {
    this.#projectName = projectName
    this.#api = Axios.create({
      baseURL: process.env.HEROCODERS_API
    })
  }
  
  getComponents() {
    return this.#api.get(`/project/${this.#projectName}/components`)
      .then(resp => resp.data)
  }
  
  getIssues(startAt = 0, maxResults = DEFAULT_ISSUES_FETCH_BUCKET) {
    return this.#api.get(`/search?jql=project=${this.#projectName}&startAt=${startAt}&maxResults=${maxResults}`)
      .then(resp => resp.data.issues)
  }
  
}