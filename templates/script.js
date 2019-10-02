if (!localStorage.getItem('display_name'))
    document.querySelector('#enter_name').style.display = "none"
    
document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#enter_name').onsubmit = () => {

        let name = document.querySelector('#display_name').value
        localStorage.setItem('display_name', 'name')
    }
    
})