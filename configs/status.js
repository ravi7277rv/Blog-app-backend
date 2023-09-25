const account_status = {
    unverified: 1,
    active: 2,
    blocked: 3,
    deleted: 4,
  };
  
  const user_status = {
    active: 1,
    inactive: 2,
  };
  
  const SC = {
    OK: 200,
    INTERNAL_SERVER_ERROR: 500,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    WRONG_ENTITY: 422,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
  };

  const user_role = {
    general: 1,
    admin: 2,
  };

  export { user_role, SC, user_status, account_status}