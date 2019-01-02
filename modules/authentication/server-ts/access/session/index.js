import { isApiExternal } from '@module/core-common';
import { User, scopes } from '@module/user-server-ts';

import { writeSession, createSession, readSession } from './sessions';
import AccessModule from '../AccessModule';
import schema from './schema.graphql';
import resolvers from './resolvers';
import settings from '../../../../../settings';

const grant = async ({ id }, req) => {
  const session = { ...req.session, id };
  req.session = writeSession(req, session);
};

const getCurrentUser = async ({ req, getIdentity }) => {
  if (req && req.session.id) {
    return await getIdentity(req.session.id);
  }
};

// const checkCSRFToken = req => {
//   if (isApiExternal && req.path !== __API_URL__) {
//     return false;
//   }
// if (req.universalCookies.get('x-token') !== req.session.csrfToken) {
//   req.session = createSession(req);
//   throw new Error('CSRF token validation failed');
// }
// };

const attachSession = req => {
  if (req) {
    req.session = readSession(req);
    if (!req.session) {
      req.session = createSession(req);
    } else {
      if (!isApiExternal && req.path === __API_URL__) {
        if (req.universalCookies.get('x-token') !== req.session.csrfToken) {
          req.session = createSession(req);
          throw new Error('CSRF token validation failed');
        }
      }
    }
  }
};

const createContextFunc = async ({ req, context }) => {
  const { getIdentity } = context;
  attachSession(req);
  const user = context.user || (await getCurrentUser({ req, getIdentity }));
  const auth = {
    isAuthenticated: !!user,
    scope: user ? scopes[user.role] : null
  };

  return {
    User,
    user,
    auth
  };
};

export default new AccessModule(
  settings.auth.session.enabled
    ? {
        grant: [grant],
        schema: [schema],
        createResolversFunc: [resolvers],
        createContextFunc: [createContextFunc]
      }
    : {}
);