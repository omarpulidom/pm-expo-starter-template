// polyfill throwIfAborted which seems to be missing in react-native, but ky
// uses it
//
// Fun fact, AbortSignal here is just a react-native polyfill, too:
// https://github.com/facebook/react-native/blob/838d26d7b534133e75c7fa673dfc849b0e64c9d3/packages/react-native/Libraries/Core/setUpXHR.js#L38
//
// ref: https://github.com/tjmehta/fast-abort-controller/blob/42588908035d1512f90e7299a2c70dfb708f9620/src/FastAbortSignal.ts#L39
if (!AbortSignal.prototype.throwIfAborted) {
  AbortSignal.prototype.throwIfAborted = function () {
    if (this.aborted) {
      throw new Error('Aborted')
    }
  }
}
