'use strict';
class Model {
  constructor() {
    this.user = 'test';
  }
  /**
   * Get user's project titles from DB.
   */
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

  /**
   * Get projects that have been shared with user.
   */
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

  /**
   * Gets all data for the given project id.
   */
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

  /**
   * Get list of people this project is shared with.
   */
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

  /**
   * Add new person to projects shared list.
   * @param {String} id Project ID
   * @param {String} user Shared user's name
   */
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

  /**
   * Removes person from shared list.
   * @param {String} id Project ID
   * @param {String} user User's name which is to be removed
   */
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

  /**
   * Adds a new project for the current user.
   */
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

  /**
   * Sends update to projects title.
   * @param {String} id Project ID.
   * @param {String} title Projects new title.
   */
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

  /**
   * Updates projects content.
   * @param {String} id Project ID.
   * @param {String} content Projects new content.
   */
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

/**
 * Remove project with the given ID from DB.
 * @param {String} id Projects ID
 */
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
   * @param {String} name Gets username from url.
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
