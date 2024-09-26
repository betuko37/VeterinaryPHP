document.addEventListener("DOMContentLoaded", function () {
  console.log("si esta jalando el SERVIDOR");
  fetchTasks();

  const modalElement = document.getElementById('confirmModal');
  const confirmDeleteButton = document.getElementById('confirm-delete');
  const modal = new bootstrap.Modal(modalElement);
  let taskIdToDelete = null;

  const searchInput = document.getElementById("search");
  const textResults = document.getElementById("task-result");
  textResults.style.display = 'none';


  //BUSCAR
  searchInput.addEventListener("keyup", function () {
    if (searchInput.value) {
      fetch("./Php/task-search.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "search=" + encodeURIComponent(searchInput.value),
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Error en la solicitud");
        })
        .then(productos => {
          let template = "";
          productos.forEach(producto => {
            template += `
              <li>${producto.nombre}</li>
            `;
          });

          const container = document.getElementById("container");
          container.innerHTML = template;
          textResults.style.display = 'block';

          console.log(productos);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    } else {
      textResults.style.display = 'none';
    }
  });

//ELIMINAR
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('task-delete')) {
      event.preventDefault(); // Evitar la acción predeterminada del botón

      // Obtener el ID de la tarea a eliminar
      let element = event.target.parentElement.parentElement;
      taskIdToDelete = element.getAttribute('taskId');
      
      // Mostrar la modal
      modal.show();
    }
  });

  // Confirmar eliminación
  confirmDeleteButton.addEventListener('click', function() {
    if (taskIdToDelete) {
      fetch('./Php/delete.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `id=${taskIdToDelete}`
      })
      .then(response => response.text())
      .then(data => {
        console.log(data);
        fetchTasks();
        modal.hide();
        taskIdToDelete = null;
      })
      .catch(error => {
        console.error('Error:', error);
        modal.hide();
        taskIdToDelete = null;
      });
    }
  });

  //UPDATE LIST
  function fetchTasks() {
    fetch('./php/task-list.php', {
      method: 'GET'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
      return response.json();
    })
    .then(productos => {
      let template = '';
      productos.forEach(producto => {
        template += `
          <tr taskId="${producto.id}">
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.precio}</td>
            <td>${producto.cantidad}</td>
            <td>
              <button class="btn task-edit btn-edit">Editar</button>
            </td>
            <td>
              <button class="btn task-delete btn-delete">Eliminar</button>
            </td>
          </tr>
        `;
      });

      document.getElementById('tasks').innerHTML = template;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

  //UPDATE PRODUCT
  document.addEventListener('click', function(event) {
    if (event.target.classList.contains('task-edit')) {
      let element = event.target.parentElement.parentElement;
      let id = element.getAttribute('taskId');
      let nombre = element.children[1].textContent;
      let precio = element.children[2].textContent;
      let cantidad = element.children[3].textContent;

      document.getElementById('nombre').value = nombre;
      document.getElementById('precio').value = precio;
      document.getElementById('cantidad').value = cantidad;
      document.getElementById('task-id').value = id;

      const form = document.getElementById('task-form');
      form.setAttribute('data-mode', 'edit');
      document.getElementById('submit-button').textContent = 'Actualizar';
    }
  });


  //ADD
  document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const mode = this.getAttribute('data-mode');
    const id = document.getElementById('task-id').value;

    const postData = {
      nombre: document.getElementById('nombre').value,
      precio: document.getElementById('precio').value,
      cantidad: document.getElementById('cantidad').value
    };

    let url = './Php/Add.php';
    let method = 'POST';

    if (mode === 'edit' && id) {
      postData.id = id;
      url = './Php/update.php';
      method = 'POST';
      document.getElementById('submit-button').textContent = 'Actualizar';
    } else {
      document.getElementById('submit-button').textContent = 'Agregar';
    }

    const formBody = new URLSearchParams(postData).toString();

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    })
    .then(response => response.text())
    .then(data => {
      console.log(data);
      fetchTasks();
      this.reset();
      this.removeAttribute('data-mode');
      document.getElementById('submit-button').textContent = 'Agregar';
    })
    .catch(error => console.error('Error:', error));
  });



});
