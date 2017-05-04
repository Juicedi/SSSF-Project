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

  getSharedProjectTitles() {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'username=' + this.user,
    };
    const mRequest = new Request('/getSharedProjects');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.json().then((data) => {
        controller.handleSharedProjectTitles(data);
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

  getShared(id) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id,
    };
    const mRequest = new Request('/getShared');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.json().then((data) => {
        controller.updateShared(data);
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  addShare(id, user) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&user=' + user
    };

    const mRequest = new Request('/addShare');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then(() => {
        console.log('Shared with a new user');
        this.getShared(id);
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  removeShare(id, user) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&user=' + user
    };

    const mRequest = new Request('/removeShare');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then(() => {
        console.log('Removed user from the project');
        this.getShared(id);
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

  updateProjectTitle(id, title) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&title=' + title
    };

    const mRequest = new Request('/updateProjectTitle');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then(() => {
        console.log('Title update sent');
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  updateProject(id, content) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&content=' + content
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
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  removeProject(id) {
    const myInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id,
    };

    const mRequest = new Request('/removeProject');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then(() => {
        console.log('Remove sent');
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
