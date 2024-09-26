document.addEventListener("DOMContentLoaded", function () {
    console.log("Clientes - Servidor funcionando");
    fetchClients();
  
    const modalElement = document.getElementById('confirmModal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const modal = new bootstrap.Modal(modalElement);
    let clientIdToDelete = null;
  
    const searchInput = document.getElementById("search");
    const textResults = document.getElementById("client-result");
    textResults.style.display = 'none';
  
    // BUSCAR CLIENTES
searchInput.addEventListener("keyup", function () {
    if (searchInput.value) {
      fetch("../php/client-search.php", {
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
        .then(clientes => {
          let template = "";
          clientes.forEach(cliente => {
            template += `
              <li>${cliente.nombre} - ${cliente.direccion} - ${cliente.telefono}</li>
            `;
          });

          const container = document.getElementById("container");
          container.innerHTML = template;
          textResults.style.display = 'block';

          console.log(clientes);
        })
        .catch(error => {
          console.error("Error:", error);
        });
    } else {
      textResults.style.display = 'none';
    }
  });

    
  
    // Eliminar cliente
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('client-delete')) {
        event.preventDefault();
  
        let element = event.target.parentElement.parentElement;
        clientIdToDelete = element.getAttribute('clientId');
        modal.show();
      }
    });
  
    // Confirmar eliminación
    confirmDeleteButton.addEventListener('click', function() {
      if (clientIdToDelete) {
        fetch('../Php/delete_client.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: `id=${clientIdToDelete}`
        })
        .then(response => response.text())
        .then(data => {
          console.log(data);
          fetchClients();
          modal.hide();
          clientIdToDelete = null;
        })
        .catch(error => {
          console.error('Error:', error);
          modal.hide();
          clientIdToDelete = null;
        });
      }
    });
  
    // Actualizar lista de clientes
    function fetchClients() {
      fetch('../php/get_clients.php', {
        method: 'GET'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.json();
      })
      .then(clientes => {
        let template = '';
        clientes.forEach(cliente => {
          template += `
            <tr clientId="${cliente.id}">
              <td>${cliente.id}</td>
              <td>${cliente.nombre}</td>
              <td>${cliente.direccion}</td>
              <td>${cliente.telefono}</td>
              <td>
                <button class="btn client-edit btn-edit">Editar</button>
              </td>
              <td>
                <button class="btn client-delete btn-delete">Eliminar</button>
              </td>
            </tr>
          `;
        });
  
        document.getElementById('clients').innerHTML = template;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  
    // Editar cliente
    document.addEventListener('click', function(event) {
      if (event.target.classList.contains('client-edit')) {
        let element = event.target.parentElement.parentElement;
        let id = element.getAttribute('clientId');
        let nombre = element.children[1].textContent;
        let direccion = element.children[2].textContent;
        let telefono = element.children[3].textContent;
  
        document.getElementById('nombre').value = nombre;
        document.getElementById('direccion').value = direccion;
        document.getElementById('telefono').value = telefono;
        document.getElementById('client-id').value = id;
  
        const form = document.getElementById('client-form');
        form.setAttribute('data-mode', 'edit');
        document.getElementById('submit-button').textContent = 'Actualizar Cliente';
      }
    });
  
    // Agregar o actualizar cliente
    document.getElementById('client-form').addEventListener('submit', function(e) {
      e.preventDefault();
  
      const mode = this.getAttribute('data-mode');
      const id = document.getElementById('client-id').value;
  
      const postData = {
        nombre: document.getElementById('nombre').value,
        direccion: document.getElementById('direccion').value,
        telefono: document.getElementById('telefono').value
      };
  
      let url = '../Php/add_client.php';
      let method = 'POST';
  
      if (mode === 'edit' && id) {
        postData.id = id;
        url = '../Php/update_client.php';
        method = 'POST';
        document.getElementById('submit-button').textContent = 'Actualizar Cliente';
      } else {
        document.getElementById('submit-button').textContent = 'Agregar Cliente';
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
        fetchClients();
        this.reset();
        this.removeAttribute('data-mode');
        document.getElementById('submit-button').textContent = 'Agregar Cliente';
      })
      .catch(error => console.error('Error:', error));
    });
  });
  