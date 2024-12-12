<<<<<<< HEAD
import bcrypt from 'bcrypt';

const usuarios = [

    {
        nombre: 'Alejandro ',
        email: 'rafael.moreno.espinoza10@gmail.com',
        confirmado: 1, 
        password: bcrypt.hashSync('password', 10),
    }
]

export default usuarios; 
=======
import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre: 'Juan',
        email: 'juan@juan.com',
        confirmado: 1,
        password: bcrypt.hashSync('password', 10)
    }
]

export default usuarios
>>>>>>> 6c306ec (fix email.js)
