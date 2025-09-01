## Features: 
### Projects
- When a user first opens an app, there should be a default project where they can put their inputs in. 
- User should be able to create new projects and add new iitems to whichever projects they like. 
### TODO ITEMS
- Have title
- have description
- have a due date
- have a priority

### Interface
Refer to https://www.todoist.com/

The user should be able to view all projects and view all TODO ITEMS for each projects (prefferably only the name and due date, and optionally changing colors for the priority).

The user should be able to expand a TODO ITEMS to view the details. 

The user should be able to delete a TODO ITEMS. 
## Implementation detail
- Application logic should be separated. 
- A guide: 1 of each: creating todos, setting todos as complete, changing todos priority, etc. , DOM related stuff should be separated from these.
- Consider using https://github.com/date-fns/date-fns, an npm that handles dates and time formatting. 
- Use this API to store the User data (only on the computer that the program is run): https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API
    - Make sure the data retrieve actually exists. 
    - Local storage uses JSON to send and store data. 