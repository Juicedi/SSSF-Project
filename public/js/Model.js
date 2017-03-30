class Model {
  constructor() { }

  getProjectTitles() {
    const mRequest = new Request('/projects');
    fetch(mRequest).then((response) => {
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
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id
    }

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

  addProject(title, content) {
    const myInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'title=' + title + '&content=' + content
    }

    const mRequest = new Request('/addProject');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then((data) => {
        console.log('Update sent');
        controller.refresh();
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }

  updateProject(id, title, content) {
    const myInit = {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'id=' + id + '&title=' + title + '&content=' + content
    }

    const mRequest = new Request('/updateProject');
    fetch(mRequest, myInit).then((response) => {
      if (!response.ok) {
        console.log('Error! Status Code: ' +
          response.status);
        return;
      }

      // Do something with the response
      response.blob().then((data) => {
        console.log('Update sent');
        controller.refresh();
      });
    }).catch(function (err) {
      console.log('Fetch Error :-S', err);
    });
  }
}