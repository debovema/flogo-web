import { createServer, Server } from 'http';

import * as Koa from 'koa';
const KoaApp = require('koa');
const Router = require('koa-router');
const cors = require('@koa/cors');
const serveStatic = require('koa-static');
const bodyParser = require('koa-body');
const compress = require('koa-compress');

import { logger } from '../../common/logging';
import { ERROR_TYPES, ErrorManager } from '../../common/errors';
import { mountRestApi } from '../../api';

export interface ServerConfig {
  port: string;
  staticPath: string;
}

export async function createApp({ port, staticPath }: ServerConfig) {
  const app: Koa = new KoaApp();
  app.on('error', errorLogger);
  app.use(cors({ expose: ['Content-Disposition'] }));
  // uncomment to log all requests
  // app.use(requestLogger());
  app.use(stripTrailingSlash());
  app.use(compressor());

  app.use(serveStatic(staticPath, { defer: true }));

  const router = initRouter();
  app.use(router.routes())
    .use(router.allowedMethods());

  const server = createServer(app.callback());
  await listenAndWaitReady(server, port);
  logger.info('start web server done.');
  return server;
}

function listenAndWaitReady(server: Server, port: string) {
  const resolver = (success, fail) => {
    server.on('listening', success);
    server.on('error', fail);
  };
  server.listen(port);
  return new Promise(resolver);
}

function errorLogger(): Koa.Middleware {
  return function (err) {
    if (401 == err.status) {
      return;
    }
    if (404 == err.status) {
      return;
    }
    logger.error(err);
  };
}

function initRouter() {
  const router = new Router();
  router.use(bodyParser({
    multipart: true,
    onError() {
      throw ErrorManager.createRestError('Body parse error', { type: ERROR_TYPES.COMMON.BAD_SYNTAX });
    },
  }));
  mountRestApi(router);
  return router;
}

const REST_API_ROUTE = /\/[^\/]+\.[^.\/]+$/i;
function stripTrailingSlash(): Koa.Middleware {
  return function stripTrailingSlash(ctx: Koa.Context, next) {
    let { path } = ctx.request;
    path = path.endsWith('/') ? path.substring(0, path.length - 1) : path;
    const isRestApiRoute = !REST_API_ROUTE.test(path) && path.toLowerCase().search('/api/') === -1
    if (isRestApiRoute) {
      ctx.request.path = '/';
    }
    return next();
  };
}

function requestLogger(): Koa.Middleware {
  return async function requestLogger(ctx, next) {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    logger.verbose('%s %s - %s', ctx.method, ctx.url, ms);
    logger.verbose(ctx.body);
  }
}

function compressor(): Koa.Middleware {
  return compress({
    filter: (content_type) => /text/i.test(content_type),
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
  });
}
