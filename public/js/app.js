const file = document.querySelector('.file');

const getFileData = () => {
  const mRequest = new Request('/project');
  fetch(mRequest).then((response) => {
    if (!response.ok) {
      console.log('Error! Status Code: ' +
        response.status);
      return;
    }

    // Do something with the response
    response.json().then((data) => {
      document.getElementById('file-editor').value = data.content;
    });
  }).catch(function (err) {
    console.log('Fetch Error :-S', err);
  });
}

file.addEventListener('click', () => {
  getFileData();
}, this);
