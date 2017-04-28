'use strict';
class Model {
  constructor() {
    this.user = 'test';
  }

  getProjectTitles() {    
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'username=' + this.user,
    };
    const mRequest = new Request('/projects');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.json().then((data) => {
        controller.handleProjectTitles(data);
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  getProjectData(id) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    };

    const mRequest = new Request('/project');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.json().then((data) => {
        controller.handleProjectData(data);
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  addProject() {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'username=' + this.user,
    };

    const mRequest = new Request('/addProject');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then(() => {
        console.log('Project added');
        controller.refresh();
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  updateProject(id, title, content) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&title=' + title + '&content=' + content
    };

    const mRequest = new Request('/updateProject');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then(() => {
        console.log('Update sent');
        controller.refresh();
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  /**
   * Sets current user from url parameters.
   */
  setCurrentUser(name) {
    if (typeof name !== 'undefined') {
      const url = location.href;
      name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
      const regexS = '[\\?&]' + name + '=([^&#]*)';
      const regex = new RegExp(regexS);
      const results = regex.exec(url);
      this.user = results == null ? null : results[1];
    }
  }
}
