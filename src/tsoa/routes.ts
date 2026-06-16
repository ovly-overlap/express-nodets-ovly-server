/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UsersController } from "./../domain/users/users.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UploadController } from "./../domain/uploads/upload.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScheduleController } from "./../domain/schedule/schedule.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { PostController } from "./../domain/post/post.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { NewsController } from "./../domain/news/news.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FollowsController } from "./../domain/follows/follows.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CommentController } from "./../domain/comment/comment.controller.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from "./../domain/auth/auth.controller.js";
import type {
  Request as ExRequest,
  Response as ExResponse,
  RequestHandler,
  Router,
} from "express";

import { expressAuthentication } from "@/infrastructure/middleware/authentication.js";

const expressAuthenticationRecasted = expressAuthentication as (
  request: ExRequest,
  securityName: string,
  scopes?: string[],
  response?: ExResponse
) => Promise<any>;

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  UserListResponse: {
    dataType: "refObject",
    properties: {
      users: {
        dataType: "array",
        array: {
          dataType: "nestedObjectLiteral",
          nestedProperties: {
            profileUrl: { dataType: "string", required: true },
            profileIdx: { dataType: "string", required: true },
            username: { dataType: "string", required: true },
            id: { dataType: "double", required: true },
          },
        },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UpdateImageReq: {
    dataType: "refObject",
    properties: {
      imageUrl: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UpdateIntroReq: {
    dataType: "refObject",
    properties: {
      intro: { dataType: "string", required: true },
      newIntro: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UpdateOrCreateFandomReq: {
    dataType: "refObject",
    properties: {
      newFandomIds: {
        dataType: "array",
        array: { dataType: "double" },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreateUploadUrlResponse: {
    dataType: "refObject",
    properties: {
      uploadToken: { dataType: "string", required: true },
      path: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  ScheduleResponse: {
    dataType: "refObject",
    properties: {
      id: { dataType: "double", required: true },
      user_id: { dataType: "double", required: true },
      content: { dataType: "string", required: true },
      memo: {
        dataType: "union",
        subSchemas: [
          { dataType: "string" },
          { dataType: "enum", enums: [null] },
        ],
        required: true,
      },
      isDone: { dataType: "boolean", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LikePostResponse: {
    dataType: "refObject",
    properties: {
      liked: { dataType: "boolean", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LikedUserPreviewDto: {
    dataType: "refObject",
    properties: {
      userId: { dataType: "double", required: true },
      username: { dataType: "string", required: true },
      profileImageUrl: {
        dataType: "union",
        subSchemas: [
          { dataType: "string" },
          { dataType: "enum", enums: [null] },
        ],
        required: true,
      },
      isFollowing: { dataType: "boolean", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LikedUsersCursorResponse: {
    dataType: "refObject",
    properties: {
      items: {
        dataType: "array",
        array: { dataType: "refObject", ref: "LikedUserPreviewDto" },
        required: true,
      },
      nextCursor: {
        dataType: "union",
        subSchemas: [
          { dataType: "double" },
          { dataType: "enum", enums: [null] },
        ],
        required: true,
      },
      hasNext: { dataType: "boolean", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  PostResponseDTO: {
    dataType: "refObject",
    properties: {
      id: { dataType: "double", required: true },
      title: { dataType: "string", required: true },
      content: { dataType: "string", required: true },
      likeCount: { dataType: "double", required: true },
      commentCount: { dataType: "double", required: true },
      imageCount: { dataType: "double" },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreatePostDTO: {
    dataType: "refObject",
    properties: {
      title: { dataType: "string", required: true },
      content: { dataType: "string", required: true },
      image_url: {
        dataType: "array",
        array: { dataType: "string" },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FollowerPreviewDto: {
    dataType: "refObject",
    properties: {
      id: { dataType: "double", required: true },
      username: { dataType: "string", required: true },
      profileImageUrl: {
        dataType: "union",
        subSchemas: [
          { dataType: "string" },
          { dataType: "enum", enums: [null] },
        ],
        required: true,
      },
      isFollowing: { dataType: "boolean", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FollowersResponseDto: {
    dataType: "refObject",
    properties: {
      items: {
        dataType: "array",
        array: { dataType: "refObject", ref: "FollowerPreviewDto" },
        required: true,
      },
      nextCursor: {
        dataType: "union",
        subSchemas: [
          { dataType: "string" },
          { dataType: "enum", enums: [null] },
        ],
        required: true,
      },
      hasNext: { dataType: "boolean", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CommentResponse: {
    dataType: "refObject",
    properties: {
      postId: { dataType: "double", required: true },
      userId: { dataType: "double", required: true },
      parentId: { dataType: "double", required: true },
      content: { dataType: "string", required: true },
      likesCount: { dataType: "double", required: true },
      author: {
        dataType: "nestedObjectLiteral",
        nestedProperties: {
          profileImageUrl: {
            dataType: "union",
            subSchemas: [
              { dataType: "string" },
              { dataType: "enum", enums: [null] },
            ],
            required: true,
          },
          username: { dataType: "string", required: true },
          id: { dataType: "double", required: true },
        },
        required: true,
      },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  SignUpDto: {
    dataType: "refObject",
    properties: {
      username: { dataType: "string", required: true },
      password: { dataType: "string", required: true },
      passwordConfirm: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CheckIdResponse: {
    dataType: "refObject",
    properties: {
      isAvaliable: { dataType: "boolean", required: true },
      message: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  SignInResponseDto: {
    dataType: "refObject",
    properties: {
      accessToken: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  SignInDto: {
    dataType: "refObject",
    properties: {
      username: { dataType: "string", required: true },
      password: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  RefreshTokenResponseDto: {
    dataType: "refObject",
    properties: {
      accessToken: { dataType: "string", required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
  noImplicitAdditionalProperties: "throw-on-extras",
  bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################

  const argsUsersController_getUserById: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    viewerId: {
      in: "path",
      name: "viewerId",
      required: true,
      dataType: "double",
    },
  };
  app.get(
    "/users/:viewerId",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.getUserById),

    async function UsersController_getUserById(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_getUserById,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: "getUserById",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_searchUsersByName: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    keyword: {
      in: "query",
      name: "keyword",
      required: true,
      dataType: "string",
    },
    page: { in: "query", name: "page", dataType: "double" },
    limit: { in: "query", name: "limit", dataType: "double" },
  };
  app.get(
    "/users/search",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(
      UsersController.prototype.searchUsersByName
    ),

    async function UsersController_searchUsersByName(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_searchUsersByName,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: "searchUsersByName",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_updateProfileImage: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "UpdateImageReq",
    },
  };
  app.patch(
    "/users/me/image",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(
      UsersController.prototype.updateProfileImage
    ),

    async function UsersController_updateProfileImage(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_updateProfileImage,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: "updateProfileImage",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_updateProfileIntro: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "UpdateIntroReq",
    },
  };
  app.patch(
    "/users/me/intro",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(
      UsersController.prototype.updateProfileIntro
    ),

    async function UsersController_updateProfileIntro(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_updateProfileIntro,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: "updateProfileIntro",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUsersController_updateFandom: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    requestBody: {
      in: "body",
      name: "requestBody",
      required: true,
      ref: "UpdateOrCreateFandomReq",
    },
  };
  app.post(
    "/users/me/fandom",
    ...fetchMiddlewares<RequestHandler>(UsersController),
    ...fetchMiddlewares<RequestHandler>(UsersController.prototype.updateFandom),

    async function UsersController_updateFandom(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUsersController_updateFandom,
          request,
          response,
        });

        const controller = new UsersController();

        await templateService.apiHandler({
          methodName: "updateFandom",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsUploadController_createUploadUrl: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/users/presigned-url",
    ...fetchMiddlewares<RequestHandler>(UploadController),
    ...fetchMiddlewares<RequestHandler>(
      UploadController.prototype.createUploadUrl
    ),

    async function UploadController_createUploadUrl(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsUploadController_createUploadUrl,
          request,
          response,
        });

        const controller = new UploadController();

        await templateService.apiHandler({
          methodName: "createUploadUrl",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScheduleController_createSchedule: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/schedule",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(ScheduleController),
    ...fetchMiddlewares<RequestHandler>(
      ScheduleController.prototype.createSchedule
    ),

    async function ScheduleController_createSchedule(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScheduleController_createSchedule,
          request,
          response,
        });

        const controller = new ScheduleController();

        await templateService.apiHandler({
          methodName: "createSchedule",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScheduleController_updateSchedule: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    scheduleId: {
      in: "path",
      name: "scheduleId",
      required: true,
      dataType: "double",
    },
  };
  app.put(
    "/schedule/:scheduleId",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(ScheduleController),
    ...fetchMiddlewares<RequestHandler>(
      ScheduleController.prototype.updateSchedule
    ),

    async function ScheduleController_updateSchedule(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScheduleController_updateSchedule,
          request,
          response,
        });

        const controller = new ScheduleController();

        await templateService.apiHandler({
          methodName: "updateSchedule",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsScheduleController_getScheduleByDate: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    targetDate: {
      in: "query",
      name: "targetDate",
      required: true,
      dataType: "string",
    },
  };
  app.get(
    "/schedule",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(ScheduleController),
    ...fetchMiddlewares<RequestHandler>(
      ScheduleController.prototype.getScheduleByDate
    ),

    async function ScheduleController_getScheduleByDate(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsScheduleController_getScheduleByDate,
          request,
          response,
        });

        const controller = new ScheduleController();

        await templateService.apiHandler({
          methodName: "getScheduleByDate",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_toggleLikePost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "double" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/posts/:postId/likes",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(
      PostController.prototype.toggleLikePost
    ),

    async function PostController_toggleLikePost(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_toggleLikePost,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "toggleLikePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_hidePost: Record<string, TsoaRoute.ParameterSchema> =
    {
      postId: {
        in: "path",
        name: "postId",
        required: true,
        dataType: "double",
      },
      req: { in: "request", name: "req", required: true, dataType: "object" },
    };
  app.post(
    "/posts/:postId/hide",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(PostController.prototype.hidePost),

    async function PostController_hidePost(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_hidePost,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "hidePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_reportPost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "double" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
    body: {
      in: "body",
      name: "body",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: { reason: { dataType: "string", required: true } },
    },
  };
  app.post(
    "/posts/:postId/report",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(PostController.prototype.reportPost),

    async function PostController_reportPost(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_reportPost,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "reportPost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_getLikedUsersAll: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    postId: { in: "path", name: "postId", required: true, dataType: "double" },
    cursor: {
      default: null,
      in: "query",
      name: "cursor",
      dataType: "union",
      subSchemas: [{ dataType: "double" }, { dataType: "enum", enums: [null] }],
    },
    limit: { default: 10, in: "query", name: "limit", dataType: "double" },
  };
  app.get(
    "/posts/:postId/likes",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(
      PostController.prototype.getLikedUsersAll
    ),

    async function PostController_getLikedUsersAll(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_getLikedUsersAll,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "getLikedUsersAll",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_createPost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    body: { in: "body", name: "body", required: true, ref: "CreatePostDTO" },
  };
  app.post(
    "/posts",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(PostController.prototype.createPost),

    async function PostController_createPost(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_createPost,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "createPost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_getFollowingPostAll: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    type: {
      default: "suggest",
      in: "path",
      name: "type",
      required: true,
      dataType: "union",
      subSchemas: [
        { dataType: "enum", enums: ["following"] },
        { dataType: "enum", enums: ["suggest"] },
      ],
    },
    cursor: {
      default: null,
      in: "query",
      name: "cursor",
      dataType: "union",
      subSchemas: [{ dataType: "double" }, { dataType: "enum", enums: [null] }],
    },
    limit: { default: 10, in: "query", name: "limit", dataType: "double" },
  };
  app.get(
    "/posts/ovly/:type",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(
      PostController.prototype.getFollowingPostAll
    ),

    async function PostController_getFollowingPostAll(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_getFollowingPostAll,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "getFollowingPostAll",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_getPostDetail: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "double" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.get(
    "/posts/:postId",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(PostController.prototype.getPostDetail),

    async function PostController_getPostDetail(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_getPostDetail,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "getPostDetail",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_updatePost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "double" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
    body: {
      in: "body",
      name: "body",
      required: true,
      dataType: "nestedObjectLiteral",
      nestedProperties: {
        content: { dataType: "string", required: true },
        title: { dataType: "string", required: true },
      },
    },
  };
  app.put(
    "/posts/:postId",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(PostController.prototype.updatePost),

    async function PostController_updatePost(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_updatePost,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "updatePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsPostController_deletePost: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    postId: { in: "path", name: "postId", required: true, dataType: "double" },
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.delete(
    "/posts/:postId",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(PostController),
    ...fetchMiddlewares<RequestHandler>(PostController.prototype.deletePost),

    async function PostController_deletePost(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsPostController_deletePost,
          request,
          response,
        });

        const controller = new PostController();

        await templateService.apiHandler({
          methodName: "deletePost",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsNewsController_getRecentNews: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.get(
    "/news",
    ...fetchMiddlewares<RequestHandler>(NewsController),
    ...fetchMiddlewares<RequestHandler>(NewsController.prototype.getRecentNews),

    async function NewsController_getRecentNews(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsNewsController_getRecentNews,
          request,
          response,
        });

        const controller = new NewsController();

        await templateService.apiHandler({
          methodName: "getRecentNews",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsNewsController_searchNews: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    keyword: {
      in: "query",
      name: "keyword",
      required: true,
      dataType: "string",
    },
  };
  app.get(
    "/news/search",
    ...fetchMiddlewares<RequestHandler>(NewsController),
    ...fetchMiddlewares<RequestHandler>(NewsController.prototype.searchNews),

    async function NewsController_searchNews(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsNewsController_searchNews,
          request,
          response,
        });

        const controller = new NewsController();

        await templateService.apiHandler({
          methodName: "searchNews",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsFollowsController_toggleFollow: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    userId: { in: "path", name: "userId", required: true, dataType: "double" },
  };
  app.post(
    "/follows/:userId",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(FollowsController),
    ...fetchMiddlewares<RequestHandler>(
      FollowsController.prototype.toggleFollow
    ),

    async function FollowsController_toggleFollow(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsFollowsController_toggleFollow,
          request,
          response,
        });

        const controller = new FollowsController();

        await templateService.apiHandler({
          methodName: "toggleFollow",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsFollowsController_getFollowers: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    viewerId: {
      in: "path",
      name: "viewerId",
      required: true,
      dataType: "double",
    },
    cursor: { in: "query", name: "cursor", required: true, dataType: "string" },
    limit: { default: 10, in: "query", name: "limit", dataType: "double" },
  };
  app.get(
    "/follows/followers/:viewerId",
    ...fetchMiddlewares<RequestHandler>(FollowsController),
    ...fetchMiddlewares<RequestHandler>(
      FollowsController.prototype.getFollowers
    ),

    async function FollowsController_getFollowers(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsFollowsController_getFollowers,
          request,
          response,
        });

        const controller = new FollowsController();

        await templateService.apiHandler({
          methodName: "getFollowers",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsFollowsController_getFollowings: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    cursor: { in: "query", name: "cursor", required: true, dataType: "string" },
    limit: { default: 10, in: "query", name: "limit", dataType: "double" },
  };
  app.get(
    "/follows/followings/:viewerId",
    ...fetchMiddlewares<RequestHandler>(FollowsController),
    ...fetchMiddlewares<RequestHandler>(
      FollowsController.prototype.getFollowings
    ),

    async function FollowsController_getFollowings(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsFollowsController_getFollowings,
          request,
          response,
        });

        const controller = new FollowsController();

        await templateService.apiHandler({
          methodName: "getFollowings",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsFollowsController_getFollowCounts: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    userId: { in: "path", name: "userId", required: true, dataType: "double" },
  };
  app.get(
    "/follows/counts/:userId",
    ...fetchMiddlewares<RequestHandler>(FollowsController),
    ...fetchMiddlewares<RequestHandler>(
      FollowsController.prototype.getFollowCounts
    ),

    async function FollowsController_getFollowCounts(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsFollowsController_getFollowCounts,
          request,
          response,
        });

        const controller = new FollowsController();

        await templateService.apiHandler({
          methodName: "getFollowCounts",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsFollowsController_isFollowing: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    userId: { in: "path", name: "userId", required: true, dataType: "double" },
  };
  app.get(
    "/follows/status/:userId",
    ...fetchMiddlewares<RequestHandler>(FollowsController),
    ...fetchMiddlewares<RequestHandler>(
      FollowsController.prototype.isFollowing
    ),

    async function FollowsController_isFollowing(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsFollowsController_isFollowing,
          request,
          response,
        });

        const controller = new FollowsController();

        await templateService.apiHandler({
          methodName: "isFollowing",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsCommentController_createComment: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/comment",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(CommentController),
    ...fetchMiddlewares<RequestHandler>(
      CommentController.prototype.createComment
    ),

    async function CommentController_createComment(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsCommentController_createComment,
          request,
          response,
        });

        const controller = new CommentController();

        await templateService.apiHandler({
          methodName: "createComment",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_signUp: Record<string, TsoaRoute.ParameterSchema> = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    body: { in: "body", name: "body", required: true, ref: "SignUpDto" },
  };
  app.post(
    "/auth/signup",
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.signUp),

    async function AuthController_signUp(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_signUp,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: "signUp",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: 201,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_checkId: Record<string, TsoaRoute.ParameterSchema> =
    {
      username: {
        in: "query",
        name: "username",
        required: true,
        dataType: "string",
      },
    };
  app.get(
    "/auth/signup/check-id",
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.checkId),

    async function AuthController_checkId(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_checkId,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: "checkId",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_signIn: Record<string, TsoaRoute.ParameterSchema> = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
    body: { in: "body", name: "body", required: true, ref: "SignInDto" },
  };
  app.post(
    "/auth/signin",
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.signIn),

    async function AuthController_signIn(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_signIn,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: "signIn",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_refreshAccessToken: Record<
    string,
    TsoaRoute.ParameterSchema
  > = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/auth/refresh",
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(
      AuthController.prototype.refreshAccessToken
    ),

    async function AuthController_refreshAccessToken(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_refreshAccessToken,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: "refreshAccessToken",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  const argsAuthController_logout: Record<string, TsoaRoute.ParameterSchema> = {
    req: { in: "request", name: "req", required: true, dataType: "object" },
  };
  app.post(
    "/auth/logout",
    authenticateMiddleware([{ jwt: [] }]),
    ...fetchMiddlewares<RequestHandler>(AuthController),
    ...fetchMiddlewares<RequestHandler>(AuthController.prototype.logout),

    async function AuthController_logout(
      request: ExRequest,
      response: ExResponse,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = [];
      try {
        validatedArgs = templateService.getValidatedArgs({
          args: argsAuthController_logout,
          request,
          response,
        });

        const controller = new AuthController();

        await templateService.apiHandler({
          methodName: "logout",
          controller,
          response,
          next,
          validatedArgs,
          successStatus: undefined,
        });
      } catch (err) {
        return next(err);
      }
    }
  );
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
    return async function runAuthenticationMiddleware(
      request: any,
      response: any,
      next: any
    ) {
      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      // keep track of failed auth attempts so we can hand back the most
      // recent one.  This behavior was previously existing so preserving it
      // here
      const failedAttempts: any[] = [];
      const pushAndRethrow = (error: any) => {
        failedAttempts.push(error);
        throw error;
      };

      const secMethodOrPromises: Promise<any>[] = [];
      for (const secMethod of security) {
        if (Object.keys(secMethod).length > 1) {
          const secMethodAndPromises: Promise<any>[] = [];

          for (const name in secMethod) {
            secMethodAndPromises.push(
              expressAuthenticationRecasted(
                request,
                name,
                secMethod[name],
                response
              ).catch(pushAndRethrow)
            );
          }

          // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

          secMethodOrPromises.push(
            Promise.all(secMethodAndPromises).then((users) => {
              return users[0];
            })
          );
        } else {
          for (const name in secMethod) {
            secMethodOrPromises.push(
              expressAuthenticationRecasted(
                request,
                name,
                secMethod[name],
                response
              ).catch(pushAndRethrow)
            );
          }
        }
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      try {
        request["user"] = await Promise.any(secMethodOrPromises);

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }

        next();
      } catch (err) {
        // Show most recent error as response
        const error = failedAttempts.pop();
        error.status = error.status || 401;

        // Response was sent in middleware, abort
        if (response.writableEnded) {
          return;
        }
        next(error);
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    };
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
