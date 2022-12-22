const button1 = document.getElementById('singleplayer');
const button2 = document.getElementById('multiplayer');

button1.addEventListener('click', () => {
    console.log('button was clicked');
    fetch('https://localhost:8080/singleplayer', {
        method:'GET',
        headers:{
            'content-type': 'application/json'
        }

    }).then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
    .catch(err => {
        console.log(err);
      });
})

button2.addEventListener('click', () => {
    console.log('button was clicked');
    fetch('https://localhost:8080/multiplayer', {
        method:'GET',
        headers:{
            'content-type': 'application/json'
        }

    }).then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusText)))
    .catch(err => {
        console.log(err);
      });
})
