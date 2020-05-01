const { pipe, listen, empty, never, teardown } = require("../dist/agos.cjs");

describe("empty", () => {
  it("should propagate completion", () => {
    const open = jest.fn();
    const next = jest.fn();
    const fail = jest.fn();
    const done = jest.fn(cancelled => expect(cancelled).toEqual(false));

    pipe(
      empty(),
      listen(open, next, fail, done)
    );

    expect(open).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it("should propagate cancellation on open", () => {
    const abort = teardown(never());

    const open = jest.fn(() => abort.run());
    const next = jest.fn();
    const fail = jest.fn();
    const done = jest.fn(cancelled => expect(cancelled).toEqual(true));

    pipe(
      empty(),
      listen(open, next, fail, done, abort)
    );

    expect(open).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it("should not propagate cancellation before open", () => {
    const abort = teardown(never());

    const open = jest.fn();
    const next = jest.fn();
    const fail = jest.fn();
    const done = jest.fn(cancelled => expect(cancelled).toEqual(false));

    abort.run();

    pipe(
      empty(),
      listen(open, next, fail, done, abort)
    );

    expect(open).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
  });

  it("should not propagate cancellation after open", () => {
    const abort = teardown(never());

    const open = jest.fn();
    const next = jest.fn();
    const fail = jest.fn();
    const done = jest.fn(cancelled => expect(cancelled).toEqual(false));

    pipe(
      empty(),
      listen(open, next, fail, done, abort)
    );

    abort.run();

    expect(open).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(0);
    expect(fail).toHaveBeenCalledTimes(0);
    expect(done).toHaveBeenCalledTimes(1);
  });
});
