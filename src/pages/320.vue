<script setup>
import { importantInfo_320, mockData_320 } from "@fakedb";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

const currentActiveElement = ref(null);
const animatedCircle = ref();
const animating = ref(false);

const activeElement = computed(() => {
  if (currentActiveElement.value)
    return mockData_320[currentActiveElement.value - 1];
  return null;
});

const animateElement = (element, duration) => {
  return new Promise((resolve) => {
    element.classList.add("scaling");
    setTimeout(() => {
      element.classList.remove("scaling");
      resolve();
    }, duration);
  });
};

const animateAllElements = async () => {
  const elements = document.querySelectorAll(".hotspot");
  const duration = 800;

  while (true && !currentActiveElement.value) {
    for (const element of elements) {
      if (!currentActiveElement.value) {
        await animateElement(element, duration);
      }
    }
  }
};

const toggleActiveElement = (elementId) => {
  if (animating.value === true) return;
  const image = animatedCircle.value.querySelector("img");

  if (currentActiveElement.value == elementId) {
    animating.value = true;
    currentActiveElement.value = null;
    setTimeout(() => {
      animatedCircle.value.classList.add("closed");
      setTimeout(() => {
        const element = document.querySelector(`.hotspot-${elementId}`);
        animatedCircle.value.classList.remove(`circle-hotspot-${elementId}`);
        element
          .querySelector(".red_hotspot")
          .classList.remove("red_hotspot-hidden");
        element.querySelector(".grey_hotspot").classList.remove("active");
        image.classList.remove("hotspot-image");
        animatedCircle.value.classList.remove("closed");
        animatedCircle.value.style.width = "48%";
        animatedCircle.value.style.height = "44%";
        setTimeout(() => {
          animatedCircle.value.style.animation = "";
          void animatedCircle.value.offsetHeight;
          animating.value = false;
        }, 400);
        animateAllElements();
      }, 400);
    }, 300);
  } else {
    animating.value = true;
    mockData_320.forEach((item, idx) => {
      const element = document.querySelector(`.hotspot-${item.id}`);

      setTimeout(() => {
        animatedCircle.value.classList.remove(`circle-hotspot-${item.id}`);
        element
          .querySelector(".red_hotspot")
          .classList.remove("red_hotspot-hidden");
        element.querySelector(".grey_hotspot").classList.remove("active");
      }, 400);

      if (idx == mockData_320.length - 1) {
        currentActiveElement.value = elementId;
        animatedCircle.value.style.animationPlayState = "paused";
        const computedStyles = getComputedStyle(animatedCircle.value);
        const width = computedStyles.getPropertyValue("width");
        const height = computedStyles.getPropertyValue("height");
        animatedCircle.value.style.height = height;
        animatedCircle.value.style.width = width;
        animatedCircle.value.style.animation = "none";
        setTimeout(() => {
          animatedCircle.value.classList.add("closed");
          setTimeout(() => {
            image.classList.add("hotspot-image");
            const element = document.querySelector(`.hotspot-${elementId}`);
            animatedCircle.value.classList.add(`circle-hotspot-${elementId}`);
            element
              .querySelector(".red_hotspot")
              .classList.add("red_hotspot-hidden");
            element.querySelector(".grey_hotspot").classList.add("active");

            setTimeout(() => {
              animatedCircle.value.style.width = "38%";
              animatedCircle.value.style.height = "35%";
              animatedCircle.value.classList.remove("closed");
              animating.value = false;
            }, 300);
          }, 300);
        }, 200);
      }
    });
  }
};

const resizeOverlay = () => {
  const clearVassel = getComputedStyle(
    document.querySelector(".clear__vassel")
  );
  const animatedCircle = document.querySelector(".animatedCircle");

  animatedCircle.style.width = clearVassel.width;
};

onMounted(() => {
  animateAllElements();
  resizeOverlay();

  window.addEventListener("resize", () => {
    resizeOverlay();
  });
});
</script>

