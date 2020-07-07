import "dotenv/config.js"
import { ProjectService } from "./services/project.service.js"
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
    const icProjectService = new ProjectService("IC")
    const componentService = new ComponentService(icProjectService);

    const componentsIssues = await componentService.getNoLeadComponentsIssues()

    printComponents(componentsIssues)
  } catch (error) {
    console.error("Fetching components issues critical problem:", error)
  }
})()
