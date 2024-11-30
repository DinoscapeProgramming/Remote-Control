# How To Debug
1. Enable "Debug Mode" on the "Settings" page of Remote Control.
2. Open the "Debug Mode" page.
3. You can now:
  * Type in code to be run in the main process using the bottom input field of the main page. Use the `log` function like this to log back information to the renderer process:
  ```js
    for (let i = 0; i < 10; i++) {
      log(`This is log number ${i + 1}!`);
    };
  ```
  This will log:

  ```json
  [1] "This is log number 1!"
  [2] "This is log number 2!"
  [3] "This is log number 3!"
  [4] "This is log number 4!"
  [5] "This is log number 5!"
  [6] "This is log number 6!"
  [7] "This is log number 7!"
  [8] "This is log number 8!"
  [9] "This is log number 9!"
  [10] "This is log number 10!"
  ```

  * Modify the position of the developer tools using the `devTools` API like this:
  ```js
    devTools.left();
    devTools.right(); // Default behaviour
    devTools.detach();
    devTools.close();
  ```