<template>
  <div class="container w-100 mx-auto position-relative">
    <div
      class="d-flex flex-column align-center justify-start content w-100 h-auto overflow-x-hidden"
    >
      <div class="header">
        <p class="intro-text-title">The SAPIEN 3 Ultra RESILIA valve</p>
      </div>
      <div class="vassel d-flex align-start justify-center position-relative">
        <img
          src="../assets/images/Valve_Clear.webp"
          alt="vassel_clear"
          class="clear__vassel"
          height="auto"
        />
        <div class="overlay position-absolute w-100 h-100">
          <div class="hotspots w-100 h-100 position-relative">
            <div
              :class="`hotspot position-absolute d-flex align-center justify-center hotspot-${element.id}`"
              v-for="element in mockData_320"
            >
              <img
                src="../assets/images/RedHotSpot.png"
                alt="red_hotspot"
                height="25px"
                width="25px"
                @click="toggleActiveElement(element.id)"
                class="red_hotspot"
              />
              <img
                src="../assets/images/GreyHotSpot.png"
                alt="grey_hotspot"
                height="19px"
                width="19px"
                class="grey_hotspot position-absolute"
              />
              <div
                class="position-absolute hotspot-title"
                v-html="element.title"
                :style="{
                  opacity: currentActiveElement == element.id ? '1' : '0',
                  transition: '.7s',
                }"
              />
            </div>
          </div>
          <div
            class="position-absolute d-flex align-center justify-center circle-wrapper"
          >
            <div
              ref="animatedCircle"
              class="position-relative circle rounded-circle"
            >
              <img
                src="../assets/images/Valve_Clear.png"
                alt="vassel_clear"
                height="auto"
                class="position-absolute animatedCircle"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="vassel__info px-4 mt-n2 position-relative w-100">
        <div class="d-flex justify-space-between">
          <div>
            <div
              class="intro-text d-flex align-start justify-start w-100 flex-column mb-2"
            >
              <p
                v-if="!activeElement"
                v-motion-fade
                class="text-primary mb-0 intro-text-desc"
                style="margin-top: 42px"
                v-motion
                :leave="{ opacity: 0, transtion: { duration: 1000 } }"
              >
                Tap to reveal the real-world outcomes
              </p>
            </div>
            <div
              class="hotspot-info"
              v-if="activeElement"
              v-motion
              :initial="{ y: 10, opacity: 0 }"
              :enter="{ opacity: 1, y: 0, transition: { duration: 300 } }"
            >
              <button class="bg-primary rounded-lg font-weight-bold py-1 px-4">
                Explore the valve
              </button>
              <p
                class="mt-2"
                style="padding-inline-end: 10px;"
                v-html="activeElement?.text"
              ></p>
            </div>
          </div>
          <img
            src="../assets/images/ELS_TM_Light.webp"
            alt="edw_logo"
            class="edw_logo"
          />
        </div>
      </div>
    </div>
    <div class="important__info text-black px-2">
      <OverlayScrollbarsComponent
        class="custom-scroll"
        :options="{
          scrollbars: {
            visibility: 'visible',
            autoHide: 'never',
            theme: 'os-theme-dark',
            overflow: {
              x: 'visible',
              y: 'scroll',
            },
          },
        }"
      >
        <p style="font-size: 11px" v-html="importantInfo_320" />
      </OverlayScrollbarsComponent>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 320px;
  max-height: 480px;
  padding: 12px;
  box-shadow: 0px 0px 5px rgba(128, 128, 128, 0.645);
  border-radius: 3px;
  overflow-y: scroll;

  .header {
    position: relative;
    background-color: rgba(var(--v-theme-primary));
    padding: 0.4em;
    width: 89%;
    margin-block-start: 0.5em;
  }

  .header::after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    left: -10px;
    bottom: -10px;
    background-color: rgba(var(--v-theme-primary));
  }

  .header .intro-text-title {
    font-size: 13px;
    line-height: unset !important;
    color: #fff;
  }

  .edw_logo {
    width: 20%;
    align-self: end;
  }

  .content {
    border: 2px solid rgba(var(--v-theme-lightGrey));
    overflow-y: hidden;

    .vassel {
      width: 100%;
      height: fit-content;
      transition: 0.3s;
      margin-block-start: 10px;

      .clear__vassel {
        width: 100%;
        height: auto;
      }

      .blur__vassel {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .overlay {
        background-color: rgba(255, 255, 255, 0.5);
        -webkit-backdrop-filter: blur(5px);
        backdrop-filter: blur(5px);

        .circle-wrapper {
          inset: 0;
          z-index: -1;
        }

        .circle {
          top: 10%;
          height: 44%;
          width: 48%;
          border: 2px solid rgba(var(--v-theme-darkGrey));
          z-index: 999;
          transition: width 0.3s ease, height 0.3s ease;
          animation: circle 3s linear infinite;
          animation-iteration-count: 2;
          animation-delay: 1s;
          overflow: hidden;

          img {
            margin-top: -26px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            height: auto;
            object-fit: cover;
          }
        }

        .circle-hotspot-1 {
          top: -6.2%;
          left: -6%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: 16px;
            margin-top: 33px !important;
          }

          // @media screen and (max-width: 500px) {
          //   top: -5.2%;
          // }
        }

        .circle-hotspot-2 {
          top: -5%;
          left: 15%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: -45px;
            margin-top: 31px !important;
          }

          // @media screen and (max-width: 480px) {
          //   top: -3%;
          // }
        }

        .circle-hotspot-3 {
          top: 22%;
          left: 7%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: -20px;
            margin-top: -60px !important;
          }
          // @media screen and (max-width: 500px) {
          //   top: 19%;
          //   left: 13%;
          // }
        }

        .circle-hotspot-4 {
          top: 18%;
          left: -25%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: 74px;
            margin-top: -45px !important;
          }
          // @media screen and (max-width: 500px) {
          //   top: 17.5%;
          // }
        }

        .red_hotspot {
          transition: 0.3s;
        }

        .red_hotspot-hidden {
          scale: 0.8;
          opacity: 0;
          transition: 0.3s;
        }

        .hotspot {
          img {
            cursor: pointer;
          }
        }

        .hotspot-1 {
          top: 25%;
          left: 31%;
        }

        .hotspot-2 {
          top: 29%;
          right: 18%;
        }

        .hotspot-3 {
          bottom: 12%;
          right: 24%;
        }

        .hotspot-4 {
          bottom: 12%;
          left: 18%;
        }

        .grey_hotspot {
          opacity: 0;
          pointer-events: none;
          transition: 0.3s;
        }

        .grey_hotspot.active {
          opacity: 1;
          transition: 0.3s;
        }

        .hotspot-title {
          width: 29px;
          height: 100%;
          pointer-events: none;
          font-weight: bold;
          line-height: 17px;
          color: rgb(113, 113, 113);
          font-size: 14px;
        }
      }
    }

    .hotspot-info {
      p {
        font-size: 9px;
      }
    }

    .vassel__info {
      z-index: 9999;
      height: 150px;

      .intro-text {
        p {
          font-family: "VestaStd-Bold", sans-serif;
        }

        .intro-text-desc {
          font-size: 26.5px;
          line-height: 30px !important;
          margin-right: 6px;

          // @media screen and (max-width: 500px) {
          //   font-size: 9vw;
          //   line-height: 8.2vw !important;
          // }

          // @media screen and (max-width: 390px) {
          //   font-size: 8.8vw;
          //   line-height: 8.2vw !important;
          // }
        }
      }

      btn {
        letter-spacing: 2px;
        font-size: 20px;
        cursor: pointer;
      }
    }
  }

  .important__info {
    margin: 16px -5px 0px -5px;
    font-size: 10.4px;
    line-height: 13px;
    font-family: "VestaStd-Regular", sans-serif;
  }

  .custom-scroll {
    max-height: 109.5px;
    padding-right: 20px;
    overflow: unset !important;
  }

  :deep(.os-scrollbar-track) {
    background: #ddd;
    border-radius: 10px;
    height: calc(100% + 10px);
  }

  :deep(.os-scrollbar-handle) {
    background: rgb(172, 172, 172);
    border-radius: 50%;
    width: 12px;
    height: 12px;
    left: -3px;
    max-height: unset;
    min-height: unset;
  }

  :deep(.os-scrollbar-horizontal) {
    display: none;
  }
  .scaling {
    animation: pulse 0.7s forwards;
  }

  .closed {
    border: none !important;
    height: 0px !important;
    width: 0px !important;
    transition: 0.3s !important;
  }

  .hotspot-image {
    margin-left: 15px;
    margin-top: 10px !important;
  }
}
</style>
