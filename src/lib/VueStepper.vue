<template>
  <div class="container" :class="props.outerContainerClass">
    <div class="progress__container" :class="props.innerContainerClass">
      <div class="progress__circles" :class="props.circlesContainerClass">
        <div
          v-for="(_, index) in steps"
          class="progress__circle_item"
          :class="{
					  completed: index < props.activeStepIndex,
          	active: index === props.activeStepIndex,
						[props.singleCircleCompletedClass]: props.singleCircleCompletedClass,
						[props.singleCircleActiveClass]: props.singleCircleActiveClass,
          	[props.singleCircleNotCompletedClass]: props.singleCircleNotCompletedClass,
          	[props.singleCircleClass]: props.singleCircleClass,
          }"
          :key="index"
        >
          <div class="init" :class="props.innerCircleBlockClass">{{ index + 1 }}</div>
        </div>
      </div>
      <div class="progress__bar" :class="props.barContainerClass">
        <div class="progress__bar_inner" ref="progressBar" :class="props.innerBarClass"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, toRef, watch} from "vue";

interface IProps {
  stepsLength: number | string;
  activeStepIndex: number;
  outerContainerClass?: string;
  innerContainerClass?: string;
  circlesContainerClass?: string;
  innerCircleBlockClass?: string;
  singleCircleClass?: string;
	singleCircleCompletedClass?: string;
	singleCircleActiveClass?: string;
	singleCircleNotCompletedClass?: string;
  barContainerClass?: string;
  innerBarClass?: string;
}

const name = 'vue-stepper';

const props = withDefaults(defineProps<IProps>(), {
  outerContainerClass: '',
  innerContainerClass: '',
  circlesContainerClass: '',
  innerCircleBlockClass: '',
  singleCircleClass: '',
	singleCircleActiveClass: '',
	singleCircleCompletedClass: '',
	singleCircleNotCompletedClass: '',
  barContainerClass: '',
  innerBarClass: '',
});

const emit = defineEmits(['update:activeStepIndex']);

const activeStepIndex = toRef(props, 'activeStepIndex');
const progressBar = ref<HTMLDivElement>();

if (!props.stepsLength || !activeStepIndex) throw new Error('No required props where passed as props.');
if (props.stepsLength < 2) throw new Error('The value of steps-length prop should be more than one.');

const steps = Array(+props.stepsLength).fill(1).map((_, index) => {
  const step = { completed: false, active: false };
  if (index < activeStepIndex.value) step.completed = true;
  if (index === activeStepIndex.value) step.active = true;
  return step;
});

onMounted(() => {
  _paint();
});

watch(activeStepIndex, () => {
  _paint();
})

function goForwards() {
  if (activeStepIndex.value + 1 > steps.length - 1) return;
  activeStepIndex.value++;
  emit('update:activeStepIndex', activeStepIndex.value);
}

function goBack() {
  if (activeStepIndex.value - 1 < 0) return;
  activeStepIndex.value--;
  emit('update:activeStepIndex', activeStepIndex);
}

function goToStep(stepNumber = activeStepIndex.value + 1) {
  if (stepNumber < 0 || stepNumber > steps.length - 1) return;
  emit('update:activeStepIndex', stepNumber);
}

function _paint() {
  if (!progressBar.value) return;
  progressBar.value.style.width = `${100 / (steps.length - 1) * activeStepIndex.value}%`;
}
</script>

<style lang="scss" scoped>
$circleGreen: #1565c0;
$progressBarEmptyColor: #b7b7b7;
$progressBarDuration: 0.5s;

.container {
  max-width: 1024px;
  margin: 0 auto;
}

.progress__container {
  position: relative;
  font-size: 1rem;
  font-family: inherit;
}

.progress__circles {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  & .progress__circle_item {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: white;
    z-index: 5;
    width: 40px;
    height: 40px;
    transition: all $progressBarDuration;

    &:not(.completed)::after {
      content: '';
      position: absolute;
      box-shadow: 0 0 5px $circleGreen;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      padding: 20px;
      opacity: 0;
      z-index: 2;
      transition: all calc($progressBarDuration / 2) ease-in calc($progressBarDuration / 1.3);
    }

    &:not(.completed):not(.active) {
      box-shadow: 0 0 5px $circleGreen;
      transition-delay: calc($progressBarDuration / 2);
    }

    &.completed {
      background-color: $circleGreen;
      box-shadow: 0 0 4px 1px #012d62;
      color: white;
    }

    &.active {
      box-shadow: 0 0 6px 2px $circleGreen;

      &::after {
        box-shadow: 0 0 6px 2px $circleGreen;
        padding: 8px;
        opacity: 1;
      }
    }

    & .init {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.progress__bar {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  height: 2px;
  width: 100%;
  z-index: 1;
  background-color: $progressBarEmptyColor;
}

.progress__bar_inner {
  height: 100%;
  width: 0;
  background-color: $circleGreen;
  transition: width $progressBarDuration ease-in 0s;
}

@media (max-width: 1050px) {
  .progress__container {
    margin-left: 16px;
    margin-right: 16px;
  }
}

@media (max-width: 200px) {
  .progress__circle_item.active {
    box-shadow: 0 0 7px 3px $circleGreen !important;
    &::after {
      display: none;
    }
  }
}
</style>