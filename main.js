document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute("data-src");
          img.setAttribute("src", src);
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "100px",
    }
  );

  document.querySelectorAll("img[data-src]").forEach((img) => {
    observer.observe(img);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  const ctl = new CollapsibleTimeline("#timeline");
});

class CollapsibleTimeline {
  constructor(el) {
    this.el = document.querySelector(el);
    this.init();
  }

  init() {
    this.el?.addEventListener("click", this.itemAction.bind(this));
    this.expandAllItems();
  }

  expandAllItems() {
    const items = this.el.querySelectorAll(".timeline__arrow");
    items.forEach((button) => {
      const itemID = button.getAttribute("data-item");
      const ctrld = this.el.querySelector(`#item${itemID}-ctrld`);
      if (ctrld) {
        button.setAttribute("aria-expanded", "true");
        ctrld.removeAttribute("aria-hidden");
        ctrld.classList.add("timeline__item-body--expanded");
        const content = ctrld.querySelector(".timeline__item-body-content");
        content.style.opacity = 1;
        content.style.visibility = "visible";
      }
    });
  }

  animateItemAction(button, ctrld, contentHeight, shouldCollapse) {
    const expandedClass = "timeline__item-body--expanded";
    const animOptions = {
      duration: 300,
      easing: "cubic-bezier(0.65,0,0.35,1)",
    };

    if (shouldCollapse) {
      button.ariaExpanded = "false";
      ctrld.ariaHidden = "true";
      ctrld.classList.remove(expandedClass);
      animOptions.duration *= 2;
      this.animation = ctrld.animate(
        [
          { height: `${contentHeight}px` },
          { height: `${contentHeight}px` },
          { height: "0px" },
        ],
        animOptions
      );
    } else {
      button.ariaExpanded = "true";
      ctrld.ariaHidden = "false";
      ctrld.classList.add(expandedClass);
      this.animation = ctrld.animate(
        [{ height: "0px" }, { height: `${contentHeight}px` }],
        animOptions
      );
    }
  }
  itemAction(e) {
    const { target } = e;
    const action = target?.getAttribute("data-action");
    const item = target?.getAttribute("data-item");

    if (action) {
      const targetExpanded = action === "expand" ? "false" : "true";
      const buttons = Array.from(
        this.el?.querySelectorAll(`[aria-expanded="${targetExpanded}"]`)
      );
      const wasExpanded = action === "collapse";

      for (let button of buttons) {
        const buttonID = button.getAttribute("data-item");
        const ctrld = this.el?.querySelector(`#item${buttonID}-ctrld`);
        const contentHeight = ctrld.firstElementChild?.offsetHeight;

        this.animateItemAction(button, ctrld, contentHeight, wasExpanded);
      }
    } else if (item) {
      const button = this.el?.querySelector(`[data-item="${item}"]`);
      const expanded = button?.getAttribute("aria-expanded");

      if (!expanded) return;

      const wasExpanded = expanded === "true";
      const ctrld = this.el?.querySelector(`#item${item}-ctrld`);
      const contentHeight = ctrld.firstElementChild?.offsetHeight;

      this.animateItemAction(button, ctrld, contentHeight, wasExpanded);
    }
  }
}

function swapImage(element, newImageSrc) {
  element.src = newImageSrc;
}
