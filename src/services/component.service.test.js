import { describe, it, jest } from "@jest/globals";
import { ProjectService } from "./project.service";
import { ComponentService } from "./component.service";

describe("Component service", () => {
  const projectService = new ProjectService('test-project')
  const componentService = new ComponentService(projectService)
  
  it("should find components with no lead only", async () => {
    jest.spyOn(projectService, 'getComponents').mockResolvedValue([{
      id: "1",
      name: "component-1"
    }, {
      id: "2",
      name: "component-2",
      lead: {}
    }, {
      id: "3",
      name: "component-3"
    }, {
      id: "4",
      name: "component-4",
      assigneeType: "PROJECT_OWNER"
    }])

    jest.spyOn(projectService, 'getIssues')
      .mockResolvedValue([])
    
    const noLeadComponents = await componentService.getNoLeadComponentsIssues()
    
    expect(noLeadComponents).toEqual([{
      id: "1",
      name: "component-1",
      issues: []
    }, {
      id: "3",
      name: "component-3",
      issues: []
    }, {
      id: "4",
      name: "component-4",
      issues: []
    }])
  })      
  
  it("should assign issues to components correctly", async () => {
    jest.spyOn(projectService, 'getComponents').mockResolvedValue([{
        id: "1",
        name: "component-1"
      }, {
        id: "2",
        name: "component-2"
      }, {
        id: "3",
        name: "component-3"
      }])
    
    jest.spyOn(projectService, 'getIssues')
      .mockResolvedValue([])
      .mockResolvedValueOnce([{
        id: "1",
        key: "issue-1",
        fields: {
          components: [{
            id: "1"
          }, {
            id: "3"
          }]
        }
      }, {
        id: "2",
        key: "issue-2",
        fields: {
          components: [{
            id: "2"
          }]
        }
      }])
      .mockResolvedValueOnce([{
        id: "3",
        key: "issue-3",
        fields: {
          components: [{
            id: "2"
          }]
        }
      }, {
        id: "4",
        key: "issue-4",
        fields: {
          components: [{
            id: "1"
          }]
        }
      }])
    
    const componentsIssues = await componentService.getNoLeadComponentsIssues()
    
    expect(componentsIssues).toEqual([{
      id: "1",
      name: "component-1",
      issues: [{
        id: "1",
        key: "issue-1"
      }, {
        id: "4",
        key: "issue-4"
      }]
    }, {
      id: "2",
      name: "component-2",
      issues: [{
        id: "2",
        key: "issue-2"
      }, {
        id: "3",
        key: "issue-3"
      }]
    }, {
      id: "3",
      name: "component-3",
      issues: [{
        id: "1",
        key: "issue-1"
      }]
    }])
  }) 
})