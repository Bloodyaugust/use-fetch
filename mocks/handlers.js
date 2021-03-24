import { rest } from 'msw';

const posts = [
  {
    user: 1,
    content: 'lorem ipsum',
    created: '1/15/2021'
  }
];

export const handlers = [
  rest.get('https://test.com/posts', (request, response, context) => {
    return response(
      context.status(200),
      context.json({
        posts: posts
      })
    );
  }),
  rest.get('https://test.com/404', (request, response, context) => {
    return response(
      context.status(404)
    );
  }),
  rest.get('https://test.com/wait', (request, response, context) => {
    return response(
      context.delay(100),
      context.status(200)
    );
  })
];
