# Trigger a file download

This one's a simple scenario: you get some contents (string) from an API call and then you have to convert that into a file and download it on the user's browser.

It's so common that there are even node packages but that is an overkill.

This is the snippet I use to do just that.

```js
const downloadFile = ({ contents, fileName }) => {
  try {
    const file = new File([contents], fileName);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = URL.createObjectURL(file);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }, 0);
    return {};
  } catch (e) {
    return { error: e };
  }
};
```

This download function is a lot safer. This is because we do all the file downloading in a `try` block. Suppose the file contents are not string or if the browser has some problems create the `file` through `new File(...)`, you will get an error returned.

```js
const { error } = downloadFile({ contents: ..., fileName: ... })
if (error) {
  // handle error case
}
```
