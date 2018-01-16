export const providers = ['Github'];

export const app = {
    ERROR: 'letters-social/app/error',
    LOADED: 'letters-social/app/loaded',
    LOADING: 'letters-social/app/loading'
};

export const auth = {
    LOGIN_SUCCESS: 'letters-social/auth/login/success',
    LOGOUT_SUCCESS: 'letters-social/auth/logout/success'
};

export const jobs = {
    CREATE: 'letters-social/job/create',
    GET: 'letters-social/job/get',
    LIKE: 'letters-social/job/like',
    NEXT: 'letters-social/job/paginate/next',
    UNLIKE: 'letters-social/job/unlike',
    UPDATE_LINKS: 'letters-social/job/paginate/update'
};

export const comments = {
    CREATE: 'letters-social/comments/create',
    GET: 'letters-social/comments/get',
    SHOW: 'letters-social/comments/show',
    TOGGLE: 'letters-social/comments/toggle'
};
