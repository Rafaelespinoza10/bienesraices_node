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