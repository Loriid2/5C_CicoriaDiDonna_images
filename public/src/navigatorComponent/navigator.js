const hide = (elements) => {
    elements.forEach((element) => {
        element.classList.add("hide");
    });
}

const show = (element) => {
    element.classList.remove("hide");
}

export const createNavigator = () => {

    const render = () => {
        const pages = Array.from(document.querySelectorAll(".page"));
        const url = new URL(document.location.href);
        const pageName = url.hash.replace("#", "");
        const selected = pages.filter((page) => page.id === pageName)[0] || pages[0];
        hide(pages);
        show(document.getElementById("spinner"));
        setTimeout(() => {
            console.log("Loading Done!");
            document.getElementById("spinner").classList.add("hide");
            show(selected);
        }, 2000);
    }
    window.addEventListener('popstate', render);
    render();
}