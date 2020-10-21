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
            { titulo: 'Pagos', url: '/admin/dashboard/pagos' },
        )
    }

    if (perfil === 'USER_ADMIN') {
        menu[0].menu.pop();
        menu[0].menu.unshift(
            { titulo: 'Registros', url: '/admin/dashboard/registros' },
            { titulo: 'Pre-inscripción', url: '/admin/dashboard/pre-inscripciones' },
            { titulo: 'Por Pagar', url: '/admin/dashboard/por-pagar' },
            { titulo: 'Pagos', url: '/admin/dashboard/pagos' },
            { titulo: 'Inscritos', url: '/admin/dashboard/inscritos' },
            { titulo: 'Productos', url: '/admin/dashboard/productos' },
            { titulo: 'Usuarios', url: '/admin/dashboard/usuarios' },
        )

    }

    return menu;
}

module.exports = {
    getMenuFrontEnd
}