import "dotenv/config.js"
import { ProjectApiService } from "./services/project-api.service.js"
import { ComponentService } from "./services/component.service.js"

function printComponents(components) {
  components.forEach(c => {
    console.log('\n')
    console.log(`Component: ${c.name}, id: ${c.id}, issues: ${c.issues.length}`);
    console.table(c.issues)
  })
}

(async function() {
  try {
    const icProjectApiService = new ProjectApiService("IC")
    const componentService = new ComponentService(icProjectApiService);

    const componentsIssues = await componentService.getNoLeadComponentsIssues()

    printComponents(componentsIssues)
  } catch (error) {
    console.error("Fetching components issues critical problem:", error)
  }
})()
