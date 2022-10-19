const logOut = document.getElementById('log-out');

logOut.addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST'
    }).then((res) => {
        if (res.status === 200) {
            window.location.href = '/';
        }
    });
});
