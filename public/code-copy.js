document.addEventListener("DOMContentLoaded", () => {
  const copyButtonLabel = "copy";

  for (const codeBlock of document.querySelectorAll("pre")) {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const copyButton = document.createElement("button");
    copyButton.className =
      "opacity-0 focus:opacity-100 focus:outline-base-600 dark:focus:outline-base-400 group-hover:opacity-100 w-16 transition-opacity duration-500 absolute top-3 right-3 text-xs bg-base-200 dark:bg-base-800 outline outline-base-400 dark:outline-base-800 py-1 px-2 rounded-xl dark:hover:bg-base-700 hover:bg-base-300";
    copyButton.textContent = copyButtonLabel;

    codeBlock.classList.add("group");
    codeBlock.setAttribute("tabindex", "0");
    codeBlock.appendChild(copyButton);

    const parent = codeBlock.parentNode;
    if (parent) {
      parent.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);
    }

    copyButton.addEventListener("click", async () => {
      const code = codeBlock.querySelector("code");
      if (!code) return;

      await navigator.clipboard.writeText(code.innerText);
      const oldLabel = copyButton.innerText;
      const oldClassName = copyButton.className;
      copyButton.className =
        "opacity-100 transition-opacity duration-500 w-16 absolute top-3 right-3 text-xs bg-green-200 dark:bg-green-900 outline outline-green-300 dark:outline-green-700 text-green-800 dark:text-green-300 py-1 px-2 rounded-xl";
      copyButton.textContent = "copied";

      setTimeout(() => {
        copyButton.textContent = oldLabel;
        copyButton.className = oldClassName;
      }, 2000);
    });
  }
});
