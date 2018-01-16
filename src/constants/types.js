export const providers = ['Github'];

export const app = {
    ERROR: 'oddjob/app/error',
    LOADED: 'oddjob/app/loaded',
    LOADING: 'oddjob/app/loading'
};

export const auth = {
    LOGIN_SUCCESS: 'oddjob/auth/login/success',
    LOGOUT_SUCCESS: 'oddjob/auth/logout/success'
};

export const jobs = {
    CREATE: 'oddjob/job/create',
    GET: 'oddjob/job/get',
    LIKE: 'oddjob/job/like',
    NEXT: 'oddjob/job/paginate/next',
    UNLIKE: 'oddjob/job/unlike',
    UPDATE_LINKS: 'oddjob/job/paginate/update'
};

export const comments = {
    CREATE: 'oddjob/comments/create',
    GET: 'oddjob/comments/get',
    SHOW: 'oddjob/comments/show',
    TOGGLE: 'oddjob/comments/toggle'
};
