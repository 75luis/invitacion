document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();  // Evitar el envío del formulario
  
    const codigo = document.getElementById('codigo').value;
    fetch('invitados.json')
      .then(response => response.json())
      .then(data => {
        const invitado = data.find(inv => inv.codigo === codigo);
        if (invitado) {
          // Determinar el saludo según el género
          const saludo = invitado.genero === 'masculino' 
            ? `Sr. ${invitado.nombre}, está invitado a mi Quinceaños.` 
            : `Sra. ${invitado.nombre}, está invitada a mi Quinceaños.`;
  
          const entradas = `Esta invitación es para ${invitado.entradas} personas.`;
          
          // Mostrar el mensaje
          document.getElementById('saludo').textContent = saludo;
          document.getElementById('entradas').textContent = entradas;
          
          // Mostrar el mensaje
          document.getElementById('mensaje').classList.remove('hidden');

          
        } else {
          alert('Código incorrecto. Inténtalo de nuevo.');
        }
      })
      .catch(error => {
        console.error('Error al cargar los datos:', error);
      });
  });
  