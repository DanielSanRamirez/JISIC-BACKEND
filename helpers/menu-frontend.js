const getMenuFrontEnd = (perfil = 'USER_SECRE') => {
    const menu = [
        {
            menu: [
                { titulo: 'Pre-inscripción', url: '/admin/dashboard/pre-inscripciones' },
            ]
        }
    ];

    if (perfil === 'USER_TESO') {
        menu[0].menu.pop();
        menu[0].menu.unshift(
            { titulo: 'Inscripción', url: '/admin/dashboard/inscripciones' }
        )
    }

    if (perfil === 'USER_ADMIN') {
        menu[0].menu.unshift(
            { titulo: 'Productos', url: '/admin/dashboard/productos' },
            { titulo: 'Usuarios', url: '/admin/dashboard/usuarios' },
            { titulo: 'Inscripción', url: '/admin/dashboard/inscripciones' },
            { titulo: 'Por Pagar', url: '/admin/dashboard/por-pagar' },
            { titulo: 'Pre-registro', url: '/admin/dashboard/pre-registros' },
        )

    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}