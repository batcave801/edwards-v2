<script setup>
import { importantInfo, mockData } from "@fakedb";
import { OverlayScrollbarsComponent } from "overlayscrollbars-vue";

const currentActiveElement = ref(null);
const animatedCircle = ref();
const animating = ref(false);

const activeElement = computed(() => {
  if (currentActiveElement.value)
    return mockData[currentActiveElement.value - 1];
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
    mockData.forEach((item, idx) => {
      const element = document.querySelector(`.hotspot-${item.id}`);

      setTimeout(() => {
        animatedCircle.value.classList.remove(`circle-hotspot-${item.id}`);
        element
          .querySelector(".red_hotspot")
          .classList.remove("red_hotspot-hidden");
        element.querySelector(".grey_hotspot").classList.remove("active");
      }, 400);

      if (idx == mockData.length - 1) {
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
    <img
      src="../assets/images/ELS_TM_Light.webp"
      alt="edw_logo"
      class="position-absolute edw_logo"
    />
    <div
      class="d-flex flex-column align-center justify-start content w-100 h-auto pb-5"
    >
      <div
        class="vassel d-flex align-start justify-center position-relative mt-n1"
      >
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
              v-for="element in mockData"
            >
              <img
                src="../assets/images/RedHotSpot.png"
                alt="red_hotspot"
                height="35px"
                width="35px"
                @click="toggleActiveElement(element.id)"
                class="red_hotspot"
              />
              <img
                src="../assets/images/GreyHotSpot.png"
                alt="grey_hotspot"
                height="29px"
                width="29px"
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
        <div
          class="intro-text d-flex align-start justify-start w-100 flex-column mb-2"
        >
          <p class="text-darkGrey intro-text-title">
            The SAPIEN 3 Ultra RESILIA valve
          </p>
          <p
            v-if="!activeElement"
            v-motion-fade
            class="text-primary mt-4 mb-0 intro-text-desc"
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
          <button class="bg-primary rounded-lg font-weight-bold py-3 px-4">
            Explore the valve
          </button>
          <p
            class="mt-2 pe-lg-16 pe-md-16 pe-sm-16 pe-14"
            v-html="activeElement?.text"
          ></p>
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
        <p v-html="importantInfo" />
      </OverlayScrollbarsComponent>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 550px;
  max-height: 1000px;
  padding: 12px;
  box-shadow: 0px 0px 5px rgba(128, 128, 128, 0.645);
  border-radius: 3px;

  .edw_logo {
    top: 30px;
    right: 16px;
    width: 15%;
    z-index: 999;
  }

  .content {
    border: 2px solid rgba(var(--v-theme-lightGrey));
    overflow-y: hidden;

    .vassel {
      width: 100%;
      height: fit-content;
      transition: 0.3s;

      .clear__vassel {
        width: 100%;
        height: auto;
        margin-top: 28px;
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
            margin-left: 38px;
            margin-top: 56px !important;
          }

          @media screen and (max-width: 500px) {
            top: -5.2%;
          }
        }

        .circle-hotspot-2 {
          top: -5%;
          left: 15%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: -76px;
            margin-top: 50px !important;
          }

          @media screen and (max-width: 480px) {
            top: -3%;
          }
        }

        .circle-hotspot-3 {
          top: 20%;
          left: 13%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: -76px;
            margin-top: -98px !important;
          }

          @media screen and (max-width: 500px) {
            top: 19%;
            left: 13%;
          }
        }

        .circle-hotspot-4 {
          top: 18%;
          left: -25%;
          height: 35%;
          width: 38%;
          transition: 0.3s;

          img {
            margin-left: 131px;
            margin-top: -87px !important;
          }

          @media screen and (max-width: 500px) {
            top: 17.5%;
          }
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

      .intro-text {
        p {
          font-family: "VestaStd-Bold", sans-serif;
        }

        .intro-text-title {
          font-size: 20px;
          line-height: unset !important;

          @media screen and (max-width: 368px) {
            font-size: 4.99vw !important;
          }
        }

        .intro-text-desc {
          font-size: 36px;
          line-height: 30px !important;

          @media screen and (max-width: 500px) {
            font-size: 9vw;
            line-height: 8.2vw !important;
          }

          @media screen and (max-width: 390px) {
            font-size: 8.8vw;
            line-height: 8.2vw !important;
          }
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
    font-size: 15px;
    line-height: 15px;
    font-family: "VestaStd-Regular", sans-serif;

    @media screen and (max-width: 420px) {
      font-size: 12px;
      line-height: 15px;
    }

    @media screen and (max-width: 390px) {
      font-size: 11.8px;
    }

    @media screen and (max-width: 375px) {
      font-size: 11px;
      line-height: 13px;
    }

    @media screen and (max-width: 360px) {
      font-size: 10.4px;
    }
  }

  .custom-scroll {
    max-height: 109.5px;
    padding-right: 20px;
    overflow: unset !important;
  }

  :deep(.os-scrollbar-track) {
    background: #ddd;
    border-radius: 10px;
    height: calc(100% + 15px);
  }

  :deep(.os-scrollbar-vertical) {
    padding-inline: 1px !important;
  }

  :deep(.os-scrollbar-handle) {
    background: rgb(172, 172, 172);
    border-radius: 50%;
    width: 20px;
    height: 20px;
    left: -6px;
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
