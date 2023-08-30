import { act, renderHook } from "@testing-library/react-hooks";
import useFetch from "../main.js";

describe("use-fetch", () => {
  describe("#execute", () => {
    it("provides the response object", async () => {
      const { result } = renderHook(() => useFetch());

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ response }) => {
            expect(response).toBeInstanceOf(Response);
          });
      });
    });

    it("provides the response as json", async () => {
      const { result } = renderHook(() => useFetch());

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ json }) => {
            expect(json).toEqual({
              posts: [
                { content: "lorem ipsum", created: "1/15/2021", user: 1 },
              ],
            });
          });
      });
    });

    it("does not provide json if noJSON prop is set", async () => {
      const { result } = renderHook(() =>
        useFetch({
          noJSON: true,
        })
      );

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ json }) => {
            expect(json).toBeUndefined();
          });
      });
    });

    it("provides the mounted state of the hook", async () => {
      const { result, unmount } = renderHook(() => useFetch());

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ mounted }) => {
            expect(mounted).toBe(true);
          });
      });

      unmount();

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ mounted }) => {
            expect(mounted).toBe(false);
          });
      });
    });

    it("rejects failed requests with response object, error, and mounted state", async () => {
      const { result } = renderHook(() => useFetch());

      await act(async () => {
        await result.current
          .execute("https://test.com/404")
          .catch(({ response, error, mounted }) => {
            expect(response).toBeInstanceOf(Response);
            expect(error.message).toEqual("Request failed: 404");
            expect(mounted).toBe(true);
          });
      });
    });

    it("cancels requests still in flight when unmounted and provides error object", async () => {
      const { result, unmount } = renderHook(() => useFetch());

      await act(async () => {
        unmount();

        await result.current
          .execute("https://test.com/wait")
          .catch(({ error }) => {
            expect(error.message).toEqual("The user aborted a request.");
          });
      });
    });

    it("uses a unique abortcontroller for each request", async () => {
      const { rerender, result, unmount } = renderHook(() => useFetch());

      await act(async () => {
        unmount();

        await result.current
          .execute("https://test.com/wait")
          .catch(({ error }) => {
            expect(error.message).toEqual("The user aborted a request.");
          });
      });

      rerender();

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ mounted }) => {
            expect(mounted).toBe(true);
          });
      });
    });
  });

  describe("#completed", () => {
    it("provides the completed status", async () => {
      const { result } = renderHook(() => useFetch());

      expect(result.current.completed).toBe(false);

      await act(async () => {
        await result.current
          .execute("https://test.com/posts")
          .then(({ response }) => {
            expect(response).toBeInstanceOf(Response);
            expect(result.current.completed).toBe(true);
          });
      });
    });
  });
});
