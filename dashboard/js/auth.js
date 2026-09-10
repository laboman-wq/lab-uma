/*********************************************************************
 * Sesi login + guard role
 *********************************************************************/
const Auth = {
    KEY: 'lab_uma_session',

    current() {
        try {
            return JSON.parse(localStorage.getItem(this.KEY) || 'null');
        } catch (e) {
            return null;
        }
    },

    set(user) {
        localStorage.setItem(this.KEY, JSON.stringify(user));
    },

    clear() {
        localStorage.removeItem(this.KEY);
    },

    login(username, password) {
        return api('login', { username, password });
    },

    // Wajib login; redirect ke /dashboard/login.html jika belum
    guard() {
        const u = this.current();
        if (!u) {
            window.location.href = 'login.html';
            return null;
        }
        return u;
    },

    require(roles) {
        const u = this.current();
        if (!u) {
            window.location.href = 'login.html';
            return null;
        }
        if (roles.indexOf(u.role) === -1) {
            alert('Anda tidak memiliki akses ke halaman ini.');
            window.location.href = 'dashboard.html';
            return null;
        }
        return u;
    }
